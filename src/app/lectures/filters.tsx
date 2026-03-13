"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SortValue = "latest" | "oldest";

export function LecturesFilters({
  initialSearch,
  initialSort,
}: {
  initialSearch: string;
  initialSort: SortValue;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortValue>(initialSort);

  // keep state synced if user navigates back/forward
  useEffect(() => {
    setSearch(initialSearch);
    setSort(initialSort);
  }, [initialSearch, initialSort]);

  const hasFilters = useMemo(() => {
    return Boolean(search.trim()) || sort !== "latest";
  }, [search, sort]);

  const pushUrl = (nextSearch: string, nextSort: SortValue) => {
    const params = new URLSearchParams(sp.toString());

    const s = nextSearch.trim();
    if (s) params.set("search", s);
    else params.delete("search");

    if (nextSort && nextSort !== "latest") params.set("sort", nextSort);
    else params.delete("sort");

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  // ✅ Submit on Enter
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushUrl(search, sort);
  };

  const clearAll = () => {
    setSearch("");
    setSort("latest");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <section className="border-b bg-background sticky top-16 z-40">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row gap-3 sm:items-center"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lectures..."
              className="pl-10"
              disabled={pending}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <select
              value={sort}
              onChange={(e) => {
                const v = (e.target.value as SortValue) || "latest";
                setSort(v);
                // ✅ apply immediately
                pushUrl(search, v);
              }}
              disabled={pending}
              className="h-10 w-44 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-medical-500"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button type="submit" variant="medical" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying
                </>
              ) : (
                "Search"
              )}
            </Button>

            {hasFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={clearAll}
                disabled={pending}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
