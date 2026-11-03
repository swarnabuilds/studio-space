"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckSquare,
  Clock,
  DollarSign,
  Loader2,
  Mail,
  MapPin,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react";

import StudioForm from "@/components/StudioForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { createBooking } from "@/lib/bookings-api";
import { getStudioById, updateStudio } from "@/lib/studios-api";
import type { StudioInput } from "@/types/studio";

function todayString() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingWidget({
  studioId,
  studioPrice,
}: {
  studioId: string;
  studioPrice?: number;
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const [date, setDate] = useState(todayString());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [submitting, setSubmitting] = useState(false);
  const rate = Number(studioPrice) || 0;

  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const hours = Math.max(0, (toMinutes(endTime) - toMinutes(startTime)) / 60);
  const total = Math.round(hours * rate * 100) / 100;

  const handleBook = async () => {
    if (!user?.email) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in to send a booking request.",
        type: "error",
      });
      return;
    }

    if (toMinutes(endTime) <= toMinutes(startTime)) {
      toast.add({
        title: "Invalid time range",
        description: "End time must be after start time.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);

    const result = await createBooking({
      studioId,
      userEmail: user.email,
      userName: user.name ?? undefined,
      date,
      startTime,
      endTime,
    });

    setSubmitting(false);

    if (!result.ok) {
      toast.add({
        title: "Booking request failed",
        description: result.error,
        type: "error",
      });
      return;
    }

    toast.add({
      title: "Booking request sent",
      description: "Your reservation is marked as Pending and awaits host confirmation.",
      type: "success",
    });
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
      <p className="flex items-end gap-1.5">
        <span className="text-3xl font-extrabold text-white">
          ${rate.toFixed(0)}
        </span>
        <span className="pb-1 text-sm text-slate-500">/ hour</span>
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Send a booking request — no payment is taken on StudioSpace.
      </p>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Date
          </label>
          <input
            type="date"
            min={todayString()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Start time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              End time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm">
          <span className="text-slate-400">
            {hours.toFixed(1)} hour{hours === 1 ? "" : "s"}
          </span>
          <span className="font-semibold text-white">
            Estimated total: ${total.toFixed(0)}
          </span>
        </div>

        <Button
          onClick={handleBook}
          disabled={submitting}
          className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/40 hover:bg-purple-700"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Sending Request...
            </>
          ) : (
            <>
              <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
              Request Booking
            </>
          )}
        </Button>

        <p className="text-center text-[11px] text-slate-500">
          Booking status starts as <span className="text-amber-300">Pending</span>
        </p>
      </div>
    </div>
  );
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [studio, setStudio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [studioId, setStudioId] = useState<string>("");

  useEffect(() => {
    void (async () => {
      const resolved = await params;
      setStudioId(resolved.id);

      const result = await getStudioById(resolved.id);
      if (!result.ok) {
        setError(
          result.reason === "not-found"
            ? "Studio not found"
            : result.error ?? "We couldn't load this studio"
        );
        setLoading(false);
        return;
      }

      setStudio(result.studio);
      setLoading(false);
    })();
  }, [params]);

  const handleSubmit = async (values: StudioInput) => {
    if (!user?.email) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in to update your studio.",
        type: "error",
      });
      return;
    }

    if (studio && studio.ownerEmail?.toLowerCase() !== user.email.toLowerCase()) {
      toast.add({
        title: "Not authorized",
        description: "You can only update studios you own.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);

    const result = await updateStudio(studioId, user.email, values);

    setSubmitting(false);

    if (!result.ok) {
      toast.add({
        title: "Failed to update studio",
        description: result.error,
        type: "error",
      });
      return;
    }

    toast.add({
      title: "Studio updated",
      description: "Your listing has been saved.",
      type: "success",
    });

    router.push("/dashboard/my-studio");
    router.refresh();
  };

  if (isPending || loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <div className="h-10 w-64 animate-pulse rounded bg-slate-800" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-800/70" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-white">{error}</h1>
        <Link href="/dashboard/my-studio">
          <Button className="rounded-xl bg-purple-600 px-5 text-white">
            Back to My Listings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Studio Management
          </span>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-900/40">
              <Camera className="h-5 w-5" />
            </div>
            Update Studio <span className="text-purple-400">Listing</span>
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Edit your space details. Host information remains read-only to
            preserve ownership.
          </p>
        </div>

        <Link
          href="/dashboard/my-studio"
          className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to My Listings
        </Link>
      </header>

      <StudioForm
        mode="edit"
        ownerName={studio?.ownerName ?? user?.name}
        ownerEmail={studio?.ownerEmail ?? user?.email}
        initialStudio={studio}
        submitting={submitting}
        onSubmit={handleSubmit}
        cancelHref="/dashboard/my-studio"
      />
    </div>
  );
}
