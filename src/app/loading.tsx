import { RowSkeleton } from "@/components/skeletons/Skeletons";

export default function HomeLoading() {
  return (
    <div className="w-full">
      <div className="loading-animation mx-auto my-16 h-24 w-2/3 max-w-xl rounded-lg" />
      <div className="w-full py-4">
        <div className="loading-animation mb-3 h-6 w-48 rounded" />
        <RowSkeleton />
      </div>
      <div className="w-full py-4">
        <div className="loading-animation mb-3 h-6 w-56 rounded" />
        <RowSkeleton />
      </div>
    </div>
  );
}
