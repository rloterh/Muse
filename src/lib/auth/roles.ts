import type { ViewerRole } from "@/types";

export const viewerRoleHierarchy: ViewerRole[] = ["guest", "client", "editor", "admin"];

export const viewerRolePermissions: Record<ViewerRole, string[]> = {
  guest: [],
  client: ["view-work", "submit-inquiry"],
  editor: ["view-work", "submit-inquiry", "review-content", "edit-cms"],
  admin: [
    "view-work",
    "submit-inquiry",
    "review-content",
    "edit-cms",
    "manage-users",
    "view-admin",
  ],
};

export const viewerRoleDetails = {
  client: {
    eyebrow: "Client access",
    title: "Project visibility for active partnerships",
    description:
      "Review published work, revisit deliverables, and stay aligned with the current engagement.",
    permissions: viewerRolePermissions.client,
  },
  editor: {
    eyebrow: "Editor access",
    title: "Content operations for publishing and review",
    description:
      "Manage editorial quality, update service content, and keep the delivery pipeline moving.",
    permissions: viewerRolePermissions.editor,
  },
  admin: {
    eyebrow: "Admin access",
    title: "Full operational control over moderation and platform workflows",
    description:
      "Oversee publishing, quality control, inquiry routing, and broader operational governance.",
    permissions: viewerRolePermissions.admin,
  },
} satisfies Record<Exclude<ViewerRole, "guest">, {
  eyebrow: string;
  title: string;
  description: string;
  permissions: string[];
}>;

export function normalizeViewerRole(value: string | null | undefined): ViewerRole {
  if (value === "client" || value === "editor" || value === "admin") {
    return value;
  }

  return "guest";
}

export function canAccessViewerRole(
  role: ViewerRole | null | undefined,
  minimumRole: Exclude<ViewerRole, "guest">
) {
  if (!role || role === "guest") return false;
  return viewerRoleHierarchy.indexOf(role) >= viewerRoleHierarchy.indexOf(minimumRole);
}
