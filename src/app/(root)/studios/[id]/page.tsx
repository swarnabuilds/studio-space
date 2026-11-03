import type { Metadata } from "next";
import { Suspense } from "react";

import StudioDetails from "./StudioDetails";
import StudioDetailsSkeleton from "./StudioDetailsSkeleton";

export const metadata: Metadata = {
  title: "Studio Details | StudioSpace",
  description:
    "View studio specs, amenities, and host contact details on StudioSpace.",
};

export default function StudioDetailsPage({
  params,
}: PageProps<"/studios/[id]">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Suspense fallback={<StudioDetailsSkeleton />}>
        <StudioDetails params={params} />
      </Suspense>
    </div>
  );
}
