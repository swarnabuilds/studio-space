"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CircleAlert,
  Clock,
  MapPin,
  PlusCircle,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { cancelBooking, getBookingsForUser } from "@/lib/bookings-api";
import type { Booking, BookingStatus } from "@/types/booking";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  Confirmed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  Completed: "border-slate-500/40 bg-slate-500/10 text-slate-300",
  Cancelled: "border-red-500/40 bg-red-500/10 text-red-300",
};

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <div className="space-y-8 pb-16">
      <section className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-950 p-4 shadow-xl md:flex-row md:items-center lg:p-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-400">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Creator Bookings
          </div>

          <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white lg:text-2xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-md shadow-purple-900/40">
              <CalendarCheck className="h-4 w-4" />
            </div>
            My <span className="text-purple-400">Bookings</span>
          </h1>

          <p className="max-w-xl text-xs leading-normal text-slate-400">
            Track reservation requests, check status updates, and cancel pending
            slots when plans change.
          </p>
        </div>

        <Link href="/studios" className="shrink-0">
          <Button className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-900/40 transition-all hover:bg-purple-700">
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Book Another Studio
          </Button>
        </Link>
      </section>

      {isPending ? (
        <BookingsSkeleton />
      ) : user?.email ? (
        <UserBookings email={user.email} />
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-16 text-center">
          <p className="text-sm text-slate-400">
            Sign in to view and manage your bookings.
          </p>
          <Link href="/login">
            <Button className="rounded-xl bg-purple-600 px-5 py-2 text-xs text-white hover:bg-purple-700">
              Go to Sign In
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function UserBookings({ email }: { email: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);

      const result = await getBookingsForUser(email);

      if (!result.ok) {
        setError(result.error);
        setBookings([]);
        setLoading(false);
        return;
      }

      setBookings(result.bookings);
      setLoading(false);
    })();
  }, [email, refreshKey]);

  if (loading) {
    return <BookingsSkeleton />;
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
            We couldn&apos;t load your bookings
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

  if (bookings.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 py-16 text-center">
        <p className="text-sm text-slate-400">
          No bookings yet. Explore studios and send your first request.
        </p>
        <Link href="/studios">
          <Button className="rounded-xl bg-purple-600 px-5 py-2 text-xs text-white hover:bg-purple-700">
            Find a Studio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          userEmail={email}
          onUpdated={() => setRefreshKey((value) => value + 1)}
        />
      ))}
    </div>
  );
}

function BookingCard({
  booking,
  userEmail,
  onUpdated,
}: {
  booking: Booking;
  userEmail: string;
  onUpdated: () => void;
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const isPending = booking.status === "Pending";

  const handleCancel = async () => {
    if (!isPending || cancelling) return;

    const confirmed = window.confirm(
      "Cancel this booking request? This action cannot be undone."
    );
    if (!confirmed) return;

    setCancelling(true);

    const result = await cancelBooking(booking._id, userEmail);

    if (!result.ok) {
      toast.add({
        title: "Failed to cancel booking",
        description: result.error,
        type: "error",
      });
      setCancelling(false);
      return;
    }

    toast.add({
      title: "Booking cancelled",
      description: "Your pending reservation has been cancelled.",
      type: "success",
    });

    onUpdated();
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl lg:flex-row lg:items-center lg:justify-between lg:p-5">
      <div className="flex min-w-0 items-start gap-4">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          {booking.studioImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={booking.studioImage}
              alt={booking.studioName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold text-white">
              {booking.studioName}
            </h3>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[booking.status]}`}
            >
              {booking.status}
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
            <span className="truncate">
              {booking.studioLocation || "Location on request"}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarCheck className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              {booking.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              {booking.startTime} – {booking.endTime}
            </span>
            <span>${booking.total.toFixed(0)} total ({booking.hours}h)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:justify-end">
        {isPending ? (
          <Button
            onClick={handleCancel}
            disabled={cancelling}
            variant="outline"
            className="rounded-xl border-red-500/40 bg-red-500/10 text-xs text-red-300 hover:bg-red-500/20 hover:text-red-200"
          >
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </Button>
        ) : (
          <Link href={`/studios/${booking.studioId}`}>
            <Button
              variant="outline"
              className="rounded-xl border-slate-700 bg-slate-900/70 text-xs text-slate-200 hover:bg-slate-800"
            >
              View studio
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-20 w-32 animate-pulse rounded-xl bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-40 animate-pulse rounded bg-slate-800" />
            </div>
          </div>
          <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
