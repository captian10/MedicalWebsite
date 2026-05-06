// src/lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ✅ Prevent crash if env is missing
  if (!url || !anonKey) {
    console.log("[Middleware] ⚠️ Missing Supabase env vars — passing through");
    return NextResponse.next({ request });
  }

  // ✅ We keep a response object we can swap later (next -> redirect)
  let response = NextResponse.next({ request });

  // ✅ Queue cookies so they still work even if we later return redirect response
  const cookieQueue: {
    name: string;
    value: string;
    options?: CookieOptions;
  }[] = [];

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      // ✅ keep async for Next 15/16 compatibility
      async getAll() {
        return request.cookies.getAll();
      },

      // ✅ queue cookies + apply to current response
      async setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookieQueue.push(...cookiesToSet);

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as any);
        });
      },
    },
  });

  // ✅ Must be called right after createServerClient (Supabase SSR rule)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  console.log(`[Middleware] ${pathname} | user=${user?.email ?? "anonymous"}`);

  // ✅ Helper: redirect to sign-in with return URL
  const redirectToSignIn = () => {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);

    console.log(`[Middleware] 🔒 Redirecting to sign-in (from ${pathname})`);

    response = NextResponse.redirect(redirectUrl);

    // Re-apply queued cookies on redirect response
    cookieQueue.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options as any);
    });

    return response;
  };

  // ✅ Protect /profile route
  if (pathname.startsWith("/profile")) {
    if (!user) {
      return redirectToSignIn();
    }
  }

  // ✅ Protect Admin routes
  if (pathname.startsWith("/admin")) {
    // Not logged in → redirect to sign-in
    if (!user) {
      return redirectToSignIn();
    }

    // ✅ Check role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    // Logged in but not admin → go home
    if (profile?.role !== "admin") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";

      console.log(`[Middleware] 🚫 Non-admin user accessing ${pathname} — redirecting home`);

      response = NextResponse.redirect(homeUrl);

      cookieQueue.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as any);
      });

      return response;
    }
  }

  // ✅ Default: pass through — NEVER swallow requests
  return response;
}