// src/components/lecture-card.tsx
"use client";

import { useMemo, useState } from "react";
import { Download, ExternalLink, Play } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { extractYouTubeId } from "@/lib/utils";

interface Lecture {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  download_label: string | null;
  download_url: string | null;
  download_path: string | null;
  signed_download_url?: string | null;
  created_at: string;
}

interface LectureCardProps {
  lecture: Lecture;
}

export function LectureCard({ lecture }: LectureCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = useMemo(
    () => extractYouTubeId(lecture.youtube_url),
    [lecture.youtube_url]
  );

  const [thumbSrc, setThumbSrc] = useState(
    videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ""
  );

  const hasDownload = Boolean(lecture.download_url || lecture.signed_download_url);
  const downloadLink = lecture.download_url || lecture.signed_download_url;

  return (
    <Card className="h-full overflow-hidden card-hover group">
      {/* Video Section */}
      <div className="relative aspect-video bg-muted">
        {isPlaying && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={lecture.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2"
            aria-label={`Play ${lecture.title}`}
          >
            {videoId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbSrc}
                alt={lecture.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() =>
                  setThumbSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No preview
              </div>
            )}

            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform group-hover:scale-110">
                <Play className="h-7 w-7 text-medical-600 ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Content */}
      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-medical-600 transition-colors">
          {lecture.title}
        </CardTitle>
        {lecture.description && (
          <CardDescription className="line-clamp-2">
            {lecture.description}
          </CardDescription>
        )}
      </CardHeader>

      {hasDownload && downloadLink && (
        <CardContent>
          <Button variant="outline" size="sm" className="w-full gap-2" asChild>
            <a href={downloadLink} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              {lecture.download_label || "Download Resources"}
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
