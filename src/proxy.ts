
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication error:", error);

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
