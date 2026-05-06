"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AnnouncementError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-medical-100 dark:bg-medical-900/40 mx-auto">
            <AlertTriangle className="h-8 w-8 text-medical-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Failed to Load Announcement</h1>
            <p className="text-muted-foreground">
              We couldn&apos;t load this announcement. Please check your connection
              and try again.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground/60 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="medical" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/#announcements">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Announcements
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
