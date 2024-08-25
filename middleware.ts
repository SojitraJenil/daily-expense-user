import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");
  const mobileNumber = request.cookies.get("mobileNumber");
  const UserId = request.cookies.get("UserId");
  if ((!token || !mobileNumber || !UserId) && pathname.startsWith("/landing")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token && mobileNumber && UserId && pathname === "/login") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
