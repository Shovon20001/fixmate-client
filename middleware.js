import { NextResponse } from "next/server";

// BetterAuth cookie names (the "__Secure-" prefix is used on https / production)
const COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"];

/**
 * Cheap first gate: no session cookie -> /sign-in (and come back after login).
 * Role checks happen in the dashboard layouts, and the real authority is the Express API.
 */
export function middleware(request) {
  const hasSession = COOKIES.some((name) => request.cookies.get(name)?.value);
  if (!hasSession) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/payment/:path*"] };
