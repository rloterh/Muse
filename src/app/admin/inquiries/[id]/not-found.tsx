import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";

export default function AdminInquiryNotFound() {
  return (
    <>
      <Navigation />
      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Inquiry not found
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">
            This inquiry brief isn&apos;t available.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
            The record may not exist in the current environment yet, or the inquiry id may no
            longer be valid.
          </p>
          <Link
            href="/admin"
            className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to admin
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
