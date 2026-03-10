import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/signin",
  "/forgot-password",
  "/reset-password",
  "/_next",
  "/favicon.ico",
  "/images",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApi = pathname.startsWith("/api/");
  if (isApi) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublic) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname === "/" || pathname.startsWith("/(") || pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const signinUrl = request.nextUrl.clone();
    signinUrl.pathname = "/signin";
    signinUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

