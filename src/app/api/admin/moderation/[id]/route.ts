import { NextRequest, NextResponse } from "next/server";
import { buildViewerSession } from "@/lib/auth/viewer";
import { canAccessViewerRole } from "@/lib/auth/roles";
import { resolveInquiryOwnerName } from "@/lib/inquiries/owners";
import {
  isModerationTaskStatus,
  updateModerationTask,
} from "@/lib/moderation/repository";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { copySupabaseCookies, createRequestSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Moderation management is not configured yet." },
      { status: 503 }
    );
  }

  const response = NextResponse.next();

  try {
    const supabase = createRequestSupabaseClient(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Authentication required." }, { status: 401 })
      );
    }

    const viewer = await buildViewerSession(user);

    if (!canAccessViewerRole(viewer.role, "editor")) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Editor access is required." }, { status: 403 })
      );
    }

    const body = await request.json();
    const nextStatus = body.status;
    const ownerId = typeof body.ownerId === "string" ? body.ownerId.trim() : undefined;
    const notes = typeof body.notes === "string" ? body.notes.trim() : undefined;
    const approvalAction =
      body.approvalAction === "schedule" || body.approvalAction === "publish"
        ? body.approvalAction
        : undefined;
    const { id } = await params;

    if (!id) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Moderation task id is required." }, { status: 400 })
      );
    }

    if (nextStatus && !isModerationTaskStatus(nextStatus)) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Invalid moderation status." }, { status: 400 })
      );
    }

    if (notes && notes.length > 1500) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Notes must be 1500 characters or fewer." }, { status: 400 })
      );
    }

    if (ownerId && !resolveInquiryOwnerName(ownerId)) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Invalid owner selection." }, { status: 400 })
      );
    }

    if (
      !nextStatus &&
      typeof ownerId !== "string" &&
      typeof notes !== "string" &&
      !approvalAction
    ) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "No moderation updates were provided." }, { status: 400 })
      );
    }

    const task = await updateModerationTask(id, {
      status: nextStatus,
      ownerId,
      ownerName: resolveInquiryOwnerName(ownerId),
      notes,
      approvalAction,
      actorName: viewer.name,
    });

    return copySupabaseCookies(
      response,
      NextResponse.json({
        success: true,
        task,
      })
    );
  } catch (error) {
    console.error("Moderation update error:", error);
    return copySupabaseCookies(
      response,
      NextResponse.json(
        { error: "Something went wrong while updating the moderation task." },
        { status: 500 }
      )
    );
  }
}
