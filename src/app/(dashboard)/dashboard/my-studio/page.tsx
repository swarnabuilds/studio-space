import React from "react";
import StudioCard from "@/components/StudioCard";
import { Layers, PlusCircle, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Studio Object-er Type Interface Define Kora Holo
export interface Studio {
  _id: string;
  name: string;
  category: string;
  price: number;
  location: string;
  image: string;
  capacity?: number;
  areaSize?: number;
  rating?: number;
  contactEmail?: string;
  contactPhone?: string;
  amenities?: string[];
}

// Backend theke data fetch korar jonno async function
async function getStudios(): Promise<Studio[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/studio`, {
      cache: "no-store",  
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch studios");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching studios:", error);
    return [];
  }
}

export default async function MyStudioPage() {
  // server-e data load kora 
  const studios: Studio[] = await getStudios();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner - Compact & Reduced Gaps */}
      <section className="relative bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
        
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-medium">
            <Sparkles className="h-3 w-3" /> Host Management Portal
          </div>
          
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-md shadow-purple-900/40">
              <Building2 className="h-4 w-4" />
            </div>
            My Studios <span className="text-purple-400">Dashboard</span>
          </h1>
          
          <p className="text-xs text-slate-400 max-w-xl leading-normal">
            Manage, organize, and monitor all the creative spaces and studio listings registered under your account.
          </p>
        </div>

        <Link href="/dashboard/add-studio" className="shrink-0">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-purple-900/40 flex items-center gap-2 transition-all">
            <PlusCircle className="h-3.5 w-3.5" /> Add New Studio
          </Button>
        </Link>
      </section>

      {/* Explore Studios Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-400" /> Your Studio Listings
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Browse through all your active studio spaces currently live on StudioSpace.
            </p>
          </div>
        </div>

        {studios.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
            <p className="text-slate-400 text-sm">No studios found. Add a new studio from your dashboard!</p>
            <Link href="/add-studio">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-5 py-2 rounded-xl">
                Publish Your First Studio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio: Studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}