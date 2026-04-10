import { NextRequest, NextResponse } from "next/server";
import { buildViewerSession, getPostSignInPath } from "@/lib/auth/viewer";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { copySupabaseCookies, createRequestSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Authentication is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const redirectTo =
      typeof body.redirectTo === "string" && body.redirectTo.startsWith("/")
        ? body.redirectTo
        : undefined;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const response = NextResponse.next();
    const supabase = createRequestSupabaseClient(request, response);
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !user) {
      return copySupabaseCookies(
        response,
        NextResponse.json(
          { error: "Unable to sign in with those credentials." },
          { status: 401 }
        )
      );
    }

    const viewer = await buildViewerSession(user);

    return copySupabaseCookies(
      response,
      NextResponse.json({
        success: true,
        redirectTo: getPostSignInPath(viewer, redirectTo),
        viewer,
      })
    );
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { error: "Something went wrong while signing in." },
      { status: 500 }
    );
  }
}
