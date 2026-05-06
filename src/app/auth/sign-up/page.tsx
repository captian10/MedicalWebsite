"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = useMemo(() => createClient(), []);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.fullName } },
      });
      if (error) {
        toast({ variant: "destructive", title: "Sign up failed", description: error.message });
        return;
      }
      const user = authData.user;
      const session = authData.session;
      if (user && session) {
        await supabase.from("profiles").upsert(
          { user_id: user.id, full_name: data.fullName, role: "doctor" },
          { onConflict: "user_id" }
        );
      }
      toast({
        variant: "success",
        title: "Account created!",
        description: "Please check your email to verify your account, then sign in.",
      });
      router.replace("/auth/sign-in");
    } catch {
      toast({ variant: "destructive", title: "Something went wrong", description: "Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-medical-400/20 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="relative h-12 w-12">
              <Image src="/images/logo.png" alt="Mega Medical Academy" fill className="object-contain brightness-0 invert" />
            </div>
            <span className="text-2xl font-bold">Mega Medical Academy</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Join Our Medical<br /><span className="text-white/90">Community.</span>
          </h1>
          <p className="text-lg text-white/70 max-w-md mb-8">
            Create your account to access anesthesiology lectures, clinical resources, and connect with fellow professionals.
          </p>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <ShieldCheck className="h-5 w-5 text-white/40" />
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-medical-subtle px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image src="/images/logo.png" alt="Mega Medical Academy" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold text-gradient">Mega Medical Academy</span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
            </Button>
          </div>

          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-2">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>Join our medical community today</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" type="text" placeholder="Dr. AbdelMonsef" {...register("fullName")} disabled={isLoading} className="h-11" />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="doctor@example.com" {...register("email")} disabled={isLoading} className="h-11" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} disabled={isLoading} className="h-11" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("confirmPassword")} disabled={isLoading} className="h-11" />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" variant="medical" className="w-full h-11" size="lg" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create account
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-medical-600 hover:underline">Terms</Link>{" "}and{" "}
                <Link href="/privacy" className="text-medical-600 hover:underline">Privacy Policy</Link>
              </p>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
