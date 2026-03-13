// src/lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ✅ Prevent crash if env is missing
  if (!url || !anonKey) {
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
      // تمت إضافة النوع هنا لحل مشكلة Vercel Type Error
      async setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookieQueue.push(...cookiesToSet);

        cookiesToSet.forEach(({ name, value, options }) => {
          // نستخدم as any لتجنب أي تعارض بسيط في الأنواع بين Next.js و Supabase
          response.cookies.set(name, value, options as any);
        });
      },
    },
  });

  // ✅ Must be called right after createServerClient (Supabase SSR rule)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Protect Admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    // ✅ Not logged in → redirect to sign-in
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/sign-in";
      redirectUrl.searchParams.set(
        "redirect",
        request.nextUrl.pathname + request.nextUrl.search
      );

      response = NextResponse.redirect(redirectUrl);

      // ✅ Re-apply queued cookies on redirect response
      cookieQueue.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as any);
      });

      return response;
    }

    // ✅ Check role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    // ✅ Logged in but not admin → go home
    if (profile?.role !== "admin") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";

      response = NextResponse.redirect(homeUrl);

      // ✅ Re-apply queued cookies on redirect response
      cookieQueue.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as any);
      });

      return response;
    }
  }

  return response;
}