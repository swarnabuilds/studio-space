import Link from "next/link";
import { ArrowRight, CircleAlert, Star, Trophy } from "lucide-react";

import RetryButton from "@/components/RetryButton";
import StudioCard from "@/components/StudioCard";
import { getStudios } from "@/lib/studios-api";

const TOP_STUDIO_LIMIT = 5;

export default async function TopStudios() {
  const result = await getStudios({
    sort: "rating",
    limit: TOP_STUDIO_LIMIT,
  });

  if (!result.ok) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          role="alert"
          className="flex flex-col items-center gap-4 rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <CircleAlert className="h-6 w-6" aria-hidden="true" />
          </span>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-white">
              Top studios are unavailable right now
            </h2>
            <p className="mx-auto max-w-md text-sm text-slate-400">
              {result.error}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <RetryButton />
            <Link
              href="/studios"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white"
            >
              Browse all studios
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-purple-300">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
            Top rated
          </span>

          <h2 className="text-2xl font-extrabold tracking-tight text-white lg:text-4xl">
            Top 5 <span className="text-purple-400">Studios</span>
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-slate-400">
            The highest-rated spaces on StudioSpace right now — trusted by
            photographers, filmmakers, and creators.
          </p>
        </div>

        <Link
          href="/studios"
          className="inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-semibold text-slate-200 transition hover:border-purple-500/50 hover:text-white"
        >
          View all studios
          <ArrowRight className="h-4 w-4 text-purple-400" aria-hidden="true" />
        </Link>
      </div>

      {result.studios.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-purple-300">
            <Star className="h-7 w-7" aria-hidden="true" />
          </span>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">
              No studios to show yet
            </h3>
            <p className="mx-auto max-w-md text-sm text-slate-400">
              Top-rated studios will appear here as hosts publish and collect
              reviews.
            </p>
          </div>

          <Link
            href="/dashboard/add-studio"
            className="mt-1 inline-flex h-10 items-center justify-center rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-950/40 transition hover:bg-purple-700"
          >
            List your studio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {result.studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </section>
  );
}

export function TopStudiosSkeleton() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="h-6 w-28 animate-pulse rounded-full bg-slate-800" />
          <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-800" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-slate-800" />
        </div>
        <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: TOP_STUDIO_LIMIT }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70"
          >
            <div className="h-48 animate-pulse bg-slate-800" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />
              <div className="flex justify-between border-t border-slate-800 pt-3">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-16 animate-pulse rounded bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
