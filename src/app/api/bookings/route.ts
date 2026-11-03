import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createBooking, getBookingsForUser } from "@/lib/bookings-api";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const result = await getBookingsForUser(email);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const email = session?.user?.email;
    const name = session?.user?.name;
    if (!email) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = await createBooking({
      ...body,
      userEmail: email,
      userName: body.userName || name || undefined,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Failed" }, { status: 500 });
  }
}
