import { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { EditLectureForm } from "./form";

export const metadata: Metadata = {
  title: "Edit Lecture",
  description: "Edit an existing lecture",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLecturePage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lecture, error } = await supabase
    .from("lectures")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lecture) {
    notFound();
  }

  return <EditLectureForm lecture={lecture} />;
}
