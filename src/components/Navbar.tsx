 
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

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
  Moon,
  Sun,
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

function ProfileAvatar({
  image,
  name,
  size = "normal",
}: {
  image?: string | null;
  name?: string | null;
  size?: "normal" | "small";
}) {
  const sizeClass = size === "small" ? "h-9 w-9" : "h-10 w-10";

  return (
    <div
      className={`relative ${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-purple-500/50 bg-purple-600/20`}
    >
      {image ? (
        <Image
          src={image}
          alt={name || "User Avatar"}
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
        />
      ) : (
        <span className="text-sm font-bold text-purple-300">
          {name?.charAt(0).toUpperCase() || "U"}
        </span>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const isActiveRoute = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const desktopLinkClass = (href: string) =>
    cn(
      "relative text-sm font-medium transition hover:text-purple-400",
      isActiveRoute(href) ? "text-white" : "text-slate-300",
      isActiveRoute(href) &&
        "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-purple-500"
    );

  const mobileLinkClass = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition",
      isActiveRoute(href)
        ? "bg-purple-600/15 font-semibold text-purple-300"
        : "text-slate-300 hover:bg-slate-900 hover:text-purple-400"
    );

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

          <Link href="/" className={desktopLinkClass("/")}>
            Home
          </Link>

          <Link href="/studios" className={desktopLinkClass("/studios")}>
            Explore Studios
          </Link>

         

        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isPending ? (

            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-800" />

          ) : user ? (

            /* Logged In User */
            <DropdownMenu>

              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Open profile menu"
                    className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 p-1.5 pr-3 transition hover:border-purple-500/50 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  />
                }
              >
                <ProfileAvatar image={user.image} name={user.name} />

                <span className="hidden max-w-28 truncate text-sm font-medium text-white sm:block">
                  {user.name}
                </span>

                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
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

                      <ProfileAvatar image={user.image} name={user.name} />

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

                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300"
                    render={
                      <Link
                        href="/dashboard/profile"
                        className="flex w-full items-center gap-2"
                      />
                    }
                  >
                    <User className="h-4 w-4 shrink-0 text-purple-400" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
 
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-800" />

                {/* Studio Management */}
                <DropdownMenuGroup>

                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300"
                    render={
                      <Link
                        href="/dashboard/add-studio"
                        className="flex w-full items-center gap-2"
                      />
                    }
                  >
                    <PlusCircle className="h-4 w-4 shrink-0 text-purple-400" />
                    <span>Add New Studio</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300"
                    render={
                      <Link
                        href="/dashboard/my-studio"
                        className="flex w-full items-center gap-2"
                      />
                    }
                  >
                    <Building2 className="h-4 w-4 shrink-0 text-purple-400" />
                    <span>My Studio Listings</span>
                  </DropdownMenuItem>

                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-800" />

                {/* Booking and Wishlist */}
                <DropdownMenuGroup>

                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-purple-500/10 focus:text-purple-300"
                    render={
                      <Link
                        href="/dashboard/my-bookings"
                        className="flex w-full items-center gap-2"
                      />
                    }
                  >
                    <CalendarCheck className="h-4 w-4 shrink-0 text-purple-400" />
                    <span>My Bookings</span>
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

            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-white transition hover:bg-slate-800 md:hidden"
                />
              }
            >
              <Menu className="h-5 w-5" />
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

                  <ProfileAvatar image={user.image} name={user.name} />

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

                <SheetClose
                  nativeButton={false}
                  render={<Link href="/" className={mobileLinkClass("/")} />}
                >
                  <Camera className="h-4 w-4" />
                  Home
                </SheetClose>

                <SheetClose
                  nativeButton={false}
                  render={
                    <Link href="/studios" className={mobileLinkClass("/studios")} />
                  }
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Explore Studios
                </SheetClose>

               

                {user ? (
                  <>

                    <div className="my-2 border-t border-slate-800" />

                    <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      My Account
                    </p>

                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/dashboard/profile"
                          className={mobileLinkClass("/dashboard/profile")}
                        />
                      }
                    >
                      <User className="h-4 w-4 text-purple-400" />
                      My Profile
                    </SheetClose>

                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/dashboard/my-studio"
                          className={mobileLinkClass("/dashboard/my-studio")}
                        />
                      }
                    >
                      <LayoutDashboard className="h-4 w-4 text-purple-400" />
                      Dashboard
                    </SheetClose>

                    <div className="my-2 border-t border-slate-800" />

                    <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Studio Management
                    </p>

                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/dashboard/add-studio"
                          className={mobileLinkClass("/dashboard/add-studio")}
                        />
                      }
                    >
                      <PlusCircle className="h-4 w-4 text-purple-400" />
                      Add New Studio
                    </SheetClose>

                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/dashboard/my-studio"
                          className={mobileLinkClass("/dashboard/my-studio")}
                        />
                      }
                    >
                      <Building2 className="h-4 w-4 text-purple-400" />
                      My Studio Listings
                    </SheetClose>

                    <div className="my-2 border-t border-slate-800" />

                    <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      My Activities
                    </p>

                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/dashboard/my-bookings"
                          className={mobileLinkClass("/dashboard/my-bookings")}
                        />
                      }
                    >
                      <CalendarCheck className="h-4 w-4 text-purple-400" />
                      My Bookings
                    </SheetClose>

                   

                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/dashboard/profile"
                          className={mobileLinkClass("/dashboard/profile")}
                        />
                      }
                    >
                      <Settings className="h-4 w-4 text-purple-400" />
                      Settings
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

                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/login"
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900"
                        />
                      }
                    >
                      <User className="h-4 w-4" />
                      Sign In
                    </SheetClose>

                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/register"
                          className="rounded-lg bg-purple-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-purple-700"
                        />
                      }
                    >
                      Create Account
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
 