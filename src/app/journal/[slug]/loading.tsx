import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { LoadingState } from "@/components/ui/route-states";

export default function JournalPostLoading() {
  return (
    <>
      <Navigation />
      <LoadingState
        eyebrow="Journal Article"
        title="Loading article"
        description="Preparing the editorial layout, supporting media, and connected case-study recommendations."
        cardCount={2}
      />
      <Footer />
    </>
  );
}
