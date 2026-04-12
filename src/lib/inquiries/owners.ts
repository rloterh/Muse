import type { InquiryOwner } from "@/types";

export const inquiryOwners: InquiryOwner[] = [
  {
    id: "sofia-laurent",
    name: "Sofia Laurent",
    title: "Strategy Director",
  },
  {
    id: "james-okafor",
    name: "James Okafor",
    title: "Engineering Lead",
  },
  {
    id: "kai-tanaka",
    name: "Kai Tanaka",
    title: "Motion Director",
  },
  {
    id: "amara-cole",
    name: "Amara Cole",
    title: "Client Services Lead",
  },
];

export function resolveInquiryOwnerId(ownerId?: string | null, ownerName?: string | null) {
  if (ownerId && inquiryOwners.some((owner) => owner.id === ownerId)) {
    return ownerId;
  }

  if (!ownerName) {
    return undefined;
  }

  return inquiryOwners.find((owner) => owner.name === ownerName)?.id;
}

export function resolveInquiryOwnerName(ownerId?: string | null, fallbackName?: string | null) {
  if (ownerId) {
    const matchedOwner = inquiryOwners.find((owner) => owner.id === ownerId);

    if (matchedOwner) {
      return matchedOwner.name;
    }
  }

  return fallbackName ?? undefined;
}

export function getViewerOwnerId(viewerName: string) {
  return inquiryOwners.find((owner) => owner.name === viewerName)?.id;
}
