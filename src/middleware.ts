import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Middleware only handles static/API exclusion via the matcher config.
  // Auth redirects are handled by:
  // - (main)/layout.tsx: redirects to /login if no valid session
  // - src/app/page.tsx: redirects to /home or /login based on session
  // This avoids redirect loops caused by stale/invalid session cookies.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
