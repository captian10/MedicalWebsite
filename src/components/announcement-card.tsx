import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncateText } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const safeBody = announcement.body?.trim() || "No details available yet.";
  const createdAt = new Date(announcement.created_at);

  return (
    <Card className="h-full group overflow-hidden card-hover">
      <CardHeader className="space-y-3">
        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time dateTime={createdAt.toISOString()}>
            {formatRelativeTime(announcement.created_at)}
          </time>
        </div>

        {/* Title */}
        <CardTitle className="leading-snug line-clamp-2 transition-colors group-hover:text-medical-600">
          {announcement.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Body */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {truncateText(safeBody, 160)}
        </p>

        {/* CTA */}
        <div className="pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="px-0 text-medical-600 hover:text-medical-700 hover:bg-transparent"
            asChild
          >
            <Link href={`/announcements/${announcement.id}`}>
              Read more
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
