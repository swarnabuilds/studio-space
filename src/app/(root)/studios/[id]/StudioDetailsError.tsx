import Link from "next/link";
import { CircleAlert } from "lucide-react";

import RetryButton from "@/components/RetryButton";

export default function StudioDetailsError({ message }: { message?: string }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-20 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <CircleAlert className="h-7 w-7" aria-hidden="true" />
      </span>

      <div className="space-y-1.5">
        <h1 className="text-xl font-bold text-white">
          We couldn&apos;t load this studio
        </h1>
        <p className="mx-auto max-w-md text-sm text-slate-400">
          {message ??
            "Something went wrong while fetching the listing. Please try again."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <RetryButton />
        <Link
          href="/studios"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white"
        >
          Back to all studios
        </Link>
      </div>
    </div>
  );
}
