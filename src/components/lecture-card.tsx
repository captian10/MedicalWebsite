// src/components/lecture-card.tsx
"use client";

import { useMemo, useState } from "react";
import { Download, ExternalLink, Play } from "lucide-react";
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
    <div className="group relative h-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-medical-200 dark:hover:border-medical-800/60">
        {/* Video Section */}
        <div className="relative aspect-video bg-muted overflow-hidden">
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
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center transition-all duration-300 group-hover:from-black/70 group-hover:via-black/30">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:bg-white">
                  <Play className="h-6 w-6 text-medical-600 ml-0.5" fill="currentColor" />
                </div>
              </div>

              {/* Duration-style badge (visual polish) */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-0.5 rounded-md backdrop-blur-sm">
                Lecture
              </div>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-base font-bold leading-snug line-clamp-2 text-foreground group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors duration-200">
            {lecture.title}
          </h3>

          {lecture.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {lecture.description}
            </p>
          )}

          {/* Download button */}
          {hasDownload && downloadLink && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 border-medical-200 dark:border-medical-800/50 text-medical-700 dark:text-medical-300 hover:bg-medical-50 dark:hover:bg-medical-950/30 hover:border-medical-300 transition-all duration-200"
                asChild
              >
                <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  {lecture.download_label || "Download Resources"}
                  <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
