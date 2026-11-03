import type { StudioQuery, StudioSort } from "@/types/studio";
import { STUDIO_CATEGORY_VALUES } from "@/lib/studio-categories";

export type StudioSearchParams = Record<
  string,
  string | string[] | undefined
>;

export interface StudioSortOption {
  value: StudioSort;
  label: string;
}

export const STUDIO_SORT_OPTIONS: StudioSortOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const DEFAULT_STUDIO_QUERY: StudioQuery = { sort: "newest" };

const SORT_VALUES = new Set<string>(STUDIO_SORT_OPTIONS.map((o) => o.value));
const CATEGORY_PATTERN = /^[a-z0-9-]{1,40}$/;
const MAX_SEARCH_LENGTH = 80;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseText(
  value: string | string[] | undefined,
  maxLength = MAX_SEARCH_LENGTH
): string | undefined {
  const text = firstValue(value)?.trim();
  if (!text) return undefined;
  return text.slice(0, maxLength);
}

function parseNumber(
  value: string | string[] | undefined,
  { min = 0, max }: { min?: number; max?: number } = {}
): number | undefined {
  const text = firstValue(value)?.trim();
  if (!text) return undefined;

  const number = Number(text);
  if (!Number.isFinite(number)) return undefined;

  const clamped = Math.max(min, max === undefined ? number : Math.min(number, max));
  return clamped;
}

export function parseStudioQuery(params: StudioSearchParams): StudioQuery {
  const search = parseText(params.search);
  const rawCategory = parseText(params.category, 40)?.toLowerCase();
  const category =
    rawCategory && CATEGORY_PATTERN.test(rawCategory) ? rawCategory : undefined;

  let minPrice = parseNumber(params.minPrice);
  let maxPrice = parseNumber(params.maxPrice);

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  const minCapacity = parseNumber(params.minCapacity, { max: 100000 });
  const minRating = parseNumber(params.minRating, { max: 5 });
  const rawSort = parseText(params.sort, 20);
  const sort =
    rawSort && SORT_VALUES.has(rawSort) ? (rawSort as StudioSort) : "newest";

  return {
    ...(search ? { search } : {}),
    ...(category ? { category } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    ...(minCapacity !== undefined ? { minCapacity } : {}),
    ...(minRating !== undefined ? { minRating } : {}),
    sort,
  };
}

export function buildStudioSearchParams(query: StudioQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.ownerEmail && query.ownerEmail.trim()) {
    params.set("ownerEmail", query.ownerEmail.trim());
  }
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.minCapacity !== undefined) {
    params.set("minCapacity", String(query.minCapacity));
  }
  if (query.minRating !== undefined) {
    params.set("minRating", String(query.minRating));
  }
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.sort !== "newest") params.set("sort", query.sort);

  return params;
}

export type StudioQueryOverrides = {
  [K in keyof StudioQuery]?: StudioQuery[K] | undefined;
};

export function studiosHref(
  base: StudioQuery,
  overrides: StudioQueryOverrides = {}
): string {
  const merged: StudioQuery = { ...base, ...overrides };

  // Removing a filter should produce the default value, not an empty parameter.
  if (overrides.sort === undefined && "sort" in overrides) {
    merged.sort = "newest";
  }

  const params = buildStudioSearchParams(merged);
  const queryString = params.toString();

  return queryString ? `/studios?${queryString}` : "/studios";
}

export function hasActiveFilters(query: StudioQuery): boolean {
  return countActiveFilters(query) > 0;
}

export function countActiveFilters(query: StudioQuery): number {
  let count = 0;
  if (query.search) count += 1;
  if (query.category) count += 1;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) count += 1;
  if (query.minCapacity !== undefined) count += 1;
  if (query.minRating !== undefined) count += 1;
  if (query.sort !== "newest") count += 1;
  return count;
}

export function isKnownCategory(category?: string): boolean {
  return (
    !!category &&
    STUDIO_CATEGORY_VALUES.includes(category as (typeof STUDIO_CATEGORY_VALUES)[number])
  );
}
