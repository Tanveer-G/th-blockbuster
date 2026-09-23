"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/types/tmdb";

export interface UseInfiniteListOptions<T> {
  /** Fetches a single page. Re-run from page 1 whenever `resetKey` changes. */
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>;
  /** Change this (e.g. a JSON-stringified filter object) to restart the
   * list from page 1 — used when genre/sort/year filters change. */
  resetKey?: string | number;
  /** De-dupe results by this field (defaults to `id`). Guards against TMDB
   * occasionally repeating an item across adjacent pages. */
  getId?: (item: T) => number | string;
  /** Skip fetching entirely (e.g. while a required filter hasn't loaded yet). */
  enabled?: boolean;
}

export interface UseInfiniteListResult<T> {
  items: T[];
  /** True only for the very first page of a (re)load — render skeleton cards. */
  isInitialLoading: boolean;
  /** True while an additional page is being appended. */
  isLoadingMore: boolean;
  error: unknown;
  hasMore: boolean;
  /** Attach to a sentinel element at the bottom of the grid. */
  sentinelRef: (node: HTMLDivElement | null) => void;
  /** Manual retry after an error. */
  retry: () => void;
}

/**
 * Optimistic, cancel-safe infinite scroll built on TanStack Query's
 * `useInfiniteQuery`: fetches page 1 on mount (or whenever `resetKey`
 * changes), then fetches subsequent pages automatically as a sentinel
 * element scrolls into view via IntersectionObserver. Request
 * caching/dedupe/cancellation is handled by the query client — this hook
 * just adapts that to the page-based TMDB response shape and the scroll
 * trigger.
 */
export function useInfiniteList<T>({
  fetchPage,
  resetKey,
  getId = (item) => (item as { id: number | string }).id,
  enabled = true,
}: UseInfiniteListOptions<T>): UseInfiniteListResult<T> {
  const fetchPageRef = useRef(fetchPage);
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  });

  const query = useInfiniteQuery({
    queryKey: ["infinite-list", resetKey],
    queryFn: ({ pageParam }) => fetchPageRef.current(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= (lastPage.total_pages ?? 1) ? nextPage : undefined;
    },
    enabled,
  });

  const items = useMemo(() => {
    const seen = new Set<number | string>();
    const out: T[] = [];
    for (const page of query.data?.pages ?? []) {
      for (const item of page.results ?? []) {
        const id = getId(item);
        if (seen.has(id)) continue;
        seen.add(id);
        out.push(item);
      }
    }
    return out;
  }, [query.data, getId]);

  // Latest fetch-more state, read from inside the IntersectionObserver
  // callback rather than closed over directly, so `sentinelRef` itself
  // never has to change identity (and therefore never re-observes).
  const liveRef = useRef({
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  });
  useEffect(() => {
    liveRef.current = {
      fetchNextPage: query.fetchNextPage,
      hasNextPage: query.hasNextPage,
      isFetchingNextPage: query.isFetchingNextPage,
    };
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        const { fetchNextPage, hasNextPage, isFetchingNextPage } = liveRef.current;
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "600px 0px" }
    );
    observerRef.current.observe(node);
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const retry = useCallback(() => {
    query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    items,
    isInitialLoading: enabled && query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.isError ? query.error : null,
    hasMore: Boolean(query.hasNextPage),
    sentinelRef,
    retry,
  };
}
