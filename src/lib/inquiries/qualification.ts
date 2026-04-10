import type { InquiryPriority, InquiryRouting } from "@/types";

interface InquiryQualificationInput {
  budget: string;
  timeline: string;
  services: string[];
  projectFocus: string;
}

function priorityRank(priority: InquiryPriority) {
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

export function qualifyInquiry(input: InquiryQualificationInput): InquiryRouting {
  const primaryService = input.services[0] ?? "";

  let routing: InquiryRouting = {
    team: "Strategy desk",
    owner: "Sofia Laurent",
    fit: "Strategic",
    nextStep: "Review the brief and shape a tailored discovery agenda.",
    priority: "medium",
  };

  if (primaryService === "Web Development" || primaryService === "Product Design") {
    routing = {
      team: "Product + engineering",
      owner: "James Okafor",
      fit: "Build-ready",
      nextStep: "Validate technical constraints and align scope before discovery.",
      priority: "medium",
    };
  }

  if (primaryService === "Motion & 3D") {
    routing = {
      team: "Motion systems",
      owner: "Kai Tanaka",
      fit: "Nurture",
      nextStep: "Propose a phased concept sprint to validate ambition against budget and timeline.",
      priority: "low",
    };
  }

  if (input.projectFocus === "Rebrand or repositioning") {
    routing = {
      team: "Brand strategy",
      owner: "Sofia Laurent",
      fit: "Strategic",
      nextStep: "Frame a positioning workshop and competitive review as the first engagement step.",
      priority: routing.priority,
    };
  }

  if (input.budget === "$50k - $100k" || input.budget === "$100k+") {
    routing.priority = priorityRank(routing.priority) < priorityRank("high") ? "high" : routing.priority;
  }

  if (input.timeline === "ASAP" || input.timeline === "2-4 weeks") {
    routing.priority = priorityRank(routing.priority) < priorityRank("high") ? "high" : routing.priority;
  }

  return routing;
}

export function inferInquiryStatus(priority: InquiryPriority) {
  if (priority === "high") return "Discovery scheduled" as const;
  if (priority === "medium") return "Qualified" as const;
  return "New" as const;
}
