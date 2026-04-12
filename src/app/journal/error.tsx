"use client";

import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { ErrorState } from "@/components/ui/route-states";

export default function JournalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <>
      <Navigation />
      <ErrorState
        eyebrow="Journal"
        title="The editorial archive could not load"
        description="The journal route encountered a problem while assembling the latest posts and related content."
        onRetry={reset}
        linkHref="/"
        linkLabel="Back to homepage"
      />
      <Footer />
    </>
  );
}
