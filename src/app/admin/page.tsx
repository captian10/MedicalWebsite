import Link from "next/link";
import { Metadata } from "next";
import {
  Megaphone,
  GraduationCap,
  Users,
  ArrowRight,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your medical website content",
};

export const revalidate = 30;

async function getStats() {
  const supabase = await createClient();

  const [
    totalAnnouncements,
    publishedAnnouncements,
    totalLectures,
    publishedLectures,
    totalUsers,
  ] = await Promise.all([
    supabase.from("announcements").select("id", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),

    supabase.from("lectures").select("id", { count: "exact", head: true }),
    supabase
      .from("lectures")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),

    supabase.from("profiles").select("user_id", { count: "exact", head: true }),
  ]);

  return {
    totalAnnouncements: totalAnnouncements.count ?? 0,
    publishedAnnouncements: publishedAnnouncements.count ?? 0,
    totalLectures: totalLectures.count ?? 0,
    publishedLectures: publishedLectures.count ?? 0,
    totalUsers: totalUsers.count ?? 0,
  };
}

async function getRecentActivity() {
  const supabase = await createClient();

  const [announcements, lectures] = await Promise.all([
    supabase
      .from("announcements")
      .select("id, title, created_at, is_published")
      .order("created_at", { ascending: false })
      .limit(4),

    supabase
      .from("lectures")
      .select("id, title, created_at, is_published")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  return {
    recentAnnouncements: announcements.data ?? [],
    recentLectures: lectures.data ?? [],
  };
}

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const activity = await getRecentActivity();

  const cards = [
    {
      title: "Announcements",
      value: stats.totalAnnouncements,
      published: stats.publishedAnnouncements,
      icon: Megaphone,
      href: "/admin/announcements",
      badge: "Content",
    },
    {
      title: "Lectures",
      value: stats.totalLectures,
      published: stats.publishedLectures,
      icon: GraduationCap,
      href: "/admin/lectures",
      badge: "Education",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      published: stats.totalUsers,
      icon: Users,
      href: "#",
      badge: "Accounts",
      disabled: true, // ✅ avoid broken route if /admin/users not made yet
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back 👋 Manage your content, publishing, and activity from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const p = percent(c.published, c.value);

          const CardWrapper = ({ children }: { children: React.ReactNode }) =>
            c.disabled ? (
              <div className="opacity-60 cursor-not-allowed">{children}</div>
            ) : (
              <Link href={c.href}>{children}</Link>
            );

          return (
            <CardWrapper key={c.title}>
              <Card className="card-hover h-full overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {c.title}
                    </CardTitle>
                    <span className="inline-flex w-fit items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {c.badge}
                    </span>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-medical text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{c.value}</div>
                    {!c.disabled && (
                      <span className="text-xs text-muted-foreground">
                        {c.published} published
                      </span>
                    )}
                  </div>

                  {/* Progress */}
                  {!c.disabled && (
                    <div className="space-y-1.5">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-gradient-medical"
                          style={{ width: `${p}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{p}% published</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardWrapper>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Announcements */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Latest updates and news</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/announcements">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {activity.recentAnnouncements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No announcements yet
                </p>
              ) : (
                activity.recentAnnouncements.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(a.created_at)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        a.is_published
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {a.is_published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Lectures */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Lectures</CardTitle>
              <CardDescription>Latest educational content</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/lectures">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {activity.recentLectures.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No lectures yet
                </p>
              ) : (
                activity.recentLectures.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(l.created_at)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        l.is_published
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {l.is_published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Quick Create</CardTitle>
            <CardDescription>Create content faster</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="medical" asChild className="justify-between">
              <Link href="/admin/announcements/new">
                <span className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Announcement
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" asChild className="justify-between">
              <Link href="/admin/lectures/new">
                <span className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Lecture
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Content Shortcuts</CardTitle>
            <CardDescription>Jump quickly to management pages</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="ghost" asChild className="justify-between border">
              <Link href="/admin/announcements">
                <span className="flex items-center">
                  <Megaphone className="mr-2 h-4 w-4 text-medical-600" />
                  Manage Announcements
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="ghost" asChild className="justify-between border">
              <Link href="/admin/lectures">
                <span className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4 text-medical-600" />
                  Manage Lectures
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
