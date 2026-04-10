import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { NotFoundState } from "@/components/ui/route-states";

export default function JournalPostNotFound() {
  return (
    <>
      <Navigation />
      <NotFoundState
        eyebrow="Journal"
        title="That article could not be found"
        description="The editorial note may have moved, been unpublished, or the link may no longer be valid."
        linkHref="/journal"
        linkLabel="Open the journal"
      />
      <Footer />
    </>
  );
}
