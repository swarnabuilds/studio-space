"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface RetryButtonProps {
  label?: string;
}

export default function RetryButton({ label = "Try again" }: RetryButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
      className="h-10 rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white hover:bg-purple-700"
    >
      <RefreshCw
        className={isPending ? "h-4 w-4 animate-spin" : "h-4 w-4"}
        aria-hidden="true"
      />
      {isPending ? "Retrying..." : label}
    </Button>
  );
}
