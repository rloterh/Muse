"use client";

import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { ErrorState } from "@/components/ui/route-states";

export default function WorkError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <>
      <Navigation />
      <ErrorState
        eyebrow="Portfolio"
        title="The work archive hit a snag"
        description="The page could not finish loading the portfolio surface. Try the route again or head back to the main site."
        onRetry={reset}
        linkHref="/"
        linkLabel="Back to homepage"
      />
      <Footer />
    </>
  );
}
