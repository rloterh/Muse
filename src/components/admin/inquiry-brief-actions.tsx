"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCheck, LoaderCircle } from "lucide-react";

interface InquiryBriefActionsProps {
  inquiryId: string;
  queueHref: string;
  nextInquiryHref?: string | null;
}

export function InquiryBriefActions({
  inquiryId,
  queueHref,
  nextInquiryHref,
}: InquiryBriefActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function markReviewTouch(destination?: string | null) {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logReviewTouch: true }),
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Unable to log the review touch right now.");
          return;
        }

        if (destination) {
          router.push(destination);
          return;
        }

        setMessage("Review touch recorded.");
        router.refresh();
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  return (
    <div className="mt-5 space-y-4 border-t border-[var(--color-border)] pt-5">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => markReviewTouch(nextInquiryHref)}
          className="inline-flex items-center justify-center gap-2 border border-[var(--color-text)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text)] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Logging review
            </>
          ) : (
            <>
              <CheckCheck className="h-4 w-4" />
              {nextInquiryHref ? "Mark reviewed and continue" : "Mark reviewed"}
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => router.push(nextInquiryHref ?? queueHref)}
          className="inline-flex items-center justify-center gap-2 border border-[var(--color-border)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-text-dim)] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextInquiryHref ? "Skip to next brief" : "Return to queue"}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {message ? (
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">{message}</p>
      ) : null}
      {error ? (
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text)]">{error}</p>
      ) : null}
    </div>
  );
}
