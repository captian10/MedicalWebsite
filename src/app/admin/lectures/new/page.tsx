"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Link as LinkIcon,
  FileText,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { extractYouTubeId } from "@/lib/utils";

const lectureSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  youtube_url: z
    .string()
    .url("Please enter a valid URL")
    .refine((url) => extractYouTubeId(url) !== null, "Please enter a valid YouTube URL"),
  download_label: z.string().optional(),
  download_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  is_published: z.boolean(),
});

type LectureFormData = z.infer<typeof lectureSchema>;

type UploadedFile = { name: string; path: string };

export default function NewLecturePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [useExternalLink, setUseExternalLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ stable supabase client
  const supabase = useMemo(() => createClient(), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<LectureFormData>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: "",
      description: "",
      youtube_url: "",
      download_label: "Download Resources",
      download_url: "",
      is_published: true,
    },
  });

  const isPublished = watch("is_published");
  const youtubeUrl = watch("youtube_url");
  const videoId = extractYouTubeId(youtubeUrl);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);

    try {
      const fileExt = file.name.split(".").pop() || "bin";
      const safeName = file.name.replace(/\s+/g, "-");
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("lecture-downloads")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      setUploadedFile({ name: file.name, path: data.path });

      toast({
        variant: "success",
        title: "File uploaded ✅",
        description: "Resource file uploaded successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err?.message ?? "Failed to upload file. Please try again.",
      });
    } finally {
      setUploadingFile(false);

      // ✅ allow re-uploading same file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeUploadedFile = async () => {
    if (!uploadedFile) return;

    try {
      await supabase.storage.from("lecture-downloads").remove([uploadedFile.path]);
      setUploadedFile(null);

      toast({
        variant: "success",
        title: "Removed ✅",
        description: "Uploaded file removed.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Remove failed",
        description: err?.message ?? "Failed to remove file.",
      });
    }
  };

  const onSubmit = async (data: LectureFormData) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        throw new Error("You must be signed in to create a lecture.");
      }

      const payload = {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        youtube_url: data.youtube_url.trim(),
        download_label: (data.download_label || "Download Resources").trim(),

        // ✅ pick only 1 source (external OR upload)
        download_url: useExternalLink ? (data.download_url?.trim() || null) : null,
        download_path: !useExternalLink ? uploadedFile?.path || null : null,

        is_published: data.is_published,
        created_by: user.id,
      };

      const { error } = await supabase.from("lectures").insert(payload);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Created ✅",
        description: "Lecture has been created successfully.",
      });

      router.push("/admin/lectures");
      router.refresh();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Create failed",
        description: err?.message ?? "Failed to create lecture. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openUploadPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild aria-label="Back">
          <Link href="/admin/lectures">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">New Lecture</h1>
          <p className="text-muted-foreground">
            Create a new educational lecture and optionally attach resources.
          </p>
        </div>

        {isDirty && (
          <span className="text-xs rounded-full border px-2 py-1 text-muted-foreground">
            Unsaved changes
          </span>
        )}
      </div>

      {/* Form */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-lg">Lecture Details</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter lecture title"
                {...register("title")}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the lecture..."
                {...register("description")}
                disabled={isLoading}
              />
            </div>

            {/* YouTube */}
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube URL *</Label>
              <Input
                id="youtube_url"
                placeholder="https://www.youtube.com/watch?v=..."
                {...register("youtube_url")}
                disabled={isLoading}
              />
              {errors.youtube_url && (
                <p className="text-sm text-destructive">{errors.youtube_url.message}</p>
              )}

              {videoId && (
                <div className="mt-2 rounded-lg overflow-hidden aspect-video max-w-md border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Resources */}
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <Label>Download Resources (Optional)</Label>
                  <p className="text-xs text-muted-foreground">
                    Choose an upload OR an external link.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setUseExternalLink(false)}
                    className={`px-3 py-1.5 rounded-md border transition-colors ${
                      !useExternalLink
                        ? "bg-medical-100 text-medical-700 dark:bg-medical-900/30 dark:text-medical-400"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Upload className="h-4 w-4 inline mr-1" />
                    Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseExternalLink(true)}
                    className={`px-3 py-1.5 rounded-md border transition-colors ${
                      useExternalLink
                        ? "bg-medical-100 text-medical-700 dark:bg-medical-900/30 dark:text-medical-400"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <LinkIcon className="h-4 w-4 inline mr-1" />
                    External
                  </button>
                </div>
              </div>

              {/* Label */}
              <div className="space-y-2">
                <Label htmlFor="download_label">Button Label</Label>
                <Input
                  id="download_label"
                  placeholder="Download Resources"
                  {...register("download_label")}
                  disabled={isLoading}
                />
              </div>

              {useExternalLink ? (
                <div className="space-y-2">
                  <Label htmlFor="download_url">External URL</Label>
                  <Input
                    id="download_url"
                    placeholder="https://drive.google.com/..."
                    {...register("download_url")}
                    disabled={isLoading}
                  />
                  {errors.download_url && (
                    <p className="text-sm text-destructive">{errors.download_url.message}</p>
                  )}

                  {watch("download_url")?.trim() ? (
                    <a
                      href={watch("download_url")!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-medical-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Test link
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                  />

                  {uploadedFile ? (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{uploadedFile.name}</span>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeUploadedFile}
                        className="h-8 w-8"
                        disabled={uploadingFile || isLoading}
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={openUploadPicker}
                      disabled={uploadingFile || isLoading}
                      className="w-full"
                    >
                      {uploadingFile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </>
                      )}
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Supported: PDF, DOC, DOCX, PPT, PPTX, ZIP, RAR
                  </p>
                </div>
              )}
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="is_published">Publish immediately</Label>
                <p className="text-sm text-muted-foreground">
                  Make this lecture visible to the public
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
                  "Create Lecture"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
