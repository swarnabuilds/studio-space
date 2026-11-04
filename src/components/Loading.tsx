"use client";

import { cn } from "cn";

interface LoadingProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loading({ text = "Loading...", className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-8", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-slate-700 border-t-purple-500",
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text ? <p className="text-sm text-slate-400">{text}</p> : null}
    </div>
  );
}

export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loading text={text} size="lg" />
    </div>
  );
}

export function InlineLoading({ className }: { className?: string }) {
  return <Loading text="" size="sm" className={cn("py-2", className)} />;
}
