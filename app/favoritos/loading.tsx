import { Skeleton, HeaderSkeleton, ElementCardSkeleton } from "@/components/ui/Skeleton";

export default function FavoritosLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
      <HeaderSkeleton />

      <div className="px-4 pb-2 pt-3">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="mt-2 h-4 w-40" />
      </div>

      <section className="grid grid-cols-2 gap-3 px-4 pb-28 pt-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ElementCardSkeleton key={i} />
        ))}
      </section>
    </div>
  );
}
