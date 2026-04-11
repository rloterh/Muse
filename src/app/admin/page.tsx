import { ConversionReporting } from "@/components/admin/conversion-reporting";
import { InquiryOverview } from "@/components/admin/inquiry-overview";
import { InquiryPipeline } from "@/components/admin/inquiry-pipeline";
import { InviteUserCard } from "@/components/admin/invite-user-card";
import { ModerationWorkspace } from "@/components/admin/moderation-workspace";
import { PipelineHealth } from "@/components/admin/pipeline-health";
import { QueuePlaybooks } from "@/components/admin/queue-playbooks";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { Reveal } from "@/components/ui/reveal";
import { requireViewerRole } from "@/lib/auth/viewer";
import { getInquiryPipeline } from "@/lib/inquiries/repository";
import { getModerationQueue } from "@/lib/moderation/repository";
import { inquirySummary, moderationSummary } from "@/lib/site/config";

export default async function AdminPage() {
  const viewer = await requireViewerRole("editor", "/admin");
  const [inquiries, moderationTasks] = await Promise.all([
    getInquiryPipeline(),
    getModerationQueue(),
  ]);
  const inquiryStats = inquirySummary(inquiries);
  const moderationStats = moderationSummary(moderationTasks);

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
              <p className="mt-4 font-display text-5xl font-bold tracking-tight">{moderationStats.total}</p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Urgent review
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight text-[var(--color-accent)]">
                {moderationStats.urgent}
              </p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Scheduled items
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight">
                {moderationStats.scheduled}
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

          <ModerationWorkspace tasks={moderationTasks} />
          <InquiryOverview inquiries={inquiries} />
          <PipelineHealth inquiries={inquiries} />
          <QueuePlaybooks inquiries={inquiries} viewerName={viewer.name} />
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
