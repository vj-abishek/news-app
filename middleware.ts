import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://fingertip-news.vercel.app",
    "https://www.theprint.me",
    "https://theprint.me",
  ];

  const origin = requestHeaders.get("origin");
  console.log(origin);
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    requestHeaders.set("Access-Control-Allow-Origin", origin);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
