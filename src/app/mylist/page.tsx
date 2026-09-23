"use client";

import Link from "next/link";
import Card from "@/components/Card";
import StatusMessage from "@/components/StatusMessage";
import { CardGridSkeleton } from "@/components/skeletons/Skeletons";
import BackgroundSync from "@/components/layout/common/BackgroundSync";
import { useAppDispatch } from "@/redux/hooks";
import { clearMyList } from "@/redux/features/myListSlice";
import { useMyListHydrated, useMyListItems } from "@/hooks/useMyList";

const GRID_CLASSES =
  "grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8";

export default function MyListPage() {
  const dispatch = useAppDispatch();
  const hydrated = useMyListHydrated();
  const items = useMyListItems();

  const handleClearAll = (): void => {
    if (items.length === 0) return;
    if (window.confirm("Remove all titles from My List? This can't be undone.")) {
      dispatch(clearMyList());
    }
  };

  return (
    <div className="w-full pb-10">
      <BackgroundSync />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">My List</h1>
          {hydrated && items.length > 0 && (
            <p className="mt-1 text-sm text-brand-gray-light">
              {items.length} saved {items.length === 1 ? "title" : "titles"}
            </p>
          )}
        </div>

        {hydrated && items.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-brand-gray-light transition-colors hover:border-brand-red hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="pt-4 sm:pt-6">
        {!hydrated ? (
          <CardGridSkeleton />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <StatusMessage
              title="Your list is empty"
              description="Tap the heart icon on any movie or show to save it here — it'll stay saved even after you reload."
            />
            <div className="flex gap-3">
              <Link
                href="/movies"
                className="rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-red-hover"
              >
                Browse Movies
              </Link>
              <Link
                href="/series"
                className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition-colors hover:border-white/40"
              >
                Browse Series
              </Link>
            </div>
          </div>
        ) : (
          <div className={GRID_CLASSES}>
            {items.map((item) => (
              <Card key={`${item.mediaType}-${item.id}`} data={item} mediaType={item.mediaType} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
