import { HeroSkeleton, PersonRowSkeleton, RowSkeleton } from "@/components/skeletons/Skeletons";

export default function DetailsLoading() {
  return (
    <div className="w-full">
      <HeroSkeleton />
      <div className="w-full py-4 sm:py-6">
        <div className="loading-animation mb-3 h-6 w-40 rounded" />
        <PersonRowSkeleton />
      </div>
      <div className="w-full py-4 sm:py-6">
        <div className="loading-animation mb-3 h-6 w-40 rounded" />
        <RowSkeleton count={4} />
      </div>
    </div>
  );
}
