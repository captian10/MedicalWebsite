import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Megaphone, GraduationCap, Sparkles } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { NewsletterSection } from "@/components/newsletter-section";
import { AnnouncementCard } from "@/components/announcement-card";
import { LectureCard } from "@/components/lecture-card";
import { Button } from "@/components/ui/button";
import {
  AnnouncementCardSkeleton,
  LectureCardSkeleton,
} from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Home | Mega Medical Academy - Anesthesiology Education & Resources",
  description:
    "Mega Medical Academy provides anesthesiology-focused medical education, lectures, announcements, and clinical resources for anesthesia professionals.",
};

export const revalidate = 60;

// ✅ Types (safe)
type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

type LectureRow = {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  download_label: string | null;
  download_url: string | null;
  download_path: string | null;
  created_at: string;

  signed_download_url?: string | null;
};

async function getAnnouncements(): Promise<AnnouncementRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, body, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data) return [];
  return data as AnnouncementRow[];
}

async function getLectures(): Promise<LectureRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lectures")
    .select(
      "id, title, description, youtube_url, download_label, download_url, download_path, created_at"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error || !data) return [];

  const lectures = data as LectureRow[];

  // ✅ Faster: create signed URLs in parallel
  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.download_path && !lecture.download_url) {
        try {
          const { data: signedUrlData } = await supabase.storage
            .from("lecture-downloads")
            .createSignedUrl(lecture.download_path, 600); // 10 minutes

          lecture.signed_download_url = signedUrlData?.signedUrl ?? null;
        } catch {
          lecture.signed_download_url = null;
        }
      } else {
        lecture.signed_download_url = null;
      }
    })
  );

  return lectures;
}

function AnnouncementsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <AnnouncementCardSkeleton key={i} />
      ))}
    </div>
  );
}

function LecturesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <LectureCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function AnnouncementsSection() {
  const announcements = await getAnnouncements();

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No anesthesiology updates yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}

async function LecturesSection() {
  const lectures = await getLectures();

  if (lectures.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          No anesthesiology lectures published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {lectures.map((lecture) => (
        <LectureCard key={lecture.id} lecture={lecture} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "Mega Medical Academy",
    description:
      "Anesthesiology-focused medical education, clinical lectures, and training resources",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    medicalSpecialty: "Anesthesiology",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-234-567-890",
      contactType: "customer service",
    },
    founder: {
      "@type": "Physician",
      name: "Dr. AbdelMonsef",
      jobTitle: "Anesthesiology Consultant",
      medicalSpecialty: "Anesthesiology",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Announcements Section */}
        <section className="py-20 bg-gradient-medical-subtle" id="announcements">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-medical-100 dark:bg-medical-900/40">
                    <Megaphone className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                  </div>
                  <span className="text-sm font-semibold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
                    Latest News
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Anesthesiology Updates
                </h2>
                <p className="text-muted-foreground">
                  Latest announcements and important anesthesia-related updates
                </p>
              </div>

              <Button variant="outline" asChild className="border-medical-200 dark:border-medical-800/50 hover:border-medical-300 hover:bg-medical-50 dark:hover:bg-medical-950/30">
                <Link href="/announcements">
                  View all updates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Suspense fallback={<AnnouncementsSkeleton />}>
              <AnnouncementsSection />
            </Suspense>
          </div>
        </section>


        {/* Lectures Section */}
        <section className="py-20 relative" id="lectures">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.medical.100/0.3)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,theme(colors.medical.900/0.15)_1px,transparent_0)] [background-size:32px_32px]" />

          <div className="relative container mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-medical-100 dark:bg-medical-900/40">
                    <Sparkles className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                  </div>
                  <span className="text-sm font-semibold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
                    Featured Content
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Featured Anesthesia Lectures
                </h2>
                <p className="text-muted-foreground">
                  Airway • Regional • ICU • Pain Management • Safety
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md transition-all"
                >
                  <a href="https://wa.me/447418343611" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Join as Lecturer
                  </a>
                </Button>

                <Button variant="medical" asChild>
                  <Link href="/lectures">
                    Browse lectures
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Suspense fallback={<LecturesSkeleton />}>
              <LecturesSection />
            </Suspense>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-medical text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />

          <div className="relative container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Elevate Your Anesthesia Practice
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join Mega Medical Academy to access anesthesia lectures, clinical
              pearls, downloadable resources, and the latest professional
              updates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-white text-medical-700 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300"
                asChild
              >
                <Link href="/auth/sign-up">Create Free Account</Link>
              </Button>

              {/* <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                asChild
              >
                <Link href="/lectures">Explore Anesthesia Content</Link>
              </Button> */}
            </div>
          </div>
        </section>
      </main>

      {/* Newsletter Section */}
      <NewsletterSection />

      <Footer />
    </>
  );
}
