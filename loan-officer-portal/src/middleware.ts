import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that don't require authentication
const publicPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie (this should match your Django session cookie name)
  const sessionId = request.cookies.get("sessionid");

  if (!sessionId && !pathname.startsWith("/login")) {
    // Redirect to login if no session exists
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If there's a session and user is trying to access login/register, redirect to dashboard
  if (sessionId && publicPaths.includes(pathname)) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Specify which paths the middleware should run on
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. .*\\..*$ (files with extensions, e.g., favicon.ico)
     */
    "/((?!api|_next|static|.*\\..*$).*)",
  ],
};
