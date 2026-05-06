"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  GraduationCap,
  Settings,
  Menu,
  X,
  ChevronLeft,
  Home,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Lectures", href: "/admin/lectures", icon: GraduationCap },
];

const secondaryNav = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ✅ restore collapsed state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_sidebar_collapsed");
      if (saved === "1") setCollapsed(true);
    } catch { }
  }, []);

  // ✅ persist collapsed state
  useEffect(() => {
    try {
      localStorage.setItem("admin_sidebar_collapsed", collapsed ? "1" : "0");
    } catch { }
  }, [collapsed]);

  // ✅ Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // ✅ Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // ✅ Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const linkBase =
    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors";
  const activeClasses =
    "bg-medical-100 text-medical-700 dark:bg-medical-900/30 dark:text-medical-200";
  const inactiveClasses =
    "text-muted-foreground hover:bg-muted hover:text-foreground";

  const isMobileOpen = sidebarOpen;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ✅ Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ✅ Sidebar */}
      <aside
        role={isMobileOpen ? "dialog" : undefined}
        aria-modal={isMobileOpen ? true : undefined}
        aria-label="Admin sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2",
              collapsed && "justify-center w-full"
            )}
          >
            {/* ✅ Replaced Stethoscope and removed the red background box */}
            <div className="flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Mega Medical Academy Logo"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </div>
            {!collapsed && <span className="font-bold text-gradient text-lg">Admin</span>}
          </Link>

          {/* Collapse button (desktop only) */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-8 w-8"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  linkBase,
                  isActive ? activeClasses : inactiveClasses,
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.name : undefined}
              >
                {/* ✅ Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-medical-600" />
                )}
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Secondary */}
        <div className="p-3 space-y-1">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  linkBase,
                  isActive ? activeClasses : inactiveClasses,
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.name : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-medical-600" />
                )}
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}

          <Link
            href="/"
            className={cn(
              linkBase,
              inactiveClasses,
              "mt-2",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "Back to Site" : undefined}
          >
            <Home className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* ✅ Main */}
      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 lg:px-6">
          {/* Mobile open */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          {/* Mobile close (only when open) */}
          {isMobileOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
