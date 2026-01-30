import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-[53px] items-center px-4">
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      {/* Compose skeleton */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-16 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex h-[53px] border-b border-border">
        <Skeleton className="h-full flex-1" />
        <Skeleton className="h-full flex-1" />
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
                <Skeleton className="h-4 w-8" />
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
