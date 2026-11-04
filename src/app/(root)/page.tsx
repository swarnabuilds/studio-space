import { Suspense } from "react";

import FeaturesSection from "@/components/FeaturesSection";
import HeroCarousel from "@/components/HeroCarousel";
import HowItWorks from "@/components/HowItWorks";
import PitchOfMind from "@/components/PitchOfMind";
import ProtectedGuarantee from "@/components/ProtectedGuarantee";
import TopStudios, { TopStudiosSkeleton } from "@/components/TopStudios";

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <FeaturesSection />
      <Suspense fallback={<TopStudiosSkeleton />}>
        <TopStudios />
      </Suspense>
      <HowItWorks />
      <PitchOfMind />
      <ProtectedGuarantee />
    </div>
  );
}
