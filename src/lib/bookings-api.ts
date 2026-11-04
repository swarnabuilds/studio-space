
import type {
  Booking,
  BookingResult,
  BookingsResult,
  CreateBookingInput,
} from "@/types/booking";

const REQUEST_TIMEOUT_MS = 30_000;

const BOOKING_STATUSES = new Set([
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
]);

const SERVER_URI = (
  process.env.NEXT_PUBLIC_SERVER_URI ?? "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "");

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

function getHeaders(extra: Record<string, string> = {}) {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extra,
  };

  // Secret headers must only be added on the server.
  if (typeof window === "undefined") {
    if (INTERNAL_API_KEY) {
      headers["x-internal-api-key"] = INTERNAL_API_KEY;
    }

    if (process.env.INTERNAL_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.INTERNAL_API_TOKEN}`;
    }
  }

  return headers;
}

function getApiUrl(path = "") {
  if (typeof window === "undefined") {
    return `${SERVER_URI}/bookings${path}`;
  }

  return `/api/bookings${path}`;
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
}

function normalizeBooking(value: unknown): Booking | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;

  if (
    typeof record._id !== "string" ||
    typeof record.studioId !== "string" ||
    typeof record.studioName !== "string"
  ) {
    return null;
  }

  const status =
    typeof record.status === "string" &&
    BOOKING_STATUSES.has(record.status)
      ? (record.status as Booking["status"])
      : "Pending";

  return {
    ...(record as unknown as Booking),
    _id: record._id,
    studioId: record.studioId,
    studioName: record.studioName,
    studioImage:
      typeof record.studioImage === "string" ? record.studioImage : "",
    studioLocation:
      typeof record.studioLocation === "string"
        ? record.studioLocation
        : "",
    studioCategory:
      typeof record.studioCategory === "string"
        ? record.studioCategory
        : "",
    price: toNumber(record.price),
    hours: toNumber(record.hours),
    total: toNumber(record.total),
    date: typeof record.date === "string" ? record.date : "",
    startTime:
      typeof record.startTime === "string" ? record.startTime : "",
    endTime: typeof record.endTime === "string" ? record.endTime : "",
    status,
    userEmail:
      typeof record.userEmail === "string" ? record.userEmail : "",
    userName: typeof record.userName === "string" ? record.userName : "",
    ownerEmail:
      typeof record.ownerEmail === "string" ? record.ownerEmail : "",
  };
}

async function readApiError(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const payload = await response.json();

    if (typeof payload?.message === "string") {
      return payload.message;
    }

    if (typeof payload?.error === "string") {
      return payload.error;
    }
  } catch {
    // Ignore invalid JSON.
  }

  return fallback;
}

function getRequestError(error: unknown): string {
  console.error("Booking API error:", error);

  if (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  ) {
    return "Booking service timeout. Please try again.";
  }

  return "Unable to connect to booking service. Please try again.";
}

// GET BOOKINGS
export async function getBookingsForUser(
  userEmail: string
): Promise<BookingsResult> {
  try {
    const params = new URLSearchParams({ userEmail });

    const url = getApiUrl(
      typeof window === "undefined" ? `?${params}` : `?${params}`
    );

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: getHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(response, "Failed to load bookings."),
      };
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
      return {
        ok: false,
        error: "Unexpected booking response.",
      };
    }

    return {
      ok: true,
      bookings: payload
        .map(normalizeBooking)
        .filter((item): item is Booking => item !== null),
    };
  } catch (error) {
    return {
      ok: false,
      error: getRequestError(error),
    };
  }
}

// CREATE BOOKING
export async function createBooking(
  input: CreateBookingInput
): Promise<BookingResult> {
  try {
    if (!input.userEmail) {
      return {
        ok: false,
        error: "User email is required. Please sign in again.",
      };
    }

    const response = await fetch(getApiUrl(), {
      method: "POST",
      headers: getHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(
          response,
          "We couldn't create your booking request."
        ),
      };
    }

    const payload: unknown = await response.json();
    const booking = normalizeBooking(payload);

    if (!booking) {
      return {
        ok: false,
        error: "Invalid booking response from server.",
      };
    }

    return {
      ok: true,
      booking,
    };
  } catch (error) {
    return {
      ok: false,
      error: getRequestError(error),
    };
  }
}

// CANCEL BOOKING
export async function cancelBooking(
  id: string,
  userEmail: string
): Promise<BookingResult> {
  try {
    const response = await fetch(
      getApiUrl(`/${encodeURIComponent(id)}/cancel`),
      {
        method: "PATCH",
        headers: getHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ userEmail }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    );

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(
          response,
          "We couldn't cancel this booking."
        ),
      };
    }

    const payload: unknown = await response.json();
    const booking = normalizeBooking(payload);

    if (!booking) {
      return {
        ok: false,
        error: "Invalid booking response from server.",
      };
    }

    return {
      ok: true,
      booking,
    };
  } catch (error) {
    return {
      ok: false,
      error: getRequestError(error),
    };
  }
}
