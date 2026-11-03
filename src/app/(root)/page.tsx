import { Suspense } from "react";

import HeroCarousel from "@/components/HeroCarousel";
import HowItWorks from "@/components/HowItWorks";
import ProtectedGuarantee from "@/components/ProtectedGuarantee";
import TopStudios, { TopStudiosSkeleton } from "@/components/TopStudios";

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <Suspense fallback={<TopStudiosSkeleton />}>
        <TopStudios />
      </Suspense>
      <HowItWorks />
      <ProtectedGuarantee />
    </div>
  );
}
