import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Bell } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formatDate, formatRelativeTime } from "@/lib/utils";

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  is_published: boolean;
  created_at: string;
};

// ✅ Next.js 15: params is a Promise — must be awaited
type PageProps = {
  params: Promise<{ id: string }>;
};

async function getAnnouncement(id: string): Promise<AnnouncementRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, body, is_published, created_at")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as AnnouncementRow;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const announcement = await getAnnouncement(resolvedParams.id);

  if (!announcement) {
    return { title: "Announcement Not Found" };
  }

  return {
    title: announcement.title,
    description: announcement.body.slice(0, 160),
  };
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const announcement = await getAnnouncement(resolvedParams.id);

  if (!announcement) {
    notFound();
  }

  const createdAt = new Date(announcement.created_at);
  const isRecent = Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <>
      <Navbar />

      <main className="min-h-[60vh]">
        {/* Hero banner */}
        <div className="bg-gradient-medical text-white">
          <div className="container mx-auto px-4 lg:px-8 py-12">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 mb-6"
              asChild
            >
              <Link href="/#announcements">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Announcements
              </Link>
            </Button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Bell className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-3">
                {isRecent && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    New Update
                  </span>
                )}

                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {announcement.title}
                </h1>

                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={createdAt.toISOString()}>
                    {formatDate(announcement.created_at)} ({formatRelativeTime(announcement.created_at)})
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="max-w-3xl">
            <div className="relative rounded-2xl border bg-card p-8 shadow-md">
              {/* Red accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-medical-500 via-medical-600 to-medical-700 rounded-l-2xl" />

              <div className="pl-5 prose prose-lg dark:prose-invert max-w-none">
                {announcement.body.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Back button */}
            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link href="/#announcements">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Updates
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
