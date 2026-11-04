"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import StudioCard from "@/components/StudioCard";
import { useSession } from "@/lib/auth-client";
import { getWishlist } from "@/lib/wishlist-api";
import type { Studio } from "@/types/studio";
import { PageLoading } from "@/components/Loading";

export default function WishlistPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const result = await getWishlist(user.email);
    if (result.ok) {
      setStudios(result.studios);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isPending) {
      loadWishlist();
    }
  }, [user?.email, isPending]);

  if (isPending || loading) {
    return <PageLoading text="Loading wishlist..." />;
  }

  if (!user?.email) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-400">
          <Heart className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Sign in to view your wishlist</h1>
        <p className="text-sm text-slate-400">Save your favorite studios to access them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Saved / Wishlist</h1>
        <p className="text-sm text-slate-400">
          {studios.length} {studios.length === 1 ? "studio" : "studios"} saved
        </p>
      </div>

      {studios.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-slate-400">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-white">No saved studios yet</h2>
          <p className="text-sm text-slate-400">Start exploring and save your favorite studios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              isWishlisted
              onWishlistChange={loadWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
