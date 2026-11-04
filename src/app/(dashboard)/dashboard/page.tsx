"use client";

import Link from "next/link";
import { Building2, CalendarDays, Heart, PlusCircle, ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const quickLinks = [
    {
      title: "My Studio Listings",
      description: "Manage your studio spaces",
      href: "/dashboard/my-studio",
      icon: Building2,
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "My Bookings",
      description: "View and manage bookings",
      href: "/dashboard/my-bookings",
      icon: CalendarDays,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Wishlist",
      description: "Your saved studios",
      href: "/dashboard/wishlist",
      icon: Heart,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "Add New Studio",
      description: "List a new studio space",
      href: "/dashboard/add-studio",
      icon: PlusCircle,
      color: "from-emerald-600 to-teal-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white lg:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-sm text-slate-400">
          Manage your studios, bookings, and favorites from your dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-purple-500/50"
            >
              <div className={`absolute right-0 top-0 h-32 w-32 bg-gradient-to-br ${link.color} opacity-10 blur-3xl`} />
              <div className="relative flex items-start justify-between">
                <div className="space-y-2">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{link.title}</h3>
                    <p className="text-sm text-slate-400">{link.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-purple-400" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-bold text-white">Quick Start Guide</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 font-semibold">
              1
            </div>
            <h3 className="font-semibold text-white">List Your Studio</h3>
            <p className="text-sm text-slate-400">Add your studio with photos, pricing, and details</p>
          </div>
          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 font-semibold">
              2
            </div>
            <h3 className="font-semibold text-white">Manage Bookings</h3>
            <p className="text-sm text-slate-400">Review and confirm booking requests</p>
          </div>
          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 font-semibold">
              3
            </div>
            <h3 className="font-semibold text-white">Grow Your Business</h3>
            <p className="text-sm text-slate-400">Connect with creators and earn from your space</p>
          </div>
        </div>
      </div>
    </div>
  );
}
