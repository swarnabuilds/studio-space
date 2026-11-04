
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createBooking,
  getBookingsForUser,
} from "@/lib/bookings-api";

// GET: Logged-in user's bookings
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await getBookingsForUser(email);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Return an array because frontend expects an array
    return NextResponse.json(result.bookings);

  } catch (error: unknown) {
    console.error("GET bookings error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load bookings",
      },
      { status: 500 }
    );
  }
}

// POST: Create booking
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const email = session?.user?.email;
    const name = session?.user?.name;

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = await createBooking({
      ...body,
      userEmail: email,
      userName: body.userName || name || undefined,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Return booking directly, not { ok, booking }
    return NextResponse.json(result.booking, {
      status: 201,
    });

  } catch (error: unknown) {
    console.error("POST booking error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create booking",
      },
      { status: 500 }
    );
  }
}
