 
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  Eye,
  Heart,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import StudioImage from "@/components/StudioImage";
import { Button } from "@/components/ui/button";
import {
  categoryIconElement,
  getCategoryShortLabel,
} from "@/lib/studio-categories";
import { formatPrice, formatRating } from "@/lib/studio-format";
import type { Studio } from "@/types/studio";
import { useSession } from "@/lib/auth-client";
import { addToWishlist, removeFromWishlist } from "@/lib/wishlist-api";
import { toast } from "@/components/ui/toast";

interface StudioCardProps {
  studio: Studio;
  variant?: "public" | "owner";
  isWishlisted?: boolean;
  onWishlistChange?: () => void;
}

export default function StudioCard({
  studio,
  variant = "public",
  isWishlisted = false,
  onWishlistChange,
}: StudioCardProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.email || loading) return;

    setLoading(true);

    try {
      if (wishlisted) {
        const result = await removeFromWishlist({
          userEmail: user.email,
          studioId: studio._id,
        });

        if (result.ok) {
          setWishlisted(false);
          toast.add({ title: "Removed from wishlist" });
          onWishlistChange?.();
        } else {
          toast.add({
            title: "Failed",
            description: result.error,
          });
        }
      } else {
        const result = await addToWishlist({
          userEmail: user.email,
          studioId: studio._id,
        });

        if (result.ok) {
          setWishlisted(true);
          toast.add({ title: "Added to wishlist" });
          onWishlistChange?.();
        } else {
          toast.add({
            title: "Failed",
            description: result.error,
          });
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      toast.add({
        title: "Something went wrong",
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryLabel = getCategoryShortLabel(studio.category);
  const detailsHref = `/studios/${studio._id}`;

  const card = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-purple-950/30">

      {/* Studio Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">

        <StudioImage
          src={studio.image}
          alt={`${studio.name} studio space`}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Category */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-purple-200 backdrop-blur-md">
          {categoryIconElement(studio.category, "h-3.5 w-3.5")}
          {categoryLabel}
        </span>

        {/* Rating */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-slate-950/80 px-2.5 py-1 text-xs font-bold text-amber-400 shadow backdrop-blur-md">
          <Star
            className="h-3.5 w-3.5 fill-amber-400"
            aria-hidden="true"
          />
          <span>{formatRating(studio.rating)}</span>
        </div>

        {/* Wishlist Button */}
        {user?.email && variant !== "owner" && (
          <button
            type="button"
            onClick={toggleWishlist}
            disabled={loading}
            aria-label={
              wishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="group/wishlist absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-red-400/50 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Heart
              className={`h-5 w-5 transition-colors duration-200 ${
                wishlisted
                  ? "fill-red-500 text-red-500 group-hover/wishlist:fill-white group-hover/wishlist:text-white"
                  : "text-red-500 group-hover/wishlist:text-white"
              }`}
            />
          </button>
        )}
      </div>

      {/* Studio Information */}
      <div className="flex flex-1 flex-col gap-3 p-5">

        <div className="space-y-2">

          {/* Studio Name */}
          <h3 className="line-clamp-1 text-lg font-bold text-white transition-colors group-hover:text-purple-300">
            {studio.name}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin
              className="h-3.5 w-3.5 shrink-0 text-purple-400"
              aria-hidden="true"
            />
            <span className="line-clamp-1">
              {studio.location}
            </span>
          </p>
        </div>

        {/* Capacity + Price */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-300">

          <span className="flex items-center gap-1.5">
            <Users
              className="h-3.5 w-3.5 text-purple-400"
              aria-hidden="true"
            />

            <span>
              {studio.capacity && studio.capacity > 0
                ? `Up to ${studio.capacity} people`
                : "Capacity on request"}
            </span>
          </span>

          <span className="flex items-center font-semibold text-white">
            <DollarSign
              className="h-3.5 w-3.5 text-purple-400"
              aria-hidden="true"
            />

            {formatPrice(studio.price)}

            <span className="ml-1 text-[11px] font-normal text-slate-500">
              / hr
            </span>
          </span>
        </div>
      </div>

      {/* View Studio Button */}
      <div className="px-5 pb-5">
        {variant === "public" ? (
          <span className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600/10 px-3 py-2.5 text-xs font-semibold text-purple-300 transition-colors group-hover:bg-purple-600 group-hover:text-white">
            View studio

            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        ) : (
          <Link href={detailsHref} className="block">
            <Button
              variant="outline"
              className="w-full rounded-xl border-slate-700 bg-slate-800/50 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              <Eye
                className="h-3.5 w-3.5 text-purple-400"
                aria-hidden="true"
              />
              View public page
            </Button>
          </Link>
        )}
      </div>
    </article>
  );

  if (variant === "owner") {
    return card;
  }

  return (
    <Link
      href={detailsHref}
      className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      aria-label={`View details for ${studio.name}`}
    >
      {card}
    </Link>
  );
}
 