export function StudioFiltersSkeleton() {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:p-6">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-800" />
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_auto]">
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-11 w-40 animate-pulse rounded-xl bg-slate-800" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse rounded-xl bg-slate-800"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-24 animate-pulse rounded-full bg-slate-800"
          />
        ))}
      </div>
    </div>
  );
}

export default function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-8">
      <StudioFiltersSkeleton />

      <div className="space-y-4">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-800" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
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
      </div>
    </div>
  );
}
