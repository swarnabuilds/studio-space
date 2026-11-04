import { Camera, CalendarCheck, ShieldCheck, Star } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Premium Studios",
    description: "Discover handpicked creative spaces with top-tier equipment and amenities.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description: "Request bookings instantly with flexible time slots that fit your schedule.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Trusted",
    description: "Verified hosts and transparent listings for a safe booking experience.",
  },
  {
    icon: Star,
    title: "Top Rated",
    description: "Book from highly rated studios trusted by creators worldwide.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-purple-300">
          Why Choose Us
        </span>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white lg:text-4xl">
          Everything You Need <span className="text-purple-400">To Create</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
          StudioSpace makes it simple to find, book, and create in the perfect studio space.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-purple-500/50 hover:bg-slate-900/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition group-hover:bg-purple-500/20">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
