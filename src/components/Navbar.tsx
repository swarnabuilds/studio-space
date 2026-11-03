 
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

import {
  Camera,
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  ChevronDown,
  Menu,
  PlusCircle,
  Building2,
  CalendarCheck,
  Heart,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);

  // Profile Avatar
  const ProfileAvatar = ({
    size = "normal",
  }: {
    size?: "normal" | "small";
  }) => {
    const sizeClass =
      size === "small" ? "h-9 w-9" : "h-10 w-10";

    return (
      <div
        className={`relative ${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-purple-500/50 bg-purple-600/20`}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || "User Avatar"}
            fill
            sizes="40px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="text-sm font-bold text-purple-300">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
        )}
      </div>
    );
  };

  // Sign Out Function
  const handleSignOut = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              title: "Signed Out Successfully!",
              description:
                "You have been logged out from StudioSpace.",
              type: "success",
            });

            router.replace("/login");
            router.refresh();
          },

          onError: (ctx) => {
            toast.add({
              title: "Sign Out Failed",
              description:
                ctx.error.message || "Please try again.",
              type: "error",
            });

            setLoading(false);
          },
        },
      });
    } catch (error) {
      console.error("Sign Out Error:", error);

      toast.add({
        title: "Something went wrong",
        description:
          "Unable to sign out. Please try again.",
        type: "error",
      });

      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 shadow-lg shadow-purple-900/30">
            <Camera className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Studio<span className="text-purple-500">Space</span>
          </span>

        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">

          <Link
            href="/"
            className="text-sm font-medium text-slate-300 transition hover:text-purple-400"
          >
            Home
          </Link>

          <Link
            href="/studios"
            className="text-sm font-medium text-slate-300 transition hover:text-purple-400"
          >
            Explore Studios
          </Link>

          <Link
            href="/how-it-works"
            className="text-sm font-medium text-slate-300 transition hover:text-purple-400"
          >
            How It Works
          </Link>

        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {isPending ? (

            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-800" />

          ) : user ? (

            /* Logged In User */
            <DropdownMenu>

              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open profile menu"
                  className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 p-1.5 pr-3 transition hover:border-purple-500/50 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <ProfileAvatar />

                  <span className="hidden max-w-28 truncate text-sm font-medium text-white sm:block">
                    {user.name}
                  </span>

                  <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 rounded-2xl border border-slate-800 bg-slate-900 p-2 text-slate-200 shadow-2xl shadow-black/40"
              >

                {/* User Information */}
                <DropdownMenuGroup>

                  <DropdownMenuLabel className="p-3">
                    <div className="flex items-center gap-3">

                      <ProfileAvatar />

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-white">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {user.email}
                        </p>

                      </div>

                    </div>
                  </DropdownMenuLabel>

                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-800" />

                {/* Account Navigation */}
                <DropdownMenuGroup>

                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300">
                    <Link href="/dashboard/profile" className="flex w-full items-center gap-2">
                      <User className="h-4 w-4 shrink-0 text-purple-400" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
 
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-800" />

                {/* Studio Management */}
                <DropdownMenuGroup>

                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300">
                    <Link href="/dashboard/add-studio" className="flex w-full items-center gap-2">
                      <PlusCircle className="h-4 w-4 shrink-0 text-purple-400" />
                      <span>Add New Studio</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300">
                    <Link href="/dashboard/my-studio" className="flex w-full items-center gap-2">
                      <Building2 className="h-4 w-4 shrink-0 text-purple-400" />
                      <span>My Studio Listings</span>
                    </Link>
                  </DropdownMenuItem>

                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-800" />

                {/* Booking and Wishlist */}
                <DropdownMenuGroup>

                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300">
                    <Link href="/dashboad/my-bookings" className="flex w-full items-center gap-2">
                      <CalendarCheck className="h-4 w-4 shrink-0 text-purple-400" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300">
                    <Link href="/dashboard/wishlist" className="flex w-full items-center gap-2">
                      <Heart className="h-4 w-4 shrink-0 text-purple-400" />
                      <span>Saved / Wishlist</span>
                    </Link>
                  </DropdownMenuItem>

                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-800" />

                {/* Settings */}
                <DropdownMenuGroup>
 

                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-800" />

                {/* Sign Out */}
                <DropdownMenuGroup>

                  <DropdownMenuItem
                    disabled={loading}
                    onClick={handleSignOut}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-300"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />

                    <span>
                      {loading ? "Signing Out..." : "Sign Out"}
                    </span>
                  </DropdownMenuItem>

                </DropdownMenuGroup>

              </DropdownMenuContent>

            </DropdownMenu>

          ) : (

            /* Guest User */
            <div className="hidden items-center gap-3 sm:flex">

              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:bg-purple-700"
              >
                Register
              </Link>

            </div>

          )}

          {/* Mobile Menu */}
          <Sheet>

            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-white transition hover:bg-slate-800 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 border-slate-800 bg-slate-950 text-white"
            >

              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-2">

                <Camera className="h-6 w-6 text-purple-500" />

                <span className="text-lg font-bold">
                  Studio<span className="text-purple-500">Space</span>
                </span>

              </div>

              {/* Mobile User Information */}
              {user && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">

                  <ProfileAvatar />

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {user.email}
                    </p>

                  </div>

                </div>
              )}

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2">

                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                    <Camera className="h-4 w-4" />
                    Home
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/studios" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                    <LayoutDashboard className="h-4 w-4" />
                    Explore Studios
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/how-it-works" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                    <Settings className="h-4 w-4" />
                    How It Works
                  </Link>
                </SheetClose>

                {user ? (
                  <>

                    <div className="my-2 border-t border-slate-800" />

                    <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      My Account
                    </p>

                    <SheetClose asChild>
                      <Link href="/profile" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                        <User className="h-4 w-4 text-purple-400" />
                        My Profile
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                        <LayoutDashboard className="h-4 w-4 text-purple-400" />
                        Dashboard
                      </Link>
                    </SheetClose>

                    <div className="my-2 border-t border-slate-800" />

                    <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Studio Management
                    </p>

                    <SheetClose asChild>
                      <Link href="/studios/new" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                        <PlusCircle className="h-4 w-4 text-purple-400" />
                        Add New Studio
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/my-studios" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                        <Building2 className="h-4 w-4 text-purple-400" />
                        My Studio Listings
                      </Link>
                    </SheetClose>

                    <div className="my-2 border-t border-slate-800" />

                    <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      My Activities
                    </p>

                    <SheetClose asChild>
                      <Link href="/my-bookings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                        <CalendarCheck className="h-4 w-4 text-purple-400" />
                        My Bookings
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/wishlist" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                        <Heart className="h-4 w-4 text-purple-400" />
                        Saved / Wishlist
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-purple-400">
                        <Settings className="h-4 w-4 text-purple-400" />
                        Settings
                      </Link>
                    </SheetClose>

                    <div className="my-2 border-t border-slate-800" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={loading}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {loading ? "Signing Out..." : "Sign Out"}
                    </button>

                  </>
                ) : (
                  <>

                    <div className="my-2 border-t border-slate-800" />

                    <SheetClose asChild>
                      <Link href="/login" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900">
                        <User className="h-4 w-4" />
                        Sign In
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/register" className="rounded-lg bg-purple-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-purple-700">
                        Create Account
                      </Link>
                    </SheetClose>

                  </>
                )}

              </nav>

            </SheetContent>

          </Sheet>

        </div>

      </div>

    </header>
  );
}
 