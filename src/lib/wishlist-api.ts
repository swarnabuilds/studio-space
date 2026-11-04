import type { Studio } from "@/types/studio";

const SERVER_URI = (process.env.NEXT_PUBLIC_SERVER_URI ?? "http://localhost:5000")
  .trim()
  .replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 10_000;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN;

function getWishlistServerHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  if (INTERNAL_API_KEY) headers["x-internal-api-key"] = INTERNAL_API_KEY;
  if (INTERNAL_API_TOKEN) headers.Authorization = `Bearer ${INTERNAL_API_TOKEN}`;
  return headers;
}

function getWishlistApiUrl(path = ""): string {
  if (typeof window !== "undefined") return `/api/wishlist${path}`;
  return `${SERVER_URI}/wishlist${path}`;
}

async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (payload && typeof payload === "object") {
      const message = (payload as Record<string, unknown>).message;
      if (typeof message === "string" && message.trim()) return message;
      const error = (payload as Record<string, unknown>).error;
      if (typeof error === "string" && error.trim()) return error;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function getWishlist(userEmail: string): Promise<{ ok: true; studios: Studio[] } | { ok: false; error: string }> {
  try {
    const params = typeof window === "undefined" ? new URLSearchParams({ userEmail }) : undefined;
    const url = typeof window === "undefined" ? getWishlistApiUrl(`?${params}`) : getWishlistApiUrl();
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "application/json", ...getWishlistServerHeaders() },
    });

    if (!response.ok) {
      const error = await readApiError(response, "Failed to load wishlist");
      return { ok: false, error };
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return { ok: true, studios: data as Studio[] };
    }
    if (data && typeof data === "object" && Array.isArray((data as any).studios)) {
      return { ok: true, studios: (data as any).studios as Studio[] };
    }
    return { ok: true, studios: [] };
  } catch (error) {
    return { ok: false, error: "Unable to reach wishlist service" };
  }
}

export async function addToWishlist(input: { userEmail: string; studioId: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await fetch(getWishlistApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getWishlistServerHeaders() },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await readApiError(response, "Failed to add to wishlist");
      return { ok: false, error };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Unable to reach wishlist service" };
  }
}

export async function removeFromWishlist(input: { userEmail: string; studioId: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const url = typeof window === "undefined" ? getWishlistApiUrl(`?userEmail=${encodeURIComponent(input.userEmail)}&studioId=${encodeURIComponent(input.studioId)}`) : `/api/wishlist?studioId=${encodeURIComponent(input.studioId)}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...getWishlistServerHeaders() },
      body: typeof window === "undefined" ? JSON.stringify(input) : undefined,
    });

    if (!response.ok) {
      const error = await readApiError(response, "Failed to remove from wishlist");
      return { ok: false, error };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Unable to reach wishlist service" };
  }
}
