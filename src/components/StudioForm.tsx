"use client";

import Link from "next/link";
import {
  Camera,
  CheckSquare,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  PlusCircle,
  Save,
  Star,
  Tag,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Studio, StudioInput } from "@/types/studio";

const AMENITY_OPTIONS = [
  "High-Speed Wi-Fi",
  "Soundproofing",
  "Professional Lighting",
  "Air Conditioning",
  "Green Screen / Cyclorama",
  "Podcast Microphones",
  "Dressing / Makeup Room",
  "Free Parking Onsite",
  "4K Camera Gear",
  "Control Room Setup",
  "Audio Mixing Console",
  "Refreshments & Coffee",
];

interface StudioFormProps {
  mode: "create" | "edit";
  ownerName?: string | null;
  ownerEmail?: string | null;
  initialStudio?: Studio | null;
  submitting: boolean;
  onSubmit: (values: StudioInput) => void | Promise<void>;
  cancelHref?: string;
}

export default function StudioForm({
  mode,
  ownerName,
  ownerEmail,
  initialStudio,
  submitting,
  onSubmit,
  cancelHref,
}: StudioFormProps) {
  const isEdit = mode === "edit";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const amenities = formData
      .getAll("amenities")
      .filter((item): item is string => typeof item === "string");

    const values: StudioInput = {
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      price: Number(formData.get("price") ?? 0),
      location: String(formData.get("location") ?? "").trim(),
      image: String(formData.get("image") ?? "").trim(),
      capacity: Number(formData.get("capacity") ?? 0),
      areaSize: formData.get("areaSize")
        ? Number(formData.get("areaSize"))
        : undefined,
      rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
      contactEmail: String(formData.get("contactEmail") ?? "").trim(),
      contactPhone: String(formData.get("contactPhone") ?? "").trim(),
      amenities,
      description: String(formData.get("description") ?? "").trim(),
    };

    void onSubmit(values);

    if (!isEdit) {
      event.currentTarget.reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl lg:p-8"
    >
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Host account · read only
            </p>
            <p className="text-sm font-semibold text-white">
              {ownerName || "StudioSpace host"}
            </p>
            <p className="text-xs text-slate-400">
              {ownerEmail || "No email available"}
            </p>
          </div>
        </div>
        <p className="max-w-xs text-[11px] leading-relaxed text-slate-500">
          Listing ownership cannot be changed. Contact details below are shown
          publicly to creators.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="border-b border-slate-800/60 pb-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
          1. Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Camera className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Studio Name
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialStudio?.name ?? ""}
              placeholder="e.g. Neon Vibe Audio Stage"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Tag className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Category
            </label>
            <select
              name="category"
              required
              defaultValue={initialStudio?.category ?? ""}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="" disabled>
                Select studio type
              </option>
              <option value="photography">Photography Studio</option>
              <option value="filmmaking">Film &amp; Video Stage</option>
              <option value="podcasting">Podcast Booth</option>
              <option value="music">Music &amp; Sound Studio</option>
              <option value="workshop">Workshop &amp; Classroom</option>
              <option value="dance">Dance &amp; Rehearsal</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <DollarSign className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Hourly Rate ($)
            </label>
            <input
              type="number"
              name="price"
              required
              min="0"
              defaultValue={initialStudio?.price ?? ""}
              placeholder="e.g. 75"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Location / Address
            </label>
            <input
              type="text"
              name="location"
              required
              defaultValue={initialStudio?.location ?? ""}
              placeholder="e.g. Banani Road 11, Dhaka"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-slate-800/60 pb-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
          2. Space Specifications &amp; Media
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Users className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Max Capacity
            </label>
            <input
              type="number"
              name="capacity"
              required
              min="0"
              defaultValue={initialStudio?.capacity ?? ""}
              placeholder="e.g. 15"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Maximize2 className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Area Size (Sq Ft)
            </label>
            <input
              type="number"
              name="areaSize"
              min="0"
              defaultValue={initialStudio?.areaSize ?? ""}
              placeholder="e.g. 1200"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Star className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Initial Rating
            </label>
            <input
              type="number"
              name="rating"
              step="0.1"
              min="1"
              max="5"
              defaultValue={initialStudio?.rating ?? ""}
              placeholder="e.g. 4.9"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <ImageIcon className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
            Main Image Cover URL
          </label>
          <input
            type="url"
            name="image"
            required
            defaultValue={initialStudio?.image ?? ""}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-1.5 border-b border-slate-800/60 pb-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
          <CheckSquare className="h-4 w-4" aria-hidden="true" />
          3. Available Amenities &amp; Equipment
        </h2>

        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 sm:grid-cols-3 md:grid-cols-4">
          {AMENITY_OPTIONS.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-slate-300"
            >
              <input
                type="checkbox"
                name="amenities"
                value={item}
                defaultChecked={initialStudio?.amenities?.includes(item)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500/40"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-slate-800/60 pb-2 text-sm font-semibold uppercase tracking-wider text-purple-400">
          4. Host Contact &amp; Description
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Mail className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Host Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              required
              defaultValue={initialStudio?.contactEmail ?? ownerEmail ?? ""}
              placeholder="host@example.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Phone className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
              Host Phone / WhatsApp
            </label>
            <input
              type="tel"
              name="contactPhone"
              required
              defaultValue={initialStudio?.contactPhone ?? ""}
              placeholder="+880 1700-000000"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <FileText className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
            Studio Description &amp; Rules
          </label>
          <textarea
            name="description"
            rows={4}
            required
            defaultValue={initialStudio?.description ?? ""}
            placeholder="Describe acoustics, gear specs, house rules, booking guidelines..."
            className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200 transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        {cancelHref ? (
          <Link
            href={cancelHref}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white"
          >
            Cancel
          </Link>
        ) : null}

        <Button
          type="submit"
          disabled={submitting}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-purple-900/40 transition-all hover:bg-purple-700 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {isEdit ? "Saving Changes..." : "Publishing..."}
            </>
          ) : isEdit ? (
            <>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Changes
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Publish Studio Listing
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
