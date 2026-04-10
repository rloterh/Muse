import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  canAccessViewerRole,
  normalizeViewerRole,
  viewerRolePermissions,
} from "@/lib/auth/roles";
import type { UserProfileRecord, ViewerRole, ViewerSession } from "@/types";

type ProfileSource = UserProfileRecord | null;

function normalizeMetadataField(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function deriveRole(user: User, profile: ProfileSource): ViewerRole {
  return normalizeViewerRole(
    profile?.role ??
      normalizeMetadataField(user.app_metadata?.role) ??
      normalizeMetadataField(user.user_metadata?.role) ??
      "client"
  );
}

function deriveName(user: User, profile: ProfileSource) {
  return (
    profile?.full_name ??
    normalizeMetadataField(user.user_metadata?.full_name) ??
    normalizeMetadataField(user.user_metadata?.name) ??
    user.email?.split("@")[0] ??
    "Muse account"
  );
}

function deriveTitle(role: ViewerRole, user: User, profile: ProfileSource) {
  return (
    profile?.title ??
    normalizeMetadataField(user.app_metadata?.title) ??
    normalizeMetadataField(user.user_metadata?.title) ??
    (role === "admin"
      ? "Operations Director"
      : role === "editor"
        ? "Content Producer"
        : "Client Partner")
  );
}

function deriveCompany(user: User, profile: ProfileSource) {
  return (
    profile?.company ??
    normalizeMetadataField(user.app_metadata?.company) ??
    normalizeMetadataField(user.user_metadata?.company) ??
    undefined
  );
}

export async function getUserProfile(userId: string): Promise<ProfileSource> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name,title,company,role")
    .eq("id", userId)
    .maybeSingle<UserProfileRecord>();

  if (error) {
    return null;
  }

  return data;
}

export async function buildViewerSession(user: User): Promise<ViewerSession> {
  const profile = await getUserProfile(user.id);
  const role = deriveRole(user, profile);

  return {
    id: user.id,
    email: user.email ?? "",
    name: deriveName(user, profile),
    role,
    title: deriveTitle(role, user, profile),
    company: deriveCompany(user, profile),
    permissions: viewerRolePermissions[role],
  };
}

export const getServerAuthSnapshot = cache(async () => {
  if (!isSupabaseConfigured()) {
    return { configured: false, viewer: null as ViewerSession | null };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true, viewer: null as ViewerSession | null };
  }

  return {
    configured: true,
    viewer: await buildViewerSession(user),
  };
});

export async function requireViewerRole(
  minimumRole: Exclude<ViewerRole, "guest">,
  redirectTo: string
) {
  const snapshot = await getServerAuthSnapshot();

  if (!snapshot.configured) {
    redirect("/auth?reason=not-configured");
  }

  if (!snapshot.viewer) {
    redirect(`/auth?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  if (!canAccessViewerRole(snapshot.viewer.role, minimumRole)) {
    redirect(
      `/auth?reason=insufficient-role&redirectTo=${encodeURIComponent(redirectTo)}`
    );
  }

  return snapshot.viewer;
}

export function getPostSignInPath(viewer: ViewerSession | null, requestedPath?: string | null) {
  if (requestedPath && requestedPath.startsWith("/")) {
    return requestedPath;
  }

  return canAccessViewerRole(viewer?.role, "editor") ? "/admin" : "/work";
}
