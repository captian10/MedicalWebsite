import { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Video } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, extractYouTubeId } from "@/lib/utils";
import { TogglePublishButton, DeleteLectureButton } from "../announcements/actions";

export const metadata: Metadata = {
  title: "Manage Lectures",
  description: "Create, edit, and manage lectures",
};

async function getLectures() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lectures")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function LecturesPage() {
  const lectures = await getLectures();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lectures</h1>
          <p className="text-muted-foreground">
            Manage your educational lectures
          </p>
        </div>
        <Button variant="medical" asChild>
          <Link href="/admin/lectures/new">
            <Plus className="mr-2 h-4 w-4" />
            New Lecture
          </Link>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {lectures.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No lectures yet. Create your first one!
              </p>
              <Button variant="outline" asChild>
                <Link href="/admin/lectures/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Lecture
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-[35%]">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lectures.map((lecture) => {
                  const videoId = extractYouTubeId(lecture.youtube_url);
                  const thumbnail = videoId
                    ? `https://img.youtube.com/vi/${videoId}/default.jpg`
                    : null;

                  return (
                    <TableRow key={lecture.id}>
                      <TableCell>
                        {thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumbnail}
                            alt=""
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                            <Video className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium line-clamp-1">
                          {lecture.title}
                        </div>
                        {lecture.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {lecture.description.slice(0, 80)}...
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            lecture.is_published
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {lecture.is_published ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Draft
                            </>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        {lecture.download_url || lecture.download_path ? (
                          <span className="text-xs px-2 py-1 rounded bg-medical-100 text-medical-700 dark:bg-medical-900/30 dark:text-medical-400">
                            Has resources
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(lecture.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TogglePublishButton
                            id={lecture.id}
                            isPublished={lecture.is_published}
                            type="lecture"
                          />
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/lectures/${lecture.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteLectureButton
                            id={lecture.id}
                            downloadPath={lecture.download_path}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
