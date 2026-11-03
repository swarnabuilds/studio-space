export default function StudioDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-3 w-64 animate-pulse rounded bg-slate-800" />

      <div className="space-y-4">
        <div className="h-6 w-36 animate-pulse rounded-full bg-slate-800" />
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-800" />
      </div>

      <div className="aspect-[16/10] w-full animate-pulse rounded-3xl bg-slate-800 lg:aspect-[21/9]" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-3xl bg-slate-800/70" />
          <div className="h-48 animate-pulse rounded-3xl bg-slate-800/70" />
        </div>
        <div className="h-80 animate-pulse rounded-3xl bg-slate-800/70" />
      </div>
    </div>
  );
}
