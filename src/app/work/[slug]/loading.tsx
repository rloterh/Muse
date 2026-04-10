import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { LoadingState } from "@/components/ui/route-states";

export default function WorkCaseStudyLoading() {
  return (
    <>
      <Navigation />
      <LoadingState
        eyebrow="Case Study"
        title="Loading project narrative"
        description="Preparing the case-study story, proof modules, media, and linked editorial recommendations."
        cardCount={2}
      />
      <Footer />
    </>
  );
}
