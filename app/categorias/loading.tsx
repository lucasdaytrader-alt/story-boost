import { Skeleton, HeaderSkeleton, CategoryCardSkeleton } from "@/components/ui/Skeleton";

export default function CategoriasLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
      <HeaderSkeleton />

      <div className="px-4 pb-2 pt-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-28 pt-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
