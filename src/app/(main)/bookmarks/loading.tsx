import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksLoading() {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-[53px] items-center px-4">
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Post skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-b border-border px-4 py-3">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-8 pt-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
