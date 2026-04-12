import { NextRequest, NextResponse } from "next/server";
import { copySupabaseCookies, createRequestSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/auth?reason=auth-confirm-failed";

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(new URL("/auth?reason=auth-confirm-failed", request.url));
  }

  const response = NextResponse.next();
  const supabase = createRequestSupabaseClient(request, response);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return copySupabaseCookies(
      response,
      NextResponse.redirect(new URL("/auth?reason=auth-confirm-failed", request.url))
    );
  }

  return copySupabaseCookies(response, NextResponse.redirect(new URL(nextPath, request.url)));
}
