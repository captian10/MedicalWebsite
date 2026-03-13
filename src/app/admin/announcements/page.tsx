import { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { DeleteAnnouncementButton, TogglePublishButton } from "./actions";

export const metadata: Metadata = {
  title: "Manage Announcements",
  description: "Create, edit, and manage announcements",
};

async function getAnnouncements() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">
            Manage your announcements and updates
          </p>
        </div>
        <Button variant="medical" asChild>
          <Link href="/admin/announcements/new">
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Link>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No announcements yet. Create your first one!
              </p>
              <Button variant="outline" asChild>
                <Link href="/admin/announcements/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Announcement
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div className="font-medium line-clamp-1">
                        {announcement.title}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {announcement.body.slice(0, 100)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          announcement.is_published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {announcement.is_published ? (
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
                    <TableCell className="text-muted-foreground">
                      {formatDate(announcement.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TogglePublishButton
                          id={announcement.id}
                          isPublished={announcement.is_published}
                          type="announcement"
                        />
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/announcements/${announcement.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteAnnouncementButton id={announcement.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
