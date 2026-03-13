import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const supabase = await createClient();

  // ✅ Static pages (ONLY public pages)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/lectures`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
  ];

  // ✅ Published lecture pages (if you later create /lectures/[id])
  const { data: lectures, error: lecturesError } = await supabase
    .from("lectures")
    .select("id, created_at")
    .eq("is_published", true);

  const lecturePages: MetadataRoute.Sitemap =
    !lecturesError && lectures
      ? lectures.map((lecture) => ({
          url: `${baseUrl}/lectures/${lecture.id}`,
          lastModified: new Date(lecture.created_at),
          changeFrequency: "weekly",
          priority: 0.7,
        }))
      : [];

  // ✅ Published announcement pages
  const { data: announcements, error: announcementsError } = await supabase
    .from("announcements")
    .select("id, created_at")
    .eq("is_published", true);

  const announcementPages: MetadataRoute.Sitemap =
    !announcementsError && announcements
      ? announcements.map((announcement) => ({
          url: `${baseUrl}/announcements/${announcement.id}`,
          lastModified: new Date(announcement.created_at),
          changeFrequency: "weekly",
          priority: 0.6,
        }))
      : [];

  return [...staticPages, ...lecturePages, ...announcementPages];
}
