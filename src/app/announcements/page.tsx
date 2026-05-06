import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnnouncementCard } from "@/components/announcement-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Latest announcements and updates from Mega Medical Academy — anesthesiology news, new lectures, and clinical updates.",
};

export const revalidate = 60;

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

async function getAnnouncements(): Promise<AnnouncementRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, body, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as AnnouncementRow[];
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <>
      <Navbar />

      <main className="min-h-[60vh]">
        {/* Header */}
        <div className="bg-gradient-medical text-white">
          <div className="container mx-auto px-4 lg:px-8 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Megaphone className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-white/70">
                All Updates
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Anesthesiology Announcements
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Stay informed with the latest announcements, new lecture releases,
              and important updates from Mega Medical Academy.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 py-12">
          {announcements.length === 0 ? (
            <div className="text-center py-16">
              <Megaphone className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No announcements yet</h2>
              <p className="text-muted-foreground mb-6">
                Check back soon for updates from the academy.
              </p>
              <Button variant="outline" asChild>
                <Link href="/">
                  Back to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
