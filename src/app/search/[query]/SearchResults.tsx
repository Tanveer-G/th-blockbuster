"use client";

import { useMemo } from "react";
import Card, { PersonProfileCard } from "@/components/Card";
import Section from "@/components/Section";
import StatusMessage from "@/components/StatusMessage";
import { CardGridSkeleton } from "@/components/skeletons/Skeletons";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import { searchMulti } from "@/lib/tmdbService";
import type { SearchResultItem } from "@/types/tmdb";

export interface SearchResultsProps {
  query: string;
}

const GRID_CLASSES =
  "grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8";

/**
 * Search is dominated by what people actually came here for — movies and
 * TV shows — so those get the primary, full-width card grid. People show
 * up in a compact row underneath: still discoverable, but not competing
 * for the same visual weight as the titles themselves.
 */
export default function SearchResults({ query }: SearchResultsProps) {
  const { items, isInitialLoading, isLoadingMore, error, hasMore, sentinelRef, retry } =
    useInfiniteList<SearchResultItem>({
      resetKey: query,
      enabled: query.trim().length > 0,
      fetchPage: (page) => searchMulti(query, page),
    });

  const { mediaResults, personResults } = useMemo(() => {
    return {
      mediaResults: items.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      ),
      personResults: items.filter((item) => item.media_type === "person"),
    };
  }, [items]);

  if (isInitialLoading) {
    return (
      <div className="w-full py-6">
        <div className="loading-animation mb-4 h-7 w-72 rounded" />
        <CardGridSkeleton />
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <StatusMessage
        title="Search failed"
        description="Something went wrong reaching TMDB. Please try again."
        onRetry={retry}
      />
    );
  }

  return (
    <div className="w-full py-6">
      <h2 className="pb-1 text-xl font-semibold text-white sm:text-2xl">
        Search results for &ldquo;{query}&rdquo;
      </h2>
      <p className="pb-4 text-sm text-brand-gray-light">
        {items.length} {items.length === 1 ? "result" : "results"}
        {hasMore ? "+" : ""} found
      </p>

      {items.length === 0 ? (
        <StatusMessage title="No results found" description="Try a different search term." />
      ) : (
        <>
          {mediaResults.length > 0 && (
            <div className={GRID_CLASSES}>
              {mediaResults.map((item) => (
                <Card key={`${item.media_type}-${item.id}`} data={item} mediaType={item.media_type} />
              ))}
            </div>
          )}

          {isLoadingMore && (
            <div className="pt-4">
              <CardGridSkeleton count={6} />
            </div>
          )}

          {hasMore && <div ref={sentinelRef} className="h-1 w-full" aria-hidden />}

          {personResults.length > 0 && (
            <Section title="People">
              <div className="no-scrollbar flex w-full gap-4 overflow-x-auto pb-2">
                {personResults.map((person) => (
                  <PersonProfileCard key={person.id} data={person} />
                ))}
              </div>
            </Section>
          )}

          {mediaResults.length === 0 && personResults.length > 0 && (
            <StatusMessage
              title="No movies or shows matched"
              description="We found some people, but no matching titles — try a more specific search."
            />
          )}
        </>
      )}
    </div>
  );
}
