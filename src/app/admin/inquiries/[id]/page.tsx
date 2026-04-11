import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarClock, Mail, MapPin, Radar, UserRound } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireViewerRole } from "@/lib/auth/viewer";
import { getViewerOwnerId, resolveInquiryOwnerName } from "@/lib/inquiries/owners";
import {
  describeQueueActionReason,
  filterInquiryPipeline,
  isFollowUpDue,
  serializeQueueFilters,
  sortInquiriesByQueuePriority,
  type DeliveryFilter,
  type QueueView,
} from "@/lib/inquiries/queue";
import { getInquiryPipeline } from "@/lib/inquiries/repository";

function formatTimestamp(value?: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    options ?? {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function priorityVariant(priority: string) {
  if (priority === "high") return "warning";
  if (priority === "medium") return "accent";
  return "neutral";
}

export default async function AdminInquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const viewer = await requireViewerRole("editor", "/admin");
  const { id } = await params;
  const rawSearchParams = await searchParams;
  const inquiries = await getInquiryPipeline();
  const inquiry = inquiries.find((entry) => entry.id === id) ?? null;

  if (!inquiry) {
    notFound();
  }

  const getSearchParam = (key: string) => {
    const value = rawSearchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const queueViewValue = getSearchParam("view");
  const deliveryValue = getSearchParam("delivery");
  const queueView: QueueView =
    queueViewValue === "mine" ||
    queueViewValue === "urgent" ||
    queueViewValue === "follow-up" ||
    queueViewValue === "proposal"
      ? queueViewValue
      : "all";
  const deliveryFilter: DeliveryFilter =
    deliveryValue === "pending" || deliveryValue === "delivered" ? deliveryValue : "all";
  const queueFilters = {
    search: getSearchParam("q") ?? "",
    status: (getSearchParam("status") as typeof inquiry.status | "all" | undefined) ?? "all",
    fit: (getSearchParam("fit") as typeof inquiry.routing.fit | "all" | undefined) ?? "all",
    priority:
      (getSearchParam("priority") as typeof inquiry.routing.priority | "all" | undefined) ?? "all",
    delivery: deliveryFilter,
    owner: getSearchParam("owner") ?? "all",
    followUp: getSearchParam("followUp") === "1",
    queueView,
  };
  const viewerOwnerId = getViewerOwnerId(viewer.name);
  const contextualQueue = filterInquiryPipeline(inquiries, queueFilters, {
    viewerName: viewer.name,
    viewerOwnerId,
  });
  const workflowBase = contextualQueue.some((entry) => entry.id === inquiry.id)
    ? contextualQueue
    : inquiries;
  const rankedWorkflow = sortInquiriesByQueuePriority(workflowBase);
  const currentIndex = rankedWorkflow.findIndex((entry) => entry.id === inquiry.id);
  const nextInquiry =
    currentIndex >= 0 && currentIndex < rankedWorkflow.length - 1
      ? rankedWorkflow[currentIndex + 1]
      : null;
  const queueQuery = serializeQueueFilters(queueFilters);
  const queueHref = queueQuery ? `/admin?${queueQuery}` : "/admin";
  const nextInquiryHref = nextInquiry
    ? `/admin/inquiries/${nextInquiry.id}${queueQuery ? `?${queueQuery}` : ""}`
    : null;
  const queueContextBadges = [
    queueView !== "all" ? queueView.replace("-", " ") : null,
    queueFilters.status !== "all" ? queueFilters.status : null,
    queueFilters.fit !== "all" ? `${queueFilters.fit} fit` : null,
    queueFilters.priority !== "all" ? `${queueFilters.priority} priority` : null,
    queueFilters.delivery !== "all"
      ? queueFilters.delivery === "pending"
        ? "Pending delivery"
        : "Delivered"
      : null,
    queueFilters.owner !== "all"
      ? queueFilters.owner === "unassigned"
        ? "Unassigned owner"
        : resolveInquiryOwnerName(queueFilters.owner, queueFilters.owner)
      : null,
    queueFilters.followUp ? "Follow-up due" : null,
    queueFilters.search.trim() ? `Search: ${queueFilters.search.trim()}` : null,
  ].filter(Boolean) as string[];

  const nextTouchAt = formatTimestamp(inquiry.nextTouchAt, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const createdAt = formatTimestamp(inquiry.createdAt);
  const updatedAt = formatTimestamp(inquiry.updatedAt);
  const history = inquiry.history ?? [];
  const attribution = inquiry.attribution ?? {};

  return (
    <>
      <Navigation />
      <section className="px-8 pb-32 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <Link
              href={queueHref}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to queue
            </Link>
            <p className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Inquiry brief
            </p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
                  {inquiry.company}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
                  A complete view of ownership, qualification, source context, and recent
                  operational movement for this inquiry.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge variant={priorityVariant(inquiry.routing.priority)}>
                  {inquiry.routing.priority}
                </StatusBadge>
                <StatusBadge variant="accent">{inquiry.status}</StatusBadge>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-4">
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Owner
              </p>
              <p className="mt-4 text-lg text-[var(--color-text)]">
                {inquiry.assignedTo ?? inquiry.routing.owner}
              </p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Next touch
              </p>
              <p className="mt-4 text-lg text-[var(--color-text)]">{nextTouchAt ?? "Not scheduled"}</p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Source
              </p>
              <p className="mt-4 text-lg text-[var(--color-text)]">{inquiry.source}</p>
            </div>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                Last updated
              </p>
              <p className="mt-4 text-lg text-[var(--color-text)]">{updatedAt ?? "Preview seed"}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <Reveal>
              <div className="space-y-6">
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    <UserRound className="h-4 w-4 text-[var(--color-accent)]" />
                    Contact context
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Contact
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.contact}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Email
                      </p>
                      <a
                        href={inquiry.email ? `mailto:${inquiry.email}` : undefined}
                        className="mt-2 inline-flex items-center gap-2 text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        <Mail className="h-4 w-4 text-[var(--color-accent)]" />
                        {inquiry.email ?? "Not provided"}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Region
                      </p>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm text-[var(--color-text)]">
                        <MapPin className="h-4 w-4 text-[var(--color-accent)]" />
                        {inquiry.region}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Website
                      </p>
                      {inquiry.website ? (
                        <a
                          href={inquiry.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                        >
                          Visit site
                          <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-[var(--color-text-dim)]">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    <Radar className="h-4 w-4 text-[var(--color-accent)]" />
                    Qualification
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Budget
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Timeline
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.timeline}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Fit
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.routing.fit}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Routing team
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{inquiry.routing.team}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                      Next step
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {inquiry.routing.nextStep}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {inquiry.services.map((service) => (
                      <StatusBadge key={`${inquiry.id}-${service}`} variant="accent">
                        {service}
                      </StatusBadge>
                    ))}
                  </div>
                </div>

                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Project brief
                  </p>
                  <div className="mt-5 space-y-5">
                    {inquiry.goals ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                          Success criteria
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          {inquiry.goals}
                        </p>
                      </div>
                    ) : null}
                    {inquiry.message ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                          Additional context
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          {inquiry.message}
                        </p>
                      </div>
                    ) : null}
                    {!inquiry.goals && !inquiry.message ? (
                      <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">
                        This inquiry does not include a longer brief yet.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Queue workflow
                  </p>
                  <div className="mt-5 space-y-4 border-b border-[var(--color-border)] pb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Working order
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">
                        {queueContextBadges.length > 0 ? "Filtered queue context" : "Global ops order"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Position
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">
                        {currentIndex >= 0 ? `${currentIndex + 1} of ${rankedWorkflow.length}` : "Outside current queue"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {queueContextBadges.length > 0 ? (
                        queueContextBadges.map((badge) => <StatusBadge key={badge}>{badge}</StatusBadge>)
                      ) : (
                        <StatusBadge>Full queue coverage</StatusBadge>
                      )}
                    </div>
                    <Link
                      href={queueHref}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      Return to queue
                      <ArrowUpRight className="h-4 w-4 text-[var(--color-accent)]" />
                    </Link>
                  </div>

                  {nextInquiry ? (
                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                        Next recommended brief
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--color-text)]">
                        {nextInquiry.company}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {nextInquiry.contact}
                        {nextInquiry.email ? ` | ${nextInquiry.email}` : ""}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]">
                        {describeQueueActionReason(nextInquiry)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <StatusBadge variant={nextInquiry.routing.priority === "high" ? "warning" : "accent"}>
                          {nextInquiry.routing.priority}
                        </StatusBadge>
                        <StatusBadge>{nextInquiry.status}</StatusBadge>
                        <StatusBadge>
                          {nextInquiry.assignedOwnerId
                            ? resolveInquiryOwnerName(
                                nextInquiry.assignedOwnerId,
                                nextInquiry.assignedTo ?? nextInquiry.routing.owner
                              )
                            : "Unassigned"}
                        </StatusBadge>
                        {nextInquiry.notificationDelivered === false ? (
                          <StatusBadge variant="warning">Pending delivery</StatusBadge>
                        ) : null}
                        {isFollowUpDue(nextInquiry.nextTouchAt) ? (
                          <StatusBadge variant="warning">Follow-up due</StatusBadge>
                        ) : null}
                      </div>
                      <Link
                        href={nextInquiryHref ?? `/admin/inquiries/${nextInquiry.id}`}
                        className="mt-5 inline-flex items-center gap-2 border border-[var(--color-text)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text)] transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
                      >
                        Open next inquiry
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                        This inquiry is the last item in the current working order. Return to the queue to choose a new focus.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    <CalendarClock className="h-4 w-4 text-[var(--color-accent)]" />
                    Operational snapshot
                  </div>
                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Assigned owner
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">
                        {inquiry.assignedTo ?? inquiry.routing.owner}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Next touch
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{nextTouchAt ?? "Not scheduled"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Created
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">{createdAt ?? "Preview seed"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Notification
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text)]">
                        {inquiry.notificationDelivered === false ? "Pending" : "Delivered"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Attribution
                  </p>
                  <div className="mt-5 space-y-4 text-sm text-[var(--color-text-muted)]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Intent
                      </p>
                      <p className="mt-2 text-[var(--color-text)]">{attribution.intent ?? "Direct inquiry"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Referral source
                      </p>
                      <p className="mt-2 text-[var(--color-text)]">
                        {attribution.referralSource ?? inquiry.source}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Campaign
                      </p>
                      <p className="mt-2 text-[var(--color-text)]">
                        {attribution.utmCampaign ?? "Not tagged"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
                        Landing path
                      </p>
                      <p className="mt-2 break-all text-[var(--color-text)]">
                        {attribution.landingPath ?? "/contact"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-dim)]">
                    Activity trail
                  </p>
                  <div className="mt-5 space-y-3">
                    {history.length > 0 ? (
                      history.map((entry) => (
                        <div key={entry.id} className="border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                              {entry.label}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-dim)]">
                              {formatTimestamp(entry.createdAt) ?? "Now"}
                            </p>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {entry.detail}
                          </p>
                          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-dim)]">
                            {entry.actor}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">
                        No activity has been recorded for this inquiry yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
