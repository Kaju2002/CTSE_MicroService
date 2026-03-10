const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL;

if (!USER_SERVICE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_USER_SERVICE_URL is not set. Auth calls will fail until it is configured.",
  );
}

export function getUserServiceUrl() {
  if (!USER_SERVICE_URL) {
    throw new Error("NEXT_PUBLIC_USER_SERVICE_URL is not configured");
  }
  return USER_SERVICE_URL;
}

export function setAuthTokenCookie(token: string) {
  const maxAgeSeconds = 60 * 60 * 24 * 7;
  document.cookie = `auth_token=${token}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function clearAuthTokenCookie() {
  document.cookie =
    "auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

export function getAuthTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

