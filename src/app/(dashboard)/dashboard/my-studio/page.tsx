import React, { Suspense } from "react";
import StudioCard from "@/components/StudioCard";
import {
  Building2,
  CircleAlert,
  Layers,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RetryButton from "@/components/RetryButton";
import { getStudios } from "@/lib/studios-api";

const LISTING_QUERY = { sort: "newest" } as const;

export default function MyStudioPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner - Compact & Reduced Gaps */}
      <section className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-950 p-4 shadow-xl md:flex-row md:items-center lg:p-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-400">
            <Sparkles className="h-3 w-3" /> Host Management Portal
          </div>

          <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white lg:text-2xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-md shadow-purple-900/40">
              <Building2 className="h-4 w-4" />
            </div>
            My Studios <span className="text-purple-400">Dashboard</span>
          </h1>

          <p className="max-w-xl text-xs leading-normal text-slate-400">
            Manage, organize, and monitor all the creative spaces and studio
            listings registered under your account.
          </p>
        </div>

        <Link href="/dashboard/add-studio" className="shrink-0">
          <Button className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-900/40 transition-all hover:bg-purple-700">
            <PlusCircle className="h-3.5 w-3.5" /> Add New Studio
          </Button>
        </Link>
      </section>

      {/* Explore Studios Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <Layers className="h-5 w-5 text-purple-400" /> Your Studio Listings
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Browse through all your active studio spaces currently live on
              StudioSpace.
            </p>
          </div>
        </div>

        <Suspense fallback={<MyStudiosSkeleton />}>
          <MyStudiosList />
        </Suspense>
      </section>
    </div>
  );
}

async function MyStudiosList() {
  const result = await getStudios(LISTING_QUERY);

  if (!result.ok) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-16 text-center"
      >
        <CircleAlert className="h-8 w-8 text-red-400" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">
            We couldn&apos;t load your studios
          </p>
          <p className="text-xs text-slate-400">{result.error}</p>
        </div>
        <RetryButton />
      </div>
    );
  }

  if (result.studios.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 py-16 text-center">
        <p className="text-sm text-slate-400">
          No studios found. Add a new studio from your dashboard!
        </p>
        <Link href="/dashboard/add-studio">
          <Button className="rounded-xl bg-purple-600 px-5 py-2 text-xs text-white hover:bg-purple-700">
            Publish Your First Studio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {result.studios.map((studio) => (
        <StudioCard key={studio._id} studio={studio} variant="owner" />
      ))}
    </div>
  );
}

function MyStudiosSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70"
        >
          <div className="h-48 animate-pulse bg-slate-800" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />
            <div className="h-9 animate-pulse rounded-xl bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
