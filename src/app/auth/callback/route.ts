import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ✅ safe internal redirect only
function safeRedirectPath(input: string | null) {
  if (!input) return "/";
  if (!input.startsWith("/")) return "/";
  if (input.startsWith("//")) return "/";
  return input;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const nextParam = safeRedirectPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=missing_code`
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=auth_callback_error`
    );
  }

  // ✅ Now we have session cookies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/sign-in?error=no_user`);
  }

  // ✅ Ensure profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    const fullNameFromMeta =
      (user.user_metadata?.full_name as string | undefined) || null;

    await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        full_name: fullNameFromMeta,
        role: "doctor",
      },
      { onConflict: "user_id" }
    );
  }

  // ✅ role-based redirect
  const { data: profile2 } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile2?.role === "admin") {
    return NextResponse.redirect(`${origin}/admin`);
  }

  return NextResponse.redirect(`${origin}${nextParam}`);
}
