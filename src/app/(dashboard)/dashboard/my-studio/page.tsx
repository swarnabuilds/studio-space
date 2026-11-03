"use client";

import React, { useEffect, useState } from "react";
import StudioCard from "@/components/StudioCard";
import { PlusCircle, Layers, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyStudioPage() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Host/User er email diye tar nijer studio gulo fetch korar function
  const fetchMyStudios = async () => {
    try {
      const userEmail = "meri@gmail.com"; // Apnar dashboard-er active user email
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/studio?email=${userEmail}`);
      const data = await res.json();
      setStudios(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching my studios:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStudios();
  }, []);

  // Delete Handler Function
  const handleDelete = async (id: string) => {
    if (confirm("Apni ki nischit je ei studio-ti delete korte chan?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/studio/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        
        if (data.deletedCount > 0 || data.acknowledged) {
          alert("Studio deleted successfully!");
          // State theke delete kora studio ti soriye fela ba list re-fetch kora
          setStudios(studios.filter((studio: any) => studio._id !== id));
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Page Header / Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-900/40">
              <Layers className="h-5 w-5" />
            </div>
            My Studios Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage, update, or remove the creative studios you have published.
          </p>
        </div>

        {/* Add New Studio Button */}
        <Link href="/add-studio">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all">
            <PlusCircle className="h-4 w-4" /> Add New Studio
          </Button>
        </Link>
      </div>

      {/* My Studios Grid Section */}
      <section className="space-y-6">
        {studios.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <p className="text-slate-400 text-sm">You haven't added any creative studios yet.</p>
            <Link href="/add-studio">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-5 py-2 rounded-xl">
                Publish Your First Studio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio: any) => (
              <StudioCard 
                key={studio._id} 
                studio={studio} 
                onDelete={handleDelete}  
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}