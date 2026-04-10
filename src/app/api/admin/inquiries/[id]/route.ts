import { NextRequest, NextResponse } from "next/server";
import { buildViewerSession } from "@/lib/auth/viewer";
import { canAccessViewerRole } from "@/lib/auth/roles";
import { isInquiryStatus, updateInquiryLifecycle } from "@/lib/inquiries/repository";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { copySupabaseCookies, createRequestSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Inquiry management is not configured yet." },
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
    const notes = typeof body.notes === "string" ? body.notes.trim() : undefined;
    const { id } = await params;

    if (!id) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Inquiry id is required." }, { status: 400 })
      );
    }

    if (nextStatus && !isInquiryStatus(nextStatus)) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Invalid inquiry status." }, { status: 400 })
      );
    }

    if (notes && notes.length > 1500) {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Notes must be 1500 characters or fewer." }, { status: 400 })
      );
    }

    if (!nextStatus && typeof notes !== "string") {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "No inquiry updates were provided." }, { status: 400 })
      );
    }

    const inquiry = await updateInquiryLifecycle(id, {
      status: nextStatus,
      notes,
    });

    return copySupabaseCookies(
      response,
      NextResponse.json({
        success: true,
        inquiry,
      })
    );
  } catch (error) {
    console.error("Inquiry update error:", error);
    return copySupabaseCookies(
      response,
      NextResponse.json(
        { error: "Something went wrong while updating the inquiry." },
        { status: 500 }
      )
    );
  }
}
