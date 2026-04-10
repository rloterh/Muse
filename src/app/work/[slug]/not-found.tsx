import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { NotFoundState } from "@/components/ui/route-states";

export default function WorkCaseStudyNotFound() {
  return (
    <>
      <Navigation />
      <NotFoundState
        eyebrow="Case Study"
        title="This project is no longer in the archive"
        description="The case study may have moved, been unpublished, or the link may be out of date."
        linkHref="/work"
        linkLabel="Browse all work"
      />
      <Footer />
    </>
  );
}
