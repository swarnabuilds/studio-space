"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  CircleAlert,
  Edit3,
  Layers,
  MapPin,
  PlusCircle,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { deleteStudio, getStudios } from "@/lib/studios-api";
import type { Studio } from "@/types/studio";

export default function MyListingsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <div className="space-y-8 pb-16">
      <section className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-950 p-4 shadow-xl md:flex-row md:items-center lg:p-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-400">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Host Management Portal
          </div>

          <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white lg:text-2xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-md shadow-purple-900/40">
              <Building2 className="h-4 w-4" />
            </div>
            My Studio <span className="text-purple-400">Listings</span>
          </h1>

          <p className="max-w-xl text-xs leading-normal text-slate-400">
            Manage your published spaces — update details or remove listings
            when they’re no longer available.
          </p>
        </div>

        <Link href="/dashboard/add-studio" className="shrink-0">
          <Button className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-900/40 transition-all hover:bg-purple-700">
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Add New Studio
          </Button>
        </Link>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <Layers className="h-5 w-5 text-purple-400" aria-hidden="true" />
              Owned Listings
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Only studios linked to your account email are shown here.
            </p>
          </div>
        </div>

        {isPending ? (
          <ListingsSkeleton />
        ) : user?.email ? (
          <OwnedListings email={user.email} />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-16 text-center">
            <p className="text-sm text-slate-400">
              Sign in to manage your studio listings.
            </p>
            <Link href="/login">
              <Button className="rounded-xl bg-purple-600 px-5 py-2 text-xs text-white hover:bg-purple-700">
                Go to Sign In
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function OwnedListings({ email }: { email: string }) {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);

    const result = await getStudios({
      sort: "newest",
      ownerEmail: email.toLowerCase(),
    });

    if (!result.ok) {
      setError(result.error);
      setStudios([]);
      setLoading(false);
      return;
    }

    setStudios(result.studios);
    setLoading(false);
  };

  // Load on mount
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, refreshKey]);

  if (loading && refreshKey >= 0) {
    // keep first load in state via effect-like behavior by relying on the call above
  }

  if (error) {
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
          <p className="text-xs text-slate-400">{error}</p>
        </div>
        <Button
          onClick={() => setRefreshKey((value) => value + 1)}
          className="rounded-xl bg-slate-900/70 px-4 text-xs text-slate-200"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 py-16 text-center">
        <p className="text-sm text-slate-400">
          You haven&apos;t published any studio listings yet.
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
    <div className="space-y-4">
      {studios.map((studio) => (
        <OwnedStudioRow
          key={studio._id}
          studio={studio}
          ownerEmail={email}
          onDeleted={() => setRefreshKey((value) => value + 1)}
        />
      ))}
    </div>
  );
}

function OwnedStudioRow({
  studio,
  ownerEmail,
  onDeleted,
}: {
  studio: Studio;
  ownerEmail: string;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    const result = await deleteStudio(studio._id, ownerEmail);

    if (!result.ok) {
      toast.add({
        title: "Failed to delete studio",
        description: result.error,
        type: "error",
      });
      setDeleting(false);
      return;
    }

    toast.add({
      title: "Studio deleted",
      description: "Your listing has been removed from the marketplace.",
      type: "success",
    });

    setDeleting(false);
    onDeleted();
    router.refresh();
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between lg:p-5">
      <div className="flex min-w-0 items-start gap-4">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          {studio.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={studio.image}
              alt={studio.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold text-white">
              {studio.name}
            </h3>
            <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-300">
              {studio.category}
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
            <span className="truncate">{studio.location}</span>
          </p>
          <p className="text-xs text-slate-500">
            ${studio.price}/hour · Contact: {studio.contactEmail}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Link href={`/studios/edit/${studio._id}`}>
          <Button
            variant="outline"
            className="rounded-xl border-slate-700 bg-slate-900/70 text-xs text-slate-200 hover:bg-slate-800"
          >
            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
            Update
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                disabled={deleting}
                className="rounded-xl border-red-500/40 bg-red-500/10 text-xs text-red-300 hover:bg-red-500/20 hover:text-red-200"
              />
            }
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogTrigger>
          <AlertDialogContent className="border-slate-800 bg-slate-950 text-slate-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Delete this listing?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                {studio.name} will be permanently removed from MongoDB. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                render={
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-200"
                  />
                }
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}

function ListingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between lg:p-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-20 w-32 animate-pulse rounded-xl bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-40 animate-pulse rounded bg-slate-800" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-800" />
            <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}



