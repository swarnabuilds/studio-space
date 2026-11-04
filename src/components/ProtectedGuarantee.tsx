import React from "react";
import { ShieldCheck, Lock, Award, HeartHandshake, Sparkles, CheckCircle2, Shield } from "lucide-react";

export default function ProtectedGuarantee() {
  const guarantees = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-purple-400" />,
      title: "$10,000 Property Protection",
      description: "Every studio booking is automatically covered against accidental gear or property damages.",
    },
    {
      icon: <Lock className="h-6 w-6 text-purple-400" />,
      title: "Secure Escrow Payouts",
      description: "Rental funds are held securely until the shoot concludes successfully and both parties verify.",
    },
    {
      icon: <Award className="h-6 w-6 text-purple-400" />,
      title: "Vetted Creator Community",
      description: "All hosts and creators undergo ID verification to ensure safe, professional studio environments.",
    },
  ];

  const peaceOfMindFeatures = [
    "24/7 Dedicated Support",
    "Instant Host Verification",
    "Transparent Deposit Terms",
    "No Hidden Cancel Fees",
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-950 border border-purple-500/20 rounded-3xl p-6 lg:p-10 shadow-2xl overflow-hidden space-y-8">
        
        {/* Background Glow Accents */}
        <div className="absolute -top-24 -left-24 h-56 w-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Header Title & Peace of Mind Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> StudioSpace Assurance
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <HeartHandshake className="h-7 w-7 text-purple-400" />
                Protected Host & Creator <span className="text-purple-400">Guarantee</span>
              </h2>
              <p className="text-xs lg:text-sm text-slate-400 max-w-2xl leading-relaxed">
                We safeguard every shoot. Enjoy total peace of mind with our built-in coverage, verified identities, and encrypted financial transfers.
              </p>
            </div>
            
          </div>

          {/* 3 Protection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guarantees.map((item, index) => (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl p-5 space-y-3 transition-all duration-300 shadow-xl group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Peace of Mind Feature Tags Line */}
          <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" /> Complete Creator Security Package:
            </span>
            <div className="flex flex-wrap gap-3">
              {peaceOfMindFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-300"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}