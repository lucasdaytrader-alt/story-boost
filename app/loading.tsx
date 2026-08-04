import { Skeleton, HeaderSkeleton, PackCardSkeleton, CategoryCardSkeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-ink sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
      <HeaderSkeleton variant="dark" />

      <div className="px-4 pt-6">
        <Skeleton className="h-9 w-3/4 bg-white/10" />
        <Skeleton className="mt-2 h-9 w-1/2 bg-white/10" />
        <Skeleton className="mt-4 h-4 w-full bg-white/10" />
        <Skeleton className="mt-1.5 h-4 w-2/3 bg-white/10" />
        <Skeleton className="mt-5 h-12 w-40 rounded-xl bg-white/10" />
        <Skeleton className="mt-4 h-14 w-full rounded-2xl bg-white/10" />
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full bg-white/10" />
        ))}
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <PackCardSkeleton key={i} variant="carousel" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3.5 px-4 pt-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-32 pt-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <PackCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
