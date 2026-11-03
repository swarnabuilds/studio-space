"use client";

import React, { useState } from "react";
import {
  Camera,
  PlusCircle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import StudioForm from "@/components/StudioForm";
import { createStudio } from "@/lib/studios-api";
import type { StudioInput } from "@/types/studio";

export default function AddStudioPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: StudioInput) => {
    if (!user?.email || !user?.name) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in to list your studio.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    const result = await createStudio({
      ...values,
      ownerEmail: user.email,
      ownerName: user.name,
    });

    setLoading(false);

    if (!result.ok) {
      toast.add({
        title: "Failed to Add Studio",
        description: result.error,
        type: "error",
      });
      return;
    }

    toast.add({
      title: "Studio Published Successfully! 🎉",
      description: "Your studio listing has been saved to the database.",
      type: "success",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-900/40">
            <PlusCircle className="h-5 w-5" />
          </div>
          Add New Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Provide complete specifications and details for your creative space.
        </p>
      </div>

      {/* Form Card */}
      <StudioForm
        mode="create"
        ownerName={user?.name}
        ownerEmail={user?.email}
        submitting={loading}
        onSubmit={handleSubmit}
      />

    </div>
  );
}
