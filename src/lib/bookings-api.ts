import type {
  Booking,
  BookingResult,
  BookingsResult,
  CreateBookingInput,
} from "@/types/booking";

const REQUEST_TIMEOUT_MS = 10_000;
const BOOKING_STATUSES = new Set([
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
]);

const SERVER_URI = (process.env.NEXT_PUBLIC_SERVER_URI ?? "http://localhost:5000")
  .trim()
  .replace(/\/+$/, "");
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN;

function getBookingsServerHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  if (INTERNAL_API_KEY) headers["x-internal-api-key"] = INTERNAL_API_KEY;
  if (INTERNAL_API_TOKEN) headers.Authorization = `Bearer ${INTERNAL_API_TOKEN}`;
  return headers;
}

function getBookingsApiUrl(path = ""): string {
  if (typeof window === "undefined") {
    return `${SERVER_URI}/bookings${path}`;
  }
  return `/api/bookings${path}`;
}

function normalizeBooking(value: unknown): Booking | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const status =
    typeof record.status === "string" && BOOKING_STATUSES.has(record.status)
      ? (record.status as Booking["status"])
      : "Pending";

  if (
    typeof record._id !== "string" ||
    typeof record.studioId !== "string" ||
    typeof record.studioName !== "string"
  ) {
    return null;
  }

  return {
    ...(record as unknown as Booking),
    _id: record._id,
    studioId: record.studioId,
    studioName: record.studioName,
    studioImage: typeof record.studioImage === "string" ? record.studioImage : "",
    studioLocation:
      typeof record.studioLocation === "string" ? record.studioLocation : "",
    studioCategory:
      typeof record.studioCategory === "string" ? record.studioCategory : "",
    price: toNumber(record.price) ?? 0,
    hours: toNumber(record.hours) ?? 0,
    total: toNumber(record.total) ?? 0,
    date: typeof record.date === "string" ? record.date : "",
    startTime: typeof record.startTime === "string" ? record.startTime : "",
    endTime: typeof record.endTime === "string" ? record.endTime : "",
    status,
    userEmail: typeof record.userEmail === "string" ? record.userEmail : "",
    userName: typeof record.userName === "string" ? record.userName : "",
    ownerEmail: typeof record.ownerEmail === "string" ? record.ownerEmail : "",
  };
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function describeRequestFailure(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return "The booking service took too long to respond. Please try again.";
    }
  }

  return "We couldn't reach the booking service right now. Please try again in a moment.";
}

async function readApiError(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (payload && typeof payload === "object") {
      const message = (payload as Record<string, unknown>).message;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  } catch {
    // Ignore malformed error payloads.
  }

  return fallback;
}

export async function getBookingsForUser(
  userEmail: string
): Promise<BookingsResult> {
  try {
    const params = typeof window === "undefined" ? new URLSearchParams({ userEmail }) : undefined;
    const url = typeof window === "undefined" ? getBookingsApiUrl(`?${params}`) : getBookingsApiUrl();
    const headers: Record<string, string> = { Accept: "application/json", ...getBookingsServerHeaders() };
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers,
    });

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(
          response,
          "We couldn't load your bookings. Please try again."
        ),
      };
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      return {
        ok: false,
        error: "The booking service returned an unexpected response.",
      };
    }

    return {
      ok: true,
      bookings: payload
        .map(normalizeBooking)
        .filter((booking): booking is Booking => booking !== null),
    };
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return { ok: false, error: describeRequestFailure(error) };
  }
}

export async function createBooking(
  input: CreateBookingInput
): Promise<BookingResult> {
  try {
    const response = await fetch(getBookingsApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getBookingsServerHeaders() },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(
          response,
          "We couldn't create your booking request. Please try again."
        ),
      };
    }

    const payload: unknown = await response.json();
    const booking = normalizeBooking(payload);

    if (!booking) {
      return {
        ok: false,
        error: "The booking service returned an unexpected response.",
      };
    }

    return { ok: true, booking };
  } catch (error) {
    console.error("Failed to create booking:", error);
    return { ok: false, error: describeRequestFailure(error) };
  }
}

export async function cancelBooking(
  id: string,
  userEmail: string
): Promise<BookingResult> {
  try {
    const url = typeof window === "undefined" ? getBookingsApiUrl(`/${id}/cancel`) : `/api/bookings/${id}/cancel`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getBookingsServerHeaders() },
      body: JSON.stringify(typeof window === "undefined" ? { userEmail } : {}),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(
          response,
          "We couldn't cancel this booking. Please try again."
        ),
      };
    }

    const payload: unknown = await response.json();
    const booking = normalizeBooking(payload);

    if (!booking) {
      return {
        ok: false,
        error: "The booking service returned an unexpected response.",
      };
    }

    return { ok: true, booking };
  } catch (error) {
    console.error(`Failed to cancel booking ${id}:`, error);
    return { ok: false, error: describeRequestFailure(error) };
  }
}
