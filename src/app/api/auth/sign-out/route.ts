import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { copySupabaseCookies, createRequestSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true });
  }

  try {
    const response = NextResponse.next();
    const supabase = createRequestSupabaseClient(request, response);
    const { error } = await supabase.auth.signOut();

    if (error) {
      return copySupabaseCookies(
        response,
        NextResponse.json(
          { error: "Unable to sign out right now." },
          { status: 500 }
        )
      );
    }

    return copySupabaseCookies(response, NextResponse.json({ success: true }));
  } catch (error) {
    console.error("Sign-out error:", error);
    return NextResponse.json(
      { error: "Something went wrong while signing out." },
      { status: 500 }
    );
  }
}
