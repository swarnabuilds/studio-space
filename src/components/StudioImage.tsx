"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface StudioImageProps {
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fallbackLabel?: string;
}

export default function StudioImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  priority = false,
  className,
  fallbackLabel = "Studio photo unavailable",
}: StudioImageProps) {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!src || failedToLoad) {
    return (
      <div
        role="img"
        aria-label={`${alt} — ${fallbackLabel}`}
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-purple-950/70",
          className
        )}
      >
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <ImageOff className="h-7 w-7" aria-hidden="true" />
          <span className="px-4 text-center text-[11px] font-medium tracking-wide">
            {fallbackLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      priority={priority}
      onError={() => setFailedToLoad(true)}
      className={cn("object-cover", className)}
    />
  );
}
