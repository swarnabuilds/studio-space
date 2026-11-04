"use client";

import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { Mail, User, Calendar, ShieldCheck } from "lucide-react";
import { PageLoading } from "@/components/Loading";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (isPending) {
    return <PageLoading text="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-400">
          <User className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Not signed in</h1>
        <p className="text-sm text-slate-400">Please sign in to view your profile.</p>
      </div>
    );
  }

  const createdAt = (user as any).createdAt ? new Date((user as any).createdAt) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">My Profile</h1>
        <p className="text-sm text-slate-400">Manage your account information</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-purple-600/20 to-indigo-600/20">
          <div className="absolute -bottom-16 left-6">
            <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-4 border-slate-900 bg-slate-800 shadow-xl">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">{user.name || "User"}</h2>
            <p className="text-sm text-slate-400">StudioSpace Member</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">Email Address</p>
                <p className="text-sm font-medium text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <User className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">Full Name</p>
                <p className="text-sm font-medium text-white">{user.name || "Not set"}</p>
              </div>
            </div>

            {createdAt && (
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Member Since</p>
                  <p className="text-sm font-medium text-white">
                    {createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">Account Status</p>
                <p className="text-sm font-medium text-emerald-400">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
