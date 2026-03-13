"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleLecturePublishAction(id: string, nextValue: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lectures")
    .update({ is_published: nextValue })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/lectures");
  revalidatePath("/lectures");
}

export async function deleteLectureAction(id: string, downloadPath?: string | null) {
  const supabase = await createClient();

  // ✅ remove storage file if exists
  if (downloadPath) {
    const { error: storageErr } = await supabase.storage
      .from("lecture-downloads")
      .remove([downloadPath]);

    // مش هنوقف الحذف لو الملف مش موجود
    if (storageErr) {
      console.warn("Storage remove warning:", storageErr.message);
    }
  }

  const { error } = await supabase.from("lectures").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/lectures");
  revalidatePath("/lectures");
}
