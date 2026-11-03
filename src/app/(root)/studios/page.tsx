import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  CircleAlert,
  Layers,
  PlusCircle,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";

import RetryButton from "@/components/RetryButton";
import StudioCard from "@/components/StudioCard";
import { getCategoryLabel } from "@/lib/studio-categories";
import { getStudios } from "@/lib/studios-api";
import { hasActiveFilters, parseStudioQuery, studiosHref } from "@/lib/studio-query";
import type { StudioQuery } from "@/types/studio";

import StudioFilters from "./StudioFilters";
import StudioGridSkeleton from "./StudioGridSkeleton";

export const metadata: Metadata = {
  title: "Explore Studios | StudioSpace",
  description:
    "Browse verified photography, filmmaking, podcasting, music, and workshop spaces available to book on StudioSpace.",
};

export default function StudiosPage({ searchParams }: PageProps<"/studios">) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="flex flex-col gap-5 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            Marketplace
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
            Explore Creative{" "}
            <span className="text-purple-400">Studios</span>
          </h1>

          <p className="max-w-2xl text-sm text-slate-400">
            Discover verified photography stages, film sets, podcast booths, and
            music rooms. Filter by what your next production needs.
          </p>
        </div>

        <Link
          href="/dashboard/add-studio"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-semibold text-slate-200 transition hover:border-purple-500/50 hover:text-white"
        >
          <PlusCircle className="h-4 w-4 text-purple-400" aria-hidden="true" />
          List your studio
        </Link>
      </header>

      <Suspense fallback={<StudioGridSkeleton />}>
        <StudiosExplorer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function StudiosExplorer({
  searchParams,
}: Pick<PageProps<"/studios">, "searchParams">) {
  const params = await searchParams;
  const query = parseStudioQuery(params ?? {});
  const result = await getStudios(query);

  return (
    <div className="space-y-8">
      <StudioFilters query={query} />

      {!result.ok ? (
        <StudioErrorState message={result.error} query={query} />
      ) : result.studios.length === 0 ? (
        <StudioEmptyState query={query} />
      ) : (
        <section className="space-y-5" aria-label="Studio results">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">
                {result.studios.length}
              </span>{" "}
              {result.studios.length === 1 ? "studio" : "studios"}
              {query.search ? (
                <>
                  {" "}
                  matching{" "}
                  <span className="font-medium text-slate-200">
                    &ldquo;{query.search}&rdquo;
                  </span>
                </>
              ) : query.category ? (
                <>
                  {" "}
                  in{" "}
                  <span className="font-medium text-slate-200">
                    {getCategoryLabel(query.category)}
                  </span>
                </>
              ) : (
                " available"
              )}
            </p>

            {hasActiveFilters(query) && (
              <Link
                href="/studios"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 transition hover:text-purple-200"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                Reset filters
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {result.studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StudioErrorState({
  message,
  query,
}: {
  message: string;
  query: StudioQuery;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-16 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <CircleAlert className="h-7 w-7" aria-hidden="true" />
      </span>

      <div className="space-y-1.5">
        <h2 className="text-lg font-bold text-white">
          We couldn&apos;t load the studios
        </h2>
        <p className="mx-auto max-w-md text-sm text-slate-400">{message}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <RetryButton />
        <Link
          href={studiosHref(query)}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white"
        >
          Reload this search
        </Link>
      </div>
    </div>
  );
}

function StudioEmptyState({ query }: { query: StudioQuery }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-purple-300">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>

      <div className="space-y-1.5">
        <h2 className="text-lg font-bold text-white">
          No studios match those filters
        </h2>
        <p className="mx-auto max-w-md text-sm text-slate-400">
          Try a broader location, a different category, or a wider price range.
          New spaces are added regularly.
        </p>
      </div>

      <Link
        href="/studios"
        className="mt-1 inline-flex h-10 items-center justify-center rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-950/40 transition hover:bg-purple-700"
      >
        Browse all studios
      </Link>

      {hasActiveFilters(query) && (
        <p className="text-xs text-slate-500">
          You currently have {query.category ? "a category selected" : "filters applied"}.
        </p>
      )}
    </div>
  );
}
