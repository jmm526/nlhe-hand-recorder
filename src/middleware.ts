import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === "/") {
    url.pathname = "/record";
    return NextResponse.redirect(url);
  }
}
