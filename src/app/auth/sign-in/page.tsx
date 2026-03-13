"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

// ✅ Prevent open-redirect
function safeRedirectPath(input: string | null) {
  if (!input) return "/";
  // allow only internal paths like "/lectures"
  if (!input.startsWith("/")) return "/";
  if (input.startsWith("//")) return "/";
  return input;
}

// 1. قمنا بتغيير اسم الدالة الأساسية لتصبح مكون داخلي
function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const supabase = useMemo(() => createClient(), []);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = safeRedirectPath(searchParams.get("redirect"));
  const callbackError = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
        return;
      }

      const user = authData.user;
      if (!user) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: "No user returned. Please try again.",
        });
        return;
      }

      // ✅ Ensure profile exists (upsert safe)
      const fullNameFromMeta =
        (user.user_metadata?.full_name as string | undefined) || null;

      // Try fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) {
        // Create profile if missing (RLS must allow insert own profile)
        await supabase.from("profiles").upsert(
          {
            user_id: user.id,
            full_name: fullNameFromMeta,
            role: "doctor",
          },
          { onConflict: "user_id" }
        );
      }

      const { data: profile2 } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      toast({
        variant: "success",
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // ✅ Redirect based on role
      if (profile2?.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace(redirectTo);
      }
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-medical-subtle px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-medical text-white">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gradient">Mega Medical Academy</span>
          </Link>
        </div>

        {callbackError && (
          <div className="rounded-xl border bg-background p-4 text-sm text-destructive">
            Authentication callback failed. Please sign in again.
          </div>
        )}

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm text-medical-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="medical"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to Mega Medical Academy?
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/sign-up">Create an account</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// 2. هذه هي الصفحة الأساسية التي يتم تصديرها الآن وتحتوي على الـ Suspense
export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-medical-subtle">
        <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}