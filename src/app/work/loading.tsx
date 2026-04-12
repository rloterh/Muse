import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { LoadingState } from "@/components/ui/route-states";

export default function WorkLoading() {
  return (
    <>
      <Navigation />
      <LoadingState
        eyebrow="Portfolio"
        title="Loading the work archive"
        description="Preparing the filtered project collection, proof blocks, and featured work surfaces."
      />
      <Footer />
    </>
  );
}
