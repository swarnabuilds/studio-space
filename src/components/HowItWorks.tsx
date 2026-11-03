import React from "react";
import { Search, CalendarCheck, CreditCard, Video, Sparkles, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      stepNo: "01",
      icon: <Search className="h-6 w-6 text-purple-400" />,
      title: "Discover Spaces",
      description: "Filter by professional audio specs, lighting rigs, infinity cycs, or podcast gear.",
      badge: "Explore",
    },
    {
      stepNo: "02",
      icon: <CalendarCheck className="h-6 w-6 text-purple-400" />,
      title: "Select Shoot Hours",
      description: "Inspect dynamic real-time slot availability without double-booking collisions.",
      badge: "Schedule",
    },
    {
      stepNo: "03",
      icon: <CreditCard className="h-6 w-6 text-purple-400" />,
      title: "Book Instantly",
      description: "Reserve securely with transparent hourly rates and clear security deposit terms.",
      badge: "Secure",
    },
    {
      stepNo: "04",
      icon: <Video className="h-6 w-6 text-purple-400" />,
      title: "Create & Produce",
      description: "Check in with instant host codes, shoot your vision, and access gear seamlessly.",
      badge: "Produce",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="h-3.5 w-3.5" /> Seamless Process
        </div>
        <h2 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
          How <span className="text-purple-400">StudioSpace</span> Works
        </h2>
        <p className="text-xs lg:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          From finding the ultimate creative environment to rolling cameras, your journey is streamlined in 4 easy steps.
        </p>
      </div>

      {/* Unique Grid Layout with Glow & Step Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-5 transition-all duration-300 shadow-xl hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
          >
            {/* Background Glow Effect on Hover */}
            <div className="absolute -right-12 -top-12 h-32 w-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-inner">
                  {item.icon}
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-800/80 text-purple-300 border border-slate-700/50">
                  {item.badge}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-purple-400 text-xs font-mono font-semibold tracking-widest">
                  STEP {item.stepNo}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Subtle Indicator */}
            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-purple-400 transition-colors">
              <span className="font-medium">Verified Workflow</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}