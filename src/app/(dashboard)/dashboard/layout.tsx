"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Building2, 
  CalendarDays, 
  Heart, 
  LogOut, 
  Camera, 
  Home,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              title: "Signed Out 🎉",
              description: "You have been logged out successfully.",
            });
            window.location.href = "/login";
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }, 
    { name: "Add New Studio", href: "/dashboard/add-studio", icon: PlusCircle },
    { name: "My Studio Listings", href: "/dashboard/my-studio", icon: Building2 },
    { name: "My Bookings", href: "/dashboard/my-bookings", icon: CalendarDays },
    { name: "Saved / Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { name: "Back to Home", href: "/", icon: Home },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative selection:bg-purple-500 selection:text-white">
      
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3.5 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-purple-500 text-white shadow-md shadow-purple-900/40">
            <Camera className="h-4 w-4" />
          </div>
          <span>Studio<span className="text-purple-400">Space</span></span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white focus:outline-none transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* Brand Header */}
        <div className="p-6 hidden md:flex items-center justify-between border-b border-slate-800/60">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-tight">
                Studio<span className="text-purple-400">Space</span>
              </span>
              <span className="text-[10px] text-purple-300/70 font-medium tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* User Profile Info Card in Sidebar (Image size increased to h-20 w-20) */}
       
        <div className="px-5 py-4 mx-4 my-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 flex flex-col items-center text-center shadow-inner">
          <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-purple-500/40 bg-slate-900 mb-2.5 shadow-md">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-purple-600 text-white font-bold text-base">
                {user?.name?.charAt(0).toUpperCase() || "S"}
              </div>
            )}
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div className="overflow-hidden w-full">
            <h3 className="text-sm font-semibold text-white truncate">
              {user?.name || "Swarna Sutradhar"}
            </h3>
            <p className="text-xs text-slate-400 truncate font-normal mt-0.5">
              {user?.email || "swarnasutradhar89@gmail.com"}
            </p>
          </div>
        </div>

        {/* Navigation Links List */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          <p className="px-4 text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-2">Main Menu</p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40 font-semibold" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-purple-400"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Action at Bottom of Sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen bg-slate-950 p-6 lg:p-10 transition-all">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}