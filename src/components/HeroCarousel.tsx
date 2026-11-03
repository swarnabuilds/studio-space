 
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    badge: "Creative Spaces. Endless Possibilities.",
    title: "Find & Book the\nPerfect Studio",
    subtitle:
      "Photography, Filmmaking, Podcasting, Music & More — All in One Place.",
    bgImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=90&w=2400&auto=format&fit=crop",
    exploreUrl: "/studios",
    hostUrl: "/host",
  },
  {
    id: 2,
    badge: "High-End Gear & Acoustics",
    title: "Elevate Your Sound\n& Music Production",
    subtitle:
      "Book Soundproof Music & Podcast Studios Near You Effortlessly.",
    bgImage:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=90&w=2400&auto=format&fit=crop",
    exploreUrl: "/studios?category=music",
    hostUrl: "/host",
  },
  {
    id: 3,
    badge: "Professional Lighting Setup",
    title: "Capture Moments in\nTop Photo Studios",
    subtitle:
      "Ideal for Fashion Shoots, Product Stills, and Commercial Video.",
    bgImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=90&w=2400&auto=format&fit=crop",
    exploreUrl: "/studios?category=photography",
    hostUrl: "/host",
  },
];

export default function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
    })
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white">

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="relative w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="ml-0">

          {slides.map((slide, index) => (
            <CarouselItem
              key={slide.id}
              className="relative w-full pl-0"
            >

              {/* Hero Section */}
              <div className="relative flex h-[calc(100svh-80px)] min-h-[540px] max-h-[800px] w-full items-center">

                {/* Professional Background Image */}
                <Image
                  src={slide.bgImage}
                  alt={slide.badge}
                  fill
                  priority={index === 0}
                  quality={100}
                  sizes="100vw"
                  className="object-cover object-center brightness-[0.85] contrast-[1.08] saturate-[1.1]"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/10" />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/10" />

                {/* Hero Content */}
                <div className="container relative z-10 mx-auto max-w-7xl px-6 lg:px-16">

                  <div className="max-w-3xl space-y-4">

                    {/* Badge */}
                    <div className="inline-flex rounded-full border border-white/20 bg-slate-900/60 px-4 py-1.5 text-xs font-semibold text-purple-200 shadow-xl backdrop-blur-md sm:text-sm">
                      {slide.badge}
                    </div>

                    {/* Title */}
                    <h1 className="whitespace-pre-line text-3xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">

                      {slide.id === 1 ? (
                        <>
                          Find & Book the
                          <br />
                          <span className="text-purple-400">
                            Perfect Studio
                          </span>
                        </>
                      ) : (
                        slide.title
                      )}

                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl text-sm font-medium leading-relaxed text-slate-200 drop-shadow-lg sm:text-base lg:text-lg">
                      {slide.subtitle}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">

                      <Link href={slide.exploreUrl}>
                        <Button className="h-12 rounded-xl bg-purple-600 px-6 text-sm font-semibold text-white shadow-xl shadow-purple-900/40 transition-all duration-300 hover:scale-105 hover:bg-purple-700">
                          Explore Studios
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>

                      <Link href={slide.hostUrl}>
                        <Button
                          variant="outline"
                          className="h-12 rounded-xl border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-slate-950"
                        >
                          Host Your Space
                        </Button>
                      </Link>

                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* CENTERED ARROWS */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-between px-5">

          <CarouselPrevious
            className="pointer-events-auto static translate-y-0 h-11 w-11 rounded-full border border-white/30 bg-slate-950/60 text-white shadow-lg backdrop-blur-md hover:bg-purple-600 hover:text-white"
          />

          <CarouselNext
            className="pointer-events-auto static translate-y-0 h-11 w-11 rounded-full border border-white/30 bg-slate-950/60 text-white shadow-lg backdrop-blur-md hover:bg-purple-600 hover:text-white"
          />

        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5">

          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-purple-500"
                  : "w-2.5 bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}

        </div>
      </Carousel>
    </div>
  );
}
 