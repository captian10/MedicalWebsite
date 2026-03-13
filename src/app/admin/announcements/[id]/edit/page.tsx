import { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { EditAnnouncementForm } from "./form";

export const metadata: Metadata = {
  title: "Edit Announcement",
  description: "Edit an existing announcement",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: EditPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: announcement, error } = await supabase
    .from("announcements")
    .select("id, title, body, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error || !announcement) {
    notFound();
  }

  return <EditAnnouncementForm announcement={announcement} />;
}
