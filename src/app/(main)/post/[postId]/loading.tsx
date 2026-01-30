import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetailLoading() {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-[53px] items-center gap-4 px-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>

      {/* Main post skeleton */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-24 mt-2" />
            <div className="flex gap-8 pt-3 border-t border-border mt-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Compose reply skeleton */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <Skeleton className="h-16 flex-1" />
        </div>
      </div>

      {/* Reply skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-b border-border px-4 py-3">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
