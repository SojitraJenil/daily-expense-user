import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");
  console.log("pathname", pathname);
  // Redirect unauthenticated users trying to access protected routes
  if (!token && pathname.startsWith("/landing")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users trying to access login page
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  return NextResponse.next();
}

// Define the paths that the middleware should apply to

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
