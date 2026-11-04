import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Quote,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import BookingWidget from "@/components/BookingWidget";
import StudioImage from "@/components/StudioImage";
import {
  categoryIconElement,
  getCategoryLabel,
} from "@/lib/studio-categories";
import {
  formatArea,
  formatCapacity,
  formatDate,
  formatPrice,
  formatRating,
} from "@/lib/studio-format";
import type { Studio } from "@/types/studio";

interface StudioDetailsContentProps {
  studio: Studio;
}

function buildEnquiryHref(studio: Studio): string {
  const subject = encodeURIComponent(`Studio enquiry: ${studio.name}`);
  const body = encodeURIComponent(
    `Hi,\n\nI found ${studio.name} on StudioSpace and I'd like to ask about availability and pricing.\n\nThanks!`
  );

  if (studio.contactEmail) {
    return `mailto:${studio.contactEmail}?subject=${subject}&body=${body}`;
  }

  if (studio.contactPhone) {
    return `tel:${studio.contactPhone.replace(/[^\d+]/g, "")}`;
  }

  return "#host-contact";
}

export default function StudioDetailsContent({
  studio,
}: StudioDetailsContentProps) {
  const categoryLabel = getCategoryLabel(studio.category);
  const enquiryHref = buildEnquiryHref(studio);
  const amenities = studio.amenities ?? [];
  const hasRating = Number.isFinite(studio.rating) && (studio.rating ?? 0) > 0;

  return (
    <article className="space-y-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <li>
            <Link href="/" className="transition hover:text-slate-300">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link href="/studios" className="transition hover:text-slate-300">
              Studios
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="max-w-[220px] truncate font-medium text-slate-300 sm:max-w-none">
            {studio.name}
          </li>
        </ol>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-300">
            {categoryIconElement(studio.category, "h-3.5 w-3.5")}
            {categoryLabel}
          </span>

          {hasRating && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              {formatRating(studio.rating)} rating
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {studio.name}
            </h1>

            <p className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
              {studio.location}
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All studios
          </Link>
        </div>
      </header>

      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 lg:aspect-[21/9]">
        <StudioImage
          src={studio.image}
          alt={`${studio.name} studio space`}
          sizes="(min-width: 1024px) 1152px, 100vw"
          priority
          fallbackLabel="Studio photo unavailable"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white">About this studio</h2>

            {studio.description ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-400">
                {studio.description}
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                The host hasn&apos;t added a description yet. Reach out through
                the contact panel to learn more about this space.
              </p>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6 sm:grid-cols-4">
              <DetailStat
                icon={<Users className="h-4 w-4" aria-hidden="true" />}
                label="Capacity"
                value={formatCapacity(studio.capacity)}
              />
              <DetailStat
                icon={<Maximize2 className="h-4 w-4" aria-hidden="true" />}
                label="Space"
                value={formatArea(studio.areaSize)}
              />
              <DetailStat
                icon={<Star className="h-4 w-4" aria-hidden="true" />}
                label="Rating"
                value={hasRating ? `${formatRating(studio.rating)} / 5` : "New listing"}
              />
              <DetailStat
                icon={<Clock className="h-4 w-4" aria-hidden="true" />}
                label="Listed"
                value={formatDate(studio.createdAt)}
              />
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-purple-400" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">Amenities &amp; features</h2>
            </div>

            {amenities.length > 0 ? (
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/40 px-3.5 py-3 text-sm text-slate-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                No amenities have been listed for this studio yet. Ask the host
                about the equipment and facilities included.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-400" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">Before you book</h2>
            </div>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                Confirm availability and minimum booking hours directly with the
                host before making travel plans.
              </li>
              <li className="flex gap-2.5">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                Pricing shown is the listed hourly rate and may change for peak
                dates, equipment add-ons, or extended sessions.
              </li>
              <li className="flex gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                StudioSpace lists this space but does not process payments for
                it. Agree on terms with the host before your shoot.
              </li>
            </ul>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <BookingWidget studioId={studio._id} studioPrice={studio.price} />

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-center text-xs text-slate-500">
              Prefer to reach out directly?
            </p>
            <a
              href={enquiryHref}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact Host
            </a>

            <dl className="mt-6 space-y-3 border-t border-slate-800 pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Category</dt>
                <dd className="text-right font-medium text-slate-200">
                  {categoryLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Capacity</dt>
                <dd className="text-right font-medium text-slate-200">
                  {formatCapacity(studio.capacity)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Area</dt>
                <dd className="text-right font-medium text-slate-200">
                  {formatArea(studio.areaSize)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Rating</dt>
                <dd className="flex items-center justify-end gap-1 font-medium text-slate-200">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {formatRating(studio.rating)}
                </dd>
              </div>
            </dl>
          </div>

          <div
            id="host-contact"
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Host contact
            </h2>

            <p className="mt-3 text-lg font-bold text-white">
              {studio.ownerName ?? "Studio host"}
            </p>

            <div className="mt-4 space-y-3 text-sm">
              {studio.contactEmail ? (
                <a
                  href={`mailto:${studio.contactEmail}`}
                  className="flex items-center gap-2.5 text-slate-300 transition hover:text-purple-300"
                >
                  <Mail className="h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                  <span className="break-all">{studio.contactEmail}</span>
                </a>
              ) : null}

              {studio.contactPhone ? (
                <a
                  href={`tel:${studio.contactPhone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-2.5 text-slate-300 transition hover:text-purple-300"
                >
                  <Phone className="h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                  {studio.contactPhone}
                </a>
              ) : null}

              {!studio.contactEmail && !studio.contactPhone && (
                <p className="text-slate-400">
                  The host hasn&apos;t shared contact details yet. Check back
                  soon or browse other studios in the meantime.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

function DetailStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
        <span className="text-purple-400">{icon}</span>
        {label}
      </dt>
      <dd className="text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}
