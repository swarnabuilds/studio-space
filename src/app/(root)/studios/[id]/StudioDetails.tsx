import { notFound } from "next/navigation";

import { getStudioById } from "@/lib/studios-api";

import StudioDetailsContent from "./StudioDetailsContent";
import StudioDetailsError from "./StudioDetailsError";

export default async function StudioDetails({
  params,
}: Pick<PageProps<"/studios/[id]">, "params">) {
  const { id } = await params;
  const result = await getStudioById(id);

  if (!result.ok) {
    if (result.reason === "not-found") {
      notFound();
    }

    return <StudioDetailsError message={result.error} />;
  }

  return <StudioDetailsContent studio={result.studio} />;
}
