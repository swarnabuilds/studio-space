import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex items-center justify-center min-h-[75vh]">
      <div className="relative w-full max-w-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-14 text-center space-y-6 shadow-2xl overflow-hidden">
        
        {/* Background Glow Accents */}
        <div className="absolute -top-20 -left-20 h-48 w-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-48 w-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="h-3.5 w-3.5" /> 404 Error - Page Not Found
          </div>

          {/* Big Error Code & Title */}
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight">
              Oops! <span className="text-purple-400">Page Lost</span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              The creative studio or page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all">
                <Home className="h-4 w-4" /> Back to Home
              </Button>
            </Link>

            <Link href="/dashboard/my-studio">
              <Button variant="outline" className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
                <ArrowLeft className="h-4 w-4" /> Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}