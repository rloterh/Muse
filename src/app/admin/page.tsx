import { ShieldAlert } from "lucide-react";
import { ConversionReporting } from "@/components/admin/conversion-reporting";
import { InquiryPipeline } from "@/components/admin/inquiry-pipeline";
import { InviteUserCard } from "@/components/admin/invite-user-card";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { Reveal } from "@/components/ui/reveal";
import { requireViewerRole } from "@/lib/auth/viewer";
import { getInquiryPipeline } from "@/lib/inquiries/repository";
import { inquirySummary, moderationSummary, siteSettings } from "@/lib/site/config";

const summary = moderationSummary(siteSettings.moderationQueue);

export default async function AdminPage() {
  const viewer = await requireViewerRole("editor", "/admin");
  const inquiries = await getInquiryPipeline();
  const inquiryStats = inquirySummary(inquiries);

  return (
    <>
      <Navigation />
      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
              Moderation center
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Admin visibility for content,{" "}
              <span className="italic text-[var(--color-accent)]">quality</span>, and pipeline
              health
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
              Access is now enforced through Supabase-backed sessions and role checks, turning the
              moderation center into a real operational surface instead of a preview shell.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center gap-3 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4">
            <StatusBadge variant="accent">{viewer.role}</StatusBadge>
            <p className="text-sm text-[var(--color-text-muted)]">
              Signed in as <span className="text-[var(--color-text)]">{viewer.name}</span>
            </p>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Total queue
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight">{summary.total}</p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Urgent review
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight text-[var(--color-accent)]">
                {summary.urgent}
              </p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Scheduled items
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight">
                {summary.scheduled}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Active inquiries
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight">
                {inquiryStats.total}
              </p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Urgent leads
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight text-[var(--color-accent)]">
                {inquiryStats.urgent}
              </p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Discovery scheduled
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight">
                {inquiryStats.scheduled}
              </p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Follow-up due
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight">
                {inquiryStats.followUpDue}
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {siteSettings.moderationQueue.map((task) => (
              <div
                key={task.id}
                className="group border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-colors hover:border-[var(--color-accent)]/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex items-center gap-2 text-[var(--color-text-dim)]">
                    <ShieldAlert className="h-4 w-4 text-[var(--color-accent)]" />
                    <span className="text-[10px] uppercase tracking-[0.24em]">
                      {task.kind.replace("-", " ")}
                    </span>
                  </div>
                  <StatusBadge
                    variant={
                      task.priority === "high"
                        ? "warning"
                        : task.priority === "medium"
                          ? "accent"
                          : "neutral"
                    }
                  >
                    {task.priority}
                  </StatusBadge>
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)]">
                  {task.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {task.description}
                </p>
                <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                  <StatusBadge>{task.status}</StatusBadge>
                </div>
              </div>
            ))}
          </div>

          <InquiryPipeline inquiries={inquiries} viewerName={viewer.name} />
          <ConversionReporting inquiries={inquiries} />

          {viewer.role === "admin" && (
            <div className="mt-12">
              <InviteUserCard />
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
