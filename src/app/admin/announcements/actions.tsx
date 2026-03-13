"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

interface TogglePublishButtonProps {
  id: string;
  isPublished: boolean;
  type: "announcement" | "lecture";
}

export function TogglePublishButton({
  id,
  isPublished,
  type,
}: TogglePublishButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleToggle = async () => {
    setLoading(true);
    try {
      const table = type === "announcement" ? "announcements" : "lectures";
      const { error } = await supabase
        .from(table)
        .update({ is_published: !isPublished })
        .eq("id", id);

      if (error) throw error;

      toast({
        variant: "success",
        title: isPublished ? "Unpublished" : "Published",
        description: `${type === "announcement" ? "Announcement" : "Lecture"} has been ${
          isPublished ? "unpublished" : "published"
        }.`,
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      title={isPublished ? "Unpublish" : "Publish"}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPublished ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}

interface DeleteAnnouncementButtonProps {
  id: string;
}

export function DeleteAnnouncementButton({ id }: DeleteAnnouncementButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Deleted",
        description: "Announcement has been deleted.",
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Announcement</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this announcement? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteLectureButtonProps {
  id: string;
  downloadPath?: string | null;
}

export function DeleteLectureButton({ id, downloadPath }: DeleteLectureButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Delete file from storage if exists
      if (downloadPath) {
        await supabase.storage
          .from("lecture-downloads")
          .remove([downloadPath]);
      }

      const { error } = await supabase
        .from("lectures")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Deleted",
        description: "Lecture has been deleted.",
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Lecture</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this lecture? This will also delete
            any associated files. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
