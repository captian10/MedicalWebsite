"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, User, LogOut, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Lectures", href: "/lectures" },
];

interface UserProfile {
  role: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Supabase client (your client.ts already uses singleton internally ✅)
  const supabase = useMemo(() => createClient(), []);

  // ✅ Prevent hydration mismatch with next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // ✅ Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Fetch user + profile
  useEffect(() => {
    let isActive = true;

    const loadUser = async () => {
      try {
        setIsLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isActive) return;

        setUser(user ?? null);

        if (!user) {
          setProfile(null);
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("role, full_name, avatar_url")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!isActive) return;

        setProfile(profileData ?? null);
      } catch (err) {
        console.error("Navbar loadUser error:", err);
        if (!isActive) return;
        setUser(null);
        setProfile(null);
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("user_id", nextUser.id)
        .maybeSingle();

      setProfile(profileData ?? null);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const isAdmin = profile?.role === "admin";

  const userInitials =
    profile?.full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut(); // ✅ simple + stable
    } catch (err) {
      console.error("signOut error:", err);
    } finally {
      // ✅ force refresh so server components revalidate
      window.location.href = "/";
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-b shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10">
            <Image
              src="/images/logo.png"
              alt="Mega Medical Academy"
              fill
              priority
              className="object-contain"
            />
          </div>

          <span className="text-xl font-bold text-gradient">
            Mega Medical Academy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-medical-600",
                pathname === item.href ? "text-medical-600" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">


          {/* User Menu / Auth Buttons */}
          {!isLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={profile?.avatar_url || ""}
                      alt={profile?.full_name || "User"}
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {profile?.full_name && (
                      <p className="font-medium">{profile.full_name}</p>
                    )}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    {profile?.role && (
                      <p className="text-xs text-medical-600 capitalize">
                        {profile.role}
                      </p>
                    )}
                  </div>
                </div>

                <DropdownMenuSeparator />

                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isLoading ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
              <Button variant="medical" asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          ) : null}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block text-base font-medium py-2 transition-colors",
                  pathname === item.href
                    ? "text-medical-600"
                    : "text-muted-foreground hover:text-medical-600"
                )}
              >
                {item.name}
              </Link>
            ))}

            {isAdmin && (
              <Link href="/admin" className="block text-base font-medium py-2 text-medical-600">
                Admin Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex flex-col gap-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button variant="destructive" onClick={handleSignOut} className="w-full">
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/sign-in">Sign in</Link>
                </Button>
                <Button variant="medical" asChild className="w-full">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
