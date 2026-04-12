import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { LoadingState } from "@/components/ui/route-states";

export default function JournalLoading() {
  return (
    <>
      <Navigation />
      <LoadingState
        eyebrow="Journal"
        title="Loading editorial archive"
        description="Preparing the latest studio notes, categories, and related recommendation surfaces."
      />
      <Footer />
    </>
  );
}
