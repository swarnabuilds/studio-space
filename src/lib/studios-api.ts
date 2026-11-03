import type {
  CreateStudioInput,
  Studio,
  StudioInput,
  StudioMutationResult,
  StudioQuery,
  StudioResult,
  StudiosResult,
} from "@/types/studio";
import { buildStudioSearchParams } from "@/lib/studio-query";

const SERVER_URI = (process.env.NEXT_PUBLIC_SERVER_URI ?? "http://localhost:5000")
  .trim()
  .replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 10_000;
const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN;

function getServerHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extra };

  if (INTERNAL_API_KEY) {
    headers["x-internal-api-key"] = INTERNAL_API_KEY;
  }

  if (INTERNAL_API_TOKEN) {
    headers.Authorization = `Bearer ${INTERNAL_API_TOKEN}`;
  }

  return headers;
}

export function getStudioApiUrl(path = ""): string {
  return `${SERVER_URI}/studio${path}`;
}

function describeRequestFailure(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return "The studio service took too long to respond. Please try again.";
    }
  }

  return "We couldn't reach the studio service right now. Please try again in a moment.";
}

function normalizeStudio(value: unknown): Studio | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;

  if (typeof record._id !== "string" || typeof record.name !== "string") {
    return null;
  }

  return {
    ...(record as unknown as Studio),
    _id: record._id,
    name: record.name,
    category: typeof record.category === "string" ? record.category : "",
    location:
      typeof record.location === "string" ? record.location : "Location on request",
    image: typeof record.image === "string" ? record.image : "",
    price: toNumber(record.price) ?? 0,
    rating: toNumber(record.rating),
    capacity: toNumber(record.capacity),
    areaSize: toNumber(record.areaSize),
    amenities: Array.isArray(record.amenities)
      ? record.amenities.filter(
          (item): item is string => typeof item === "string"
        )
      : [],
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

export async function getStudios(query: StudioQuery): Promise<StudiosResult> {
  const params = buildStudioSearchParams(query);
  const queryString = params.toString();
  const url = `${getStudioApiUrl()}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error(`Studio list request failed with status ${response.status}`);
      return {
        ok: false,
        error:
          response.status >= 500
            ? "The studio service is having trouble right now. Please try again shortly."
            : "We couldn't load the studio listings. Please try again.",
      };
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
      console.error("Studio list response was not an array");
      return {
        ok: false,
        error: "The studio service returned an unexpected response. Please try again.",
      };
    }

    const studios = payload
      .map(normalizeStudio)
      .filter((studio): studio is Studio => studio !== null);

    return { ok: true, studios };
  } catch (error) {
    console.error("Failed to fetch studios:", error);
    return { ok: false, error: describeRequestFailure(error) };
  }
}

export async function getStudioById(id: string): Promise<StudioResult> {
  if (!OBJECT_ID_PATTERN.test(id)) {
    return { ok: false, reason: "not-found" };
  }

  try {
    const response = await fetch(getStudioApiUrl(`/${id}`), {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });

    if (response.status === 404 || response.status === 400) {
      return { ok: false, reason: "not-found" };
    }

    if (!response.ok) {
      console.error(`Studio detail request failed with status ${response.status}`);
      return {
        ok: false,
        reason: "error",
        error:
          response.status >= 500
            ? "The studio service is having trouble right now. Please try again shortly."
            : "We couldn't load this studio right now. Please try again.",
      };
    }

    const payload: unknown = await response.json();
    const studio = normalizeStudio(payload);

    if (!studio) {
      console.error("Studio detail response was malformed");
      return {
        ok: false,
        reason: "error",
        error: "The studio service returned an unexpected response. Please try again.",
      };
    }

    return { ok: true, studio };
  } catch (error) {
    console.error(`Failed to fetch studio ${id}:`, error);
    return { ok: false, reason: "error", error: describeRequestFailure(error) };
  }
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

export async function createStudio(
  input: CreateStudioInput
): Promise<StudioMutationResult> {
  try {
    const response = await fetch(getStudioApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(
          response,
          "We couldn't publish your studio. Please try again."
        ),
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("Failed to create studio:", error);
    return { ok: false, error: describeRequestFailure(error) };
  }
}

export async function updateStudio(
  id: string,
  ownerEmail: string,
  input: StudioInput
): Promise<StudioMutationResult> {
  try {
    const response = await fetch(getStudioApiUrl(`/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, ownerEmail }),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(
          response,
          "We couldn't update your studio. Please try again."
        ),
      };
    }

    const payload: unknown = await response.json();
    const studio = normalizeStudio(payload);

    return { ok: true, studio: studio ?? undefined };
  } catch (error) {
    console.error(`Failed to update studio ${id}:`, error);
    return { ok: false, error: describeRequestFailure(error) };
  }
}

export async function deleteStudio(
  id: string,
  ownerEmail: string
): Promise<StudioMutationResult> {
  try {
    const url =
      typeof window === "undefined"
        ? getStudioApiUrl(`/${id}?ownerEmail=${encodeURIComponent(ownerEmail)}`)
        : getStudioApiUrl(`/${id}`);
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return {
        ok: false,
        error: await readApiError(
          response,
          "We couldn't delete this studio. Please try again."
        ),
      };
    }

    return { ok: true };
  } catch (error) {
    console.error(`Failed to delete studio ${id}:`, error);
    return { ok: false, error: describeRequestFailure(error) };
  }
}
