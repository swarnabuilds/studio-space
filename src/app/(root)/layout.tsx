import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function Rootlayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Suspense
        fallback={
          <div className="sticky top-0 z-50 h-16 w-full border-b border-slate-800/80 bg-slate-950/90" />
        }
      >
        <Navbar />
      </Suspense>

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
