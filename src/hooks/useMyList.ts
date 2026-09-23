"use client";

import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { myListKey, toggleMyList, type MyListItem } from "@/redux/features/myListSlice";
import type { MediaSummary, MediaType } from "@/types/tmdb";

/** Whether `id`+`mediaType` is currently saved to My List. */
export function useIsInMyList(mediaType: MediaType, id: number): boolean {
  const key = myListKey(mediaType, id);
  return useAppSelector((state) => Boolean(state.myList.items[key]));
}

/** All saved items, newest first — used by the My List page. */
export function useMyListItems(): MyListItem[] {
  const items = useAppSelector((state) => state.myList.items);
  const hydrated = useAppSelector((state) => state.myList.hydrated);
  return useMemo(
    () => (hydrated ? Object.values(items).sort((a, b) => b.addedAt - a.addedAt) : []),
    [items, hydrated]
  );
}

export function useMyListHydrated(): boolean {
  return useAppSelector((state) => state.myList.hydrated);
}

/**
 * Returns `[isSaved, toggle]` for a single movie/tv item — the piece every
 * bookmark/heart button (Card, Hero) actually needs. `toggle` both adds and
 * removes: tapping a filled heart removes that title from My List.
 */
export function useMyListToggle(
  data: MediaSummary,
  mediaType: MediaType
): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const isSaved = useIsInMyList(mediaType, data.id);

  const toggle = useCallback(() => {
    if (mediaType !== "movie" && mediaType !== "tv") return;
    const item: MyListItem = {
      ...data,
      mediaType,
      addedAt: Date.now(),
    };
    dispatch(toggleMyList(item));
  }, [dispatch, data, mediaType]);

  return [isSaved, toggle];
}
