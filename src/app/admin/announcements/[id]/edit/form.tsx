"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ArrowLeft, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
  is_published: z.boolean(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface Announcement {
  id: string;
  title: string;
  body: string;
  is_published: boolean;
}

interface EditAnnouncementFormProps {
  announcement: Announcement;
}

export function EditAnnouncementForm({ announcement }: EditAnnouncementFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  // ✅ stable client (no re-create every render)
  const supabase = useMemo(() => createClient(), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement.title ?? "",
      body: announcement.body ?? "",
      is_published: !!announcement.is_published,
    },
  });

  const isPublished = watch("is_published");

  const onSubmit = async (data: AnnouncementFormData) => {
    // ✅ prevent double submit
    if (isLoading) return;

    // ✅ no changes? don't update
    if (!isDirty) {
      toast({
        variant: "default",
        title: "No changes",
        description: "Nothing to update.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("announcements")
        .update({
          title: data.title.trim(),
          body: data.body.trim(),
          is_published: data.is_published,
        })
        .eq("id", announcement.id);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Saved ✅",
        description: "Announcement has been updated successfully.",
      });

      // ✅ reset dirty state after saving
      reset(data);

      router.push("/admin/announcements");
      router.refresh();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err?.message ?? "Failed to update announcement. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild aria-label="Back">
          <Link href="/admin/announcements">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Announcement</h1>
          <p className="text-muted-foreground">
            Update announcement details and publish status.
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-lg">Announcement Details</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                {...register("title")}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">Content *</Label>
              <Textarea
                id="body"
                placeholder="Write your announcement content..."
                className="min-h-[220px]"
                {...register("body")}
                disabled={isLoading}
              />
              {errors.body && (
                <p className="text-sm text-destructive">{errors.body.message}</p>
              )}
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="is_published">Published</Label>
                <p className="text-sm text-muted-foreground">
                  Make this announcement visible to the public.
                </p>
              </div>
              <Switch
                id="is_published"
                checked={isPublished}
                onCheckedChange={(checked) => setValue("is_published", checked, { shouldDirty: true })}
                disabled={isLoading}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="medical"
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
