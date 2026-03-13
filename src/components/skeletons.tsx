import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AnnouncementCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden card-hover">
      <CardHeader className="space-y-3">
        {/* Date row */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Body */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Button */}
        <Skeleton className="h-9 w-32" />
      </CardContent>
    </Card>
  );
}

export function LectureCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden card-hover">
      {/* Thumbnail */}
      <Skeleton className="aspect-video w-full" />

      <CardHeader className="space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-2/3" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Download button skeleton */}
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative bg-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10 items-center">
          {/* Left */}
          <div className="space-y-8">
            <Skeleton className="h-8 w-52 rounded-full" />

            <div className="space-y-3">
              <Skeleton className="h-12 w-5/6" />
              <Skeleton className="h-12 w-2/3" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-full max-w-xl" />
              <Skeleton className="h-5 w-5/6 max-w-xl" />
              <Skeleton className="h-5 w-2/3 max-w-xl" />
            </div>

            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-12 w-40 rounded-xl" />
              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center lg:justify-end">
            <Skeleton className="h-[420px] w-[320px] rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ✅ Optional: use this inside tables or list pages
 * - More consistent than the old one
 */
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Skeleton className="h-12 w-16 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}
