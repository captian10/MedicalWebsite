"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ArrowLeft, Loader2, Plus } from "lucide-react";

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

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ stable client
  const supabase = useMemo(() => createClient(), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      body: "",
      is_published: true,
    },
  });

  const isPublished = watch("is_published");

  const onSubmit = async (data: AnnouncementFormData) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be signed in to create announcements.");

      const payload = {
        title: data.title.trim(),
        body: data.body.trim(),
        is_published: data.is_published,
        created_by: user.id,
      };

      const { error } = await supabase.from("announcements").insert(payload);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Created ✅",
        description: data.is_published
          ? "Announcement published successfully."
          : "Announcement saved as draft.",
      });

      // ✅ optional reset (useful if you ever keep them on page)
      reset({
        title: "",
        body: "",
        is_published: true,
      });

      router.push("/admin/announcements");
      router.refresh();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Create failed",
        description:
          err?.message ?? "Failed to create announcement. Please try again.",
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
          <h1 className="text-3xl font-bold tracking-tight">New Announcement</h1>
          <p className="text-muted-foreground">
            Create a new update and publish it to the public.
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
                <Label htmlFor="is_published">Publish immediately</Label>
                <p className="text-sm text-muted-foreground">
                  Make this announcement visible to the public.
                </p>
              </div>

              <Switch
                id="is_published"
                checked={isPublished}
                onCheckedChange={(checked) =>
                  setValue("is_published", checked, { shouldDirty: true })
                }
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

              <Button type="submit" variant="medical" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Announcement
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
