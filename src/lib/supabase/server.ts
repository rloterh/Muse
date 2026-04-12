import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "./env";

type CookieAdapter = {
  getAll: () => { name: string; value: string }[];
  setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => void;
};

function createClient(cookieAdapter: CookieAdapter) {
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: cookieAdapter,
  });
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createClient({
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Server Components cannot always write cookies; middleware and route handlers own refresh writes.
      }
    },
  });
}

export function createRequestSupabaseClient(request: NextRequest, response: NextResponse) {
  return createClient({
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
    },
  });
}

export function copySupabaseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });

  return target;
}
