import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PitchOfMind() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/20">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="relative grid grid-cols-1 gap-8 p-8 lg:grid-cols-2 lg:gap-12 lg:p-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              Pitch of Mind
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-white lg:text-5xl">
                Where Creativity Meets
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  The Perfect Space
                </span>
              </h2>
              <p className="text-base leading-relaxed text-slate-300 lg:text-lg">
                StudioSpace is your gateway to discovering and booking premium creative studios. 
                From photography and videography to podcasting and music production, find the 
                ideal space to bring your vision to life.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/studios"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:shadow-purple-800/50"
              >
                Explore Studios
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/add-studio"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                List Your Studio
              </Link>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 overflow-hidden rounded-2xl border border-slate-800 sm:h-56">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                  alt="Creative studio space"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
              <div className="relative h-32 overflow-hidden rounded-2xl border border-slate-800 sm:h-40">
                <Image
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
                  alt="Photography studio"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-32 overflow-hidden rounded-2xl border border-slate-800 sm:h-40">
                <Image
                  src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
                  alt="Music studio"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
              <div className="relative h-48 overflow-hidden rounded-2xl border border-slate-800 sm:h-56">
                <Image
                  src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800&q=80"
                  alt="Podcast studio"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
