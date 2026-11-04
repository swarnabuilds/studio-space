"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { createBooking } from "@/lib/bookings-api";

function todayString() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookingWidget({
  studioId,
  studioPrice,
}: {
  studioId: string;
  studioPrice?: number;
}) {
  const router = useRouter();
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

  const startMins = toMinutes(startTime);
  const endMins = toMinutes(endTime);
  const hours = Math.max(0, (endMins - startMins) / 60);
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

    if (endMins <= startMins) {
      toast.add({
        title: "Invalid time range",
        description: "End time must be after start time.",
        type: "error",
      });
      return;
    }

    if (endMins - startMins < 60) {
      toast.add({
        title: "Minimum booking time",
        description: "Please book at least 1 hour.",
        type: "error",
      });
      return;
    }

    if (date < todayString()) {
      toast.add({
        title: "Invalid date",
        description: "Please select a valid booking date from today onwards.",
        type: "error",
      });
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(selectedDate.getTime())) {
      toast.add({
        title: "Invalid date",
        description: "Please select a valid date.",
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
      title: "Booking Confirmed! ✅",
      description: `Your booking request for ${date} (${startTime} - ${endTime}) is now Pending.`,
      type: "success",
    });

    router.push("/dashboard/my-bookings");
    router.refresh();
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
