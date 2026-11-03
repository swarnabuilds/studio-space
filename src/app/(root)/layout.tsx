import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function Rootlayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}