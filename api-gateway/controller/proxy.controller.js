import axios from "axios";

// RFC 2616 §13.5.1 — hop-by-hop headers must never be forwarded by a proxy.
// Using Set for O(1) lookup (consistent with METHODS_WITH_BODY below).
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "te",
  "trailer",
  "upgrade",
  "proxy-authorization",
  "proxy-authenticate",
  "host", // Gateway's host — upstream resolves its own
  "content-length", // Axios recalculates after body serialization
  "accept-encoding", // Prevents pre-compressed responses axios cannot decode
]);

// HTTP methods that carry a request body per RFC 7231 §4.3
const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

// Safely joins a base URL and a path, avoiding double slashes
function joinUrl(base, path) {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
}

// Filters hop-by-hop headers from a raw headers object.
// Applied to BOTH request and response headers per RFC 2616 §13.5.1.
// k.toLowerCase() handles case-insensitive header names per RFC 7230 §3.2.
function sanitizeHeaders(rawHeaders) {
  return Object.fromEntries(
    Object.entries(rawHeaders).filter(
      ([k]) => !HOP_BY_HOP_HEADERS.has(k.toLowerCase()),
    ),
  );
}

export async function proxyToService(req, res, targetBaseUrl, stripPrefix) {
  try {
    // Strip the gateway's route prefix so the upstream service
    // receives a path it actually understands.
    // stripPrefix is escaped to handle special regex chars (e.g. /api/v1+)
    const strippedPath = stripPrefix
      ? req.originalUrl.replace(
          new RegExp(`^${stripPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
          "",
        )
      : req.originalUrl;

    const targetUrl = joinUrl(targetBaseUrl, strippedPath || "/");

    // ✅ Log every incoming request and where it's being forwarded
    console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${targetUrl}`);

    const axiosConfig = {
      method: req.method,
      url: targetUrl, // ⚠️ query string already included via originalUrl — do NOT add params: req.query
      headers: sanitizeHeaders(req.headers), // RFC-compliant — replaces manual deletes
      timeout: 30000,
      validateStatus: () => true, // Forward ALL status codes (4xx, 5xx) as-is
    };

    // Attach body only for methods that support one (RFC 7231 §4.3)
    if (METHODS_WITH_BODY.has(req.method.toUpperCase())) {
      axiosConfig.data = req.body;
    }

    const response = await axios(axiosConfig);

    // ✅ Log the upstream response status
    console.log(`[Gateway] ← ${response.status} from ${targetUrl}`);

    // Forward upstream status code
    res.status(response.status);

    // Forward upstream response headers — sanitize again (RFC 2616 §13.5.1)
    Object.entries(response.headers || {}).forEach(([k, v]) => {
      if (!HOP_BY_HOP_HEADERS.has(k.toLowerCase())) {
        res.setHeader(k, v);
      }
    });

    // Forward response body — ?? guards against null/undefined upstream body
    res.send(response.data ?? "");
  } catch (err) {
    const isTimeout = err.code === "ECONNABORTED";
    const isUnreachable = err.code === "ECONNREFUSED";
    const message = isTimeout
      ? "Upstream service timed out"
      : isUnreachable
        ? "Upstream service is unreachable"
        : "Service unavailable (gateway could not reach upstream)";

    // ✅ Log which service failed and why
    console.error(
      `[Gateway] ❌ ${req.method} ${req.originalUrl} → ${targetBaseUrl} FAILED: ${message}`,
    );
    res.status(503).json({ message, error: err.message });
  }
}
