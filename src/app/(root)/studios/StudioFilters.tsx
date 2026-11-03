import Link from "next/link";
import {
  Layers,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  STUDIO_CATEGORIES,
} from "@/lib/studio-categories";
import {
  buildStudioSearchParams,
  countActiveFilters,
  STUDIO_SORT_OPTIONS,
  studiosHref,
} from "@/lib/studio-query";
import { cn } from "@/lib/utils";
import type { StudioQuery } from "@/types/studio";

interface StudioFiltersProps {
  query: StudioQuery;
}

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 [color-scheme:dark]";

const labelClassName =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400";

export default function StudioFilters({ query }: StudioFiltersProps) {
  const activeCount = countActiveFilters(query);
  const filterKey = buildStudioSearchParams(query).toString();

  return (
    <section
      aria-label="Filter studios"
      className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl shadow-black/10 lg:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/15 text-purple-400">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </span>
          Find your space
        </h2>

        {activeCount > 0 && (
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all ({activeCount})
          </Link>
        )}
      </div>

      <form
        key={filterKey}
        method="get"
        action="/studios"
        className="space-y-4"
      >
        {query.category && (
          <input type="hidden" name="category" value={query.category} />
        )}

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_auto] lg:items-end">
          <div>
            <label htmlFor="studio-search" className={labelClassName}>
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                id="studio-search"
                type="search"
                name="search"
                defaultValue={query.search ?? ""}
                maxLength={80}
                placeholder="Studio name, area, or location"
                className={cn(inputClassName, "pl-10")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="studio-sort" className={labelClassName}>
              Sort by
            </label>
            <select
              id="studio-sort"
              name="sort"
              defaultValue={query.sort}
              className={inputClassName}
            >
              {STUDIO_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-950/40 transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Apply filters
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div>
            <label htmlFor="studio-min-price" className={labelClassName}>
              Min price ($/hr)
            </label>
            <input
              id="studio-min-price"
              type="number"
              name="minPrice"
              min={0}
              inputMode="numeric"
              defaultValue={query.minPrice ?? ""}
              placeholder="Any"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="studio-max-price" className={labelClassName}>
              Max price ($/hr)
            </label>
            <input
              id="studio-max-price"
              type="number"
              name="maxPrice"
              min={0}
              inputMode="numeric"
              defaultValue={query.maxPrice ?? ""}
              placeholder="Any"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="studio-min-capacity" className={labelClassName}>
              Guests
            </label>
            <input
              id="studio-min-capacity"
              type="number"
              name="minCapacity"
              min={0}
              inputMode="numeric"
              defaultValue={query.minCapacity ?? ""}
              placeholder="Any"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="studio-min-rating" className={labelClassName}>
              Rating
            </label>
            <select
              id="studio-min-rating"
              name="minRating"
              defaultValue={query.minRating ?? ""}
              className={inputClassName}
            >
              <option value="">Any rating</option>
              <option value="4.5">4.5 and up</option>
              <option value="4">4.0 and up</option>
              <option value="3">3.0 and up</option>
            </select>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
        <Link
          href={studiosHref(query, { category: undefined })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
            query.category
              ? "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-purple-500/50 hover:text-white"
              : "border-purple-500/60 bg-purple-600 text-white shadow-lg shadow-purple-950/30"
          )}
        >
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          All studios
        </Link>

        {STUDIO_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = query.category === category.value;

          return (
            <Link
              key={category.value}
              href={studiosHref(query, {
                category: isActive ? undefined : category.value,
              })}
              title={category.description}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                isActive
                  ? "border-purple-500/60 bg-purple-600 text-white shadow-lg shadow-purple-950/30"
                  : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-purple-500/50 hover:text-white"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {category.shortLabel}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
