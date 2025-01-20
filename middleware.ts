import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Check if the user is at the root route
  if (url.pathname === "/") {
    // Redirect to /dashboard
    // url.pathname = "/cv-detail/12";
    url.pathname = "/auth/register";
    return NextResponse.redirect(url);
  }

  // Continue with other requests
  return NextResponse.next();
}
