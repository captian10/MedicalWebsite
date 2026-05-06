import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh]">
        {/* Hero skeleton */}
        <div className="bg-gradient-medical text-white">
          <div className="container mx-auto px-4 lg:px-8 py-12">
            <Skeleton className="h-8 w-48 bg-white/15 mb-6 rounded-lg" />
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-xl bg-white/15 shrink-0" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-5 w-24 bg-white/15 rounded-full" />
                <Skeleton className="h-10 w-3/4 bg-white/15 rounded-lg" />
                <Skeleton className="h-4 w-48 bg-white/15 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="max-w-3xl">
            <div className="rounded-2xl border bg-card p-8 shadow-md space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
