"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteLectureAction, toggleLecturePublishAction } from "./server-actions";

export function ToggleLecturePublishButton({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const onToggle = () => {
    startTransition(async () => {
      try {
        await toggleLecturePublishAction(id, !isPublished);

        toast({
          variant: "success",
          title: "Updated ✅",
          description: isPublished ? "Lecture moved to Draft." : "Lecture published.",
        });
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: err?.message ?? "Could not update publish state.",
        });
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      disabled={pending}
      aria-label={isPublished ? "Unpublish lecture" : "Publish lecture"}
      title={isPublished ? "Unpublish" : "Publish"}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPublished ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}

export function DeleteLectureButton({
  id,
  downloadPath,
}: {
  id: string;
  downloadPath?: string | null;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    const ok = window.confirm("Delete this lecture permanently?");
    if (!ok) return;

    startTransition(async () => {
      try {
        await deleteLectureAction(id, downloadPath);

        toast({
          variant: "success",
          title: "Deleted ✅",
          description: "Lecture removed successfully.",
        });
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: err?.message ?? "Could not delete lecture.",
        });
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      disabled={pending}
      aria-label="Delete lecture"
      title="Delete"
      className="text-destructive hover:text-destructive"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
