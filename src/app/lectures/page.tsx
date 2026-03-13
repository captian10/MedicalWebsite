import { Suspense } from "react";
import { Metadata } from "next";
import { GraduationCap } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LectureCard } from "@/components/lecture-card";
import { LectureCardSkeleton } from "@/components/skeletons";

import { LecturesFilters } from "./filters";

export const metadata: Metadata = {
  title: "Lectures | Medical Education",
  description:
    "Access educational medical lectures, video tutorials, and downloadable resources for healthcare professionals.",
  openGraph: {
    title: "Medical Lectures | Mega Medical Academy",
    description:
      "Educational medical lectures and resources for healthcare professionals.",
  },
};

export const revalidate = 60;

interface LecturesPageProps {
  searchParams: Promise<{
    search?: string;
    sort?: string;
  }>;
}

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

function escapeIlike(v: string) {
  // escape % and _ for ILIKE patterns
  return v.replaceAll("%", "\\%").replaceAll("_", "\\_");
}

async function getLectures(search?: string, sort?: string): Promise<LectureRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("lectures")
    .select(
      "id,title,description,youtube_url,download_label,download_url,download_path,created_at"
    )
    .eq("is_published", true);

  const s = search?.trim();
  if (s) {
    const safe = escapeIlike(s);
    query = query.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`);
  }

  const ascending = sort === "oldest";
  query = query.order("created_at", { ascending });

  const { data, error } = await query;
  if (error || !data) return [];

  // ✅ Generate signed URLs for private bucket files (only if no external URL)
  const lectures: LectureRow[] = data as any;

  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.download_path && !lecture.download_url) {
        const { data: signedUrlData } = await supabase.storage
          .from("lecture-downloads")
          .createSignedUrl(lecture.download_path, 600); // 10 minutes

        lecture.signed_download_url = signedUrlData?.signedUrl ?? null;
      } else {
        lecture.signed_download_url = null;
      }
    })
  );

  return lectures;
}

function LecturesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <LectureCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function LecturesGrid({ search, sort }: { search?: string; sort?: string }) {
  const lectures = await getLectures(search, sort);

  if (lectures.length === 0) {
    return (
      <div className="text-center py-20">
        <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No lectures found</h3>
        <p className="text-muted-foreground">
          {search?.trim()
            ? "Try adjusting your search terms"
            : "Check back soon for new content"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lectures.map((lecture) => (
        <LectureCard key={lecture.id} lecture={lecture} />
      ))}
    </div>
  );
}

export default async function LecturesPage({ searchParams }: LecturesPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const sort = (params.sort === "oldest" ? "oldest" : "latest") as
    | "latest"
    | "oldest";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Medical Lectures",
    description: "Educational medical lectures for healthcare professionals",
    itemListElement: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="min-h-screen">
        {/* Header */}
        <section className="hero-gradient py-16">
          <div className="container mx-auto px-4 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Medical Lectures
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Explore our collection of educational lectures covering various
              medical topics and specialties.
            </p>
          </div>
        </section>

        {/* Filters ✅ fixed */}
        <LecturesFilters initialSearch={search} initialSort={sort} />

        {/* Lectures Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <Suspense fallback={<LecturesSkeleton />}>
              <LecturesGrid search={search} sort={sort} />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
