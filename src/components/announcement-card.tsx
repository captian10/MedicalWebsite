import Link from "next/link";
import { Calendar, ArrowRight, Bell } from "lucide-react";
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

  // Check if the announcement is recent (within 7 days)
  const isRecent =
    Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="group relative h-full">
      {/* Card with red accent border */}
      <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-medical-200 dark:hover:border-medical-800/60">
        {/* Red accent left border */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-medical-500 via-medical-600 to-medical-700 rounded-l-2xl" />

        {/* Subtle red glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-medical-50/0 to-medical-50/0 group-hover:from-medical-50/50 group-hover:to-transparent dark:group-hover:from-medical-950/20 dark:group-hover:to-transparent transition-all duration-500" />

        <div className="relative p-6 pl-7 space-y-4">
          {/* Top row: Badge + Date */}
          <div className="flex items-center justify-between gap-3">
            {/* New Update Badge */}
            {isRecent && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-medical-50 dark:bg-medical-950/40 border border-medical-200 dark:border-medical-800/50 px-3 py-1 text-xs font-semibold text-medical-700 dark:text-medical-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-600" />
                </span>
                New Update
              </span>
            )}

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={createdAt.toISOString()}>
                {formatRelativeTime(announcement.created_at)}
              </time>
            </div>
          </div>

          {/* Alert Icon + Title */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-medical-100 dark:bg-medical-900/40 text-medical-600 dark:text-medical-400">
                <Bell className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <h3 className="text-lg font-bold leading-snug line-clamp-2 text-foreground group-hover:text-medical-700 dark:group-hover:text-medical-400 transition-colors duration-200">
                <span className="text-medical-600 dark:text-medical-400 font-extrabold">
                  Important Update:
                </span>{" "}
                {announcement.title}
              </h3>
              <p className="text-sm text-muted-foreground/80 italic">
                Mark your calendars and don&apos;t miss this comprehensive deep
                dive.
              </p>
            </div>
          </div>

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 pl-12">
            {truncateText(safeBody, 180)}
          </p>

          {/* Divider + CTA */}
          <div className="pt-2 pl-12">
            <div className="h-px w-full bg-gradient-to-r from-medical-200 via-border to-transparent dark:from-medical-800/40 dark:via-border mb-4" />
            <Button
              variant="ghost"
              size="sm"
              className="px-0 text-medical-600 hover:text-medical-700 dark:text-medical-400 dark:hover:text-medical-300 hover:bg-transparent font-semibold group/btn"
              asChild
            >
              <Link href={`/announcements/${announcement.id}`}>
                Read More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
