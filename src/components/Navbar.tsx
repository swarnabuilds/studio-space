"use client";

import Link from "next/link";
import { Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white">
            <Camera className="h-5 w-5" />
          </div>
          <span>
            Studio<span className="text-purple-500">Space</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-300 transition-colors hover:text-purple-400 focus:text-purple-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-full"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/login">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 rounded-lg">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button
              variant="outline"
              className="border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white rounded-lg"
            >
              Register
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}