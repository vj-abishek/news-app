import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const city = request.geo?.city || null;
  console.log(request.geo)
  // if (request.nextUrl.pathname === "/") {
  //   if (city === "Chennai") {
  //     return NextResponse.rewrite(new URL("/?lang=tamil", request.url));
  //   }
  //   return NextResponse.next();
  // }

  if(request.nextUrl.pathname === "/server") {
    return NextResponse.rewrite(new URL(process.env.SERVER_URL || ""));
  }
}
