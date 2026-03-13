import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind className helper
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract YouTube video ID from any common YouTube URL formats.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - VIDEO_ID (raw)
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const trimmed = url.trim();

  // Raw ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);

    // youtu.be/VIDEO_ID
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    // youtube.com/watch?v=VIDEO_ID
    if (parsed.searchParams.has("v")) {
      const id = parsed.searchParams.get("v");
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    // youtube.com/embed/VIDEO_ID | /shorts/VIDEO_ID | /live/VIDEO_ID | /v/VIDEO_ID
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const possible = pathParts.find((p) => /^[a-zA-Z0-9_-]{11}$/.test(p));
    return possible ?? null;
  } catch {
    // Fallback regex if URL() fails
    const match = trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1] ?? null;
  }
}

/**
 * Format date as "January 1, 2026"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Relative time like "2 hours ago"
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);

  const diffMs = then.getTime() - now.getTime(); // negative = past
  const diffSeconds = Math.round(diffMs / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const abs = Math.abs(diffSeconds);

  if (abs < 60) return rtf.format(Math.round(diffSeconds), "second");

  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day");

  // fallback to absolute date for older content
  return formatDate(date);
}

/**
 * Safely truncate long text
 */
export function truncateText(text: string, maxLength: number): string {
  const v = (text ?? "").toString();
  if (v.length <= maxLength) return v;
  return v.slice(0, maxLength).trimEnd() + "...";
}
