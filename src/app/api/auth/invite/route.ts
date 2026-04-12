import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { buildViewerSession } from "@/lib/auth/viewer";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getAppUrl, getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import { copySupabaseCookies, createRequestSupabaseClient } from "@/lib/supabase/server";

async function findUserByEmail(email: string) {
  const adminSupabase = createAdminSupabaseClient();
  let page = 1;

  while (true) {
    const { data, error } = await adminSupabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const matched = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (matched) return matched;

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Authentication is not configured yet." },
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

    if (viewer.role !== "admin") {
      return copySupabaseCookies(
        response,
        NextResponse.json({ error: "Admin access is required." }, { status: 403 })
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const role = body.role === "editor" || body.role === "admin" || body.role === "client"
      ? body.role
      : null;

    if (!email || !fullName || !title || !role) {
      return NextResponse.json(
        { error: "Email, name, title, and role are required." },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminSupabaseClient();
    const existingUser = await findUserByEmail(email);
    const redirectTo = `${getAppUrl()}/auth/confirm?next=/auth/set-password`;
    let targetUser = existingUser;

    if (!existingUser) {
      const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
        redirectTo,
        data: {
          full_name: fullName,
          title,
          company,
          role,
        },
      });

      if (error || !data.user) {
        return NextResponse.json(
          { error: "Unable to send the invite right now." },
          { status: 400 }
        );
      }

      targetUser = data.user;
    } else {
      const { error } = await adminSupabase.auth.admin.updateUserById(existingUser.id, {
        user_metadata: {
          full_name: fullName,
          title,
          company,
          role,
        },
        app_metadata: {
          role,
          title,
          company,
        },
      });

      if (error) {
        return NextResponse.json(
          { error: "Unable to update the invited user." },
          { status: 400 }
        );
      }

      const { url, anonKey } = getSupabaseEnv();
      const publicSupabase = createClient(url, anonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const reset = await publicSupabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (reset.error) {
        return NextResponse.json(
          { error: "Unable to send the setup email right now." },
          { status: 400 }
        );
      }
    }

    if (!targetUser) {
      return copySupabaseCookies(
        response,
        NextResponse.json(
          { error: "Unable to resolve the invited account record." },
          { status: 500 }
        )
      );
    }

    const { error: profileError } = await adminSupabase.from("profiles").upsert(
      {
        id: targetUser.id,
        full_name: fullName,
        title,
        company,
        role,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return NextResponse.json(
        { error: "The account was created, but the profile could not be synced." },
        { status: 500 }
      );
    }

    return copySupabaseCookies(
      response,
      NextResponse.json({
        success: true,
        message: existingUser
          ? "Password setup email sent to the existing account."
          : "Invite email sent successfully.",
      })
    );
  } catch (error) {
    console.error("Invite error:", error);
    return copySupabaseCookies(
      response,
      NextResponse.json(
        { error: "Something went wrong while inviting the user." },
        { status: 500 }
      )
    );
  }
}
