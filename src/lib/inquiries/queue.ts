import { resolveInquiryOwnerName } from "@/lib/inquiries/owners";
import type { InquiryPreview } from "@/types";

export type QueueView = "all" | "mine" | "urgent" | "follow-up" | "proposal";
export type DeliveryFilter = "all" | "pending" | "delivered";

export interface InquiryQueueFilters {
  search?: string;
  status?: InquiryPreview["status"] | "all";
  fit?: InquiryPreview["routing"]["fit"] | "all";
  priority?: InquiryPreview["routing"]["priority"] | "all";
  delivery?: DeliveryFilter;
  owner?: string;
  followUp?: boolean;
  queueView?: QueueView;
}

export interface InquiryQueueViewerContext {
  viewerName: string;
  viewerOwnerId?: string | null;
}

export function toTimestamp(value?: string) {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function isFollowUpDue(nextTouchAt?: string) {
  const timestamp = toTimestamp(nextTouchAt);
  return timestamp !== null && timestamp <= Date.now();
}

export function matchesOwnerFilter(inquiry: InquiryPreview, ownerFilter: string) {
  return (
    ownerFilter === "all" ||
    (ownerFilter === "unassigned" && !inquiry.assignedOwnerId) ||
    inquiry.assignedOwnerId === ownerFilter ||
    (!inquiry.assignedOwnerId &&
      ownerFilter !== "unassigned" &&
      resolveInquiryOwnerName(ownerFilter) === (inquiry.assignedTo ?? inquiry.routing.owner))
  );
}

function matchesViewerQueue(inquiry: InquiryPreview, viewer: InquiryQueueViewerContext) {
  return viewer.viewerOwnerId
    ? inquiry.assignedOwnerId === viewer.viewerOwnerId
    : [inquiry.assignedTo, inquiry.routing.owner].some((value) => value === viewer.viewerName);
}

function matchesQueueView(
  inquiry: InquiryPreview,
  queueView: QueueView,
  viewer: InquiryQueueViewerContext
) {
  return (
    queueView === "all" ||
    (queueView === "mine" && matchesViewerQueue(inquiry, viewer)) ||
    (queueView === "urgent" && inquiry.routing.priority === "high") ||
    (queueView === "follow-up" && isFollowUpDue(inquiry.nextTouchAt)) ||
    (queueView === "proposal" && inquiry.status === "Proposal drafted")
  );
}

export function filterInquiryPipeline(
  inquiries: InquiryPreview[],
  filters: InquiryQueueFilters,
  viewer: InquiryQueueViewerContext
) {
  const query = filters.search?.trim().toLowerCase() ?? "";
  const queueView = filters.queueView ?? "all";
  const status = filters.status ?? "all";
  const fit = filters.fit ?? "all";
  const priority = filters.priority ?? "all";
  const delivery = filters.delivery ?? "all";
  const owner = filters.owner ?? "all";
  const followUp = Boolean(filters.followUp);

  return inquiries.filter((inquiry) => {
    const matchesSearch =
      !query ||
      [
        inquiry.company,
        inquiry.contact,
        inquiry.email,
        inquiry.source,
        inquiry.region,
        inquiry.assignedTo,
        inquiry.routing.owner,
        ...inquiry.services,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));

    const matchesStatus = status === "all" || inquiry.status === status;
    const matchesFit = fit === "all" || inquiry.routing.fit === fit;
    const matchesPriority = priority === "all" || inquiry.routing.priority === priority;
    const matchesDelivery =
      delivery === "all" ||
      (delivery === "pending" && inquiry.notificationDelivered === false) ||
      (delivery === "delivered" && inquiry.notificationDelivered !== false);
    const matchesOwner = matchesOwnerFilter(inquiry, owner);
    const matchesFollowUp = !followUp || isFollowUpDue(inquiry.nextTouchAt);
    const matchesView = matchesQueueView(inquiry, queueView, viewer);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFit &&
      matchesPriority &&
      matchesDelivery &&
      matchesOwner &&
      matchesFollowUp &&
      matchesView
    );
  });
}

export function scoreInquiryForQueue(inquiry: InquiryPreview) {
  let score = 0;

  if (isFollowUpDue(inquiry.nextTouchAt)) {
    score += 500;
  }

  if (inquiry.notificationDelivered === false) {
    score += 300;
  }

  if (inquiry.routing.priority === "high") {
    score += 200;
  }

  if (inquiry.status === "Proposal drafted") {
    score += 150;
  }

  if (inquiry.status === "Qualified" && inquiry.routing.fit === "Strategic") {
    score += 120;
  }

  if (!inquiry.assignedOwnerId) {
    score += 80;
  }

  return score;
}

export function sortInquiriesByQueuePriority(inquiries: InquiryPreview[]) {
  return [...inquiries].sort((left, right) => {
    const scoreDifference = scoreInquiryForQueue(right) - scoreInquiryForQueue(left);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    const leftTouch = toTimestamp(left.nextTouchAt) ?? Number.MAX_SAFE_INTEGER;
    const rightTouch = toTimestamp(right.nextTouchAt) ?? Number.MAX_SAFE_INTEGER;

    if (leftTouch !== rightTouch) {
      return leftTouch - rightTouch;
    }

    const leftUpdated = toTimestamp(left.updatedAt) ?? toTimestamp(left.createdAt) ?? 0;
    const rightUpdated = toTimestamp(right.updatedAt) ?? toTimestamp(right.createdAt) ?? 0;

    return leftUpdated - rightUpdated;
  });
}

export function getNextBestInquiry(inquiries: InquiryPreview[]) {
  return sortInquiriesByQueuePriority(inquiries)[0] ?? null;
}

export function describeQueueActionReason(inquiry: InquiryPreview) {
  if (isFollowUpDue(inquiry.nextTouchAt)) {
    return "Follow-up date has already passed and needs immediate response.";
  }

  if (inquiry.notificationDelivered === false) {
    return "Notification handoff is still pending and needs delivery confirmation.";
  }

  if (inquiry.routing.priority === "high") {
    return "High-priority lead ready for active triage.";
  }

  if (inquiry.status === "Proposal drafted") {
    return "Proposal-stage opportunity needs commercial follow-through.";
  }

  if (inquiry.status === "Qualified" && inquiry.routing.fit === "Strategic") {
    return "Strategic qualified lead is ready for tighter progression.";
  }

  if (!inquiry.assignedOwnerId) {
    return "Ownership still needs to be set before momentum slips.";
  }

  return "Best next lead in the current working view.";
}

export function serializeQueueFilters(filters: InquiryQueueFilters) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("q", filters.search.trim());
  }

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.fit && filters.fit !== "all") {
    params.set("fit", filters.fit);
  }

  if (filters.priority && filters.priority !== "all") {
    params.set("priority", filters.priority);
  }

  if (filters.delivery && filters.delivery !== "all") {
    params.set("delivery", filters.delivery);
  }

  if (filters.owner && filters.owner !== "all") {
    params.set("owner", filters.owner);
  }

  if (filters.followUp) {
    params.set("followUp", "1");
  }

  if (filters.queueView && filters.queueView !== "all") {
    params.set("view", filters.queueView);
  }

  return params.toString();
}
