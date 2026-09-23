"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { hydrateMyList, MY_LIST_STORAGE_KEY, type MyListItem } from "./features/myListSlice";

/**
 * Bridges the `myList` redux slice to `localStorage` so saved titles
 * survive a page reload:
 *  - On mount, reads whatever was saved last time and hydrates the store.
 *  - After that, writes the store back to `localStorage` every time it
 *    changes (add/remove/toggle from any Card or the Hero's list button).
 *
 * Deliberately plain `localStorage` rather than a persistence library —
 * one small object, written on change, is all this needs.
 */
export default function MyListSync(): null {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.myList.items);
  const hydrated = useAppSelector((state) => state.myList.hydrated);
  const isFirstWrite = useRef(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MY_LIST_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Record<string, MyListItem>) : {};
      dispatch(hydrateMyList(parsed));
    } catch {
      dispatch(hydrateMyList({}));
    }
  }, [dispatch]);

  useEffect(() => {
    // Skip the write that would otherwise fire immediately after the
    // hydrate effect above sets `items` for the first time — there's
    // nothing new to persist yet.
    if (!hydrated) return;
    if (isFirstWrite.current) {
      isFirstWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(MY_LIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be full or unavailable (private browsing, quota) —
      // the list still works for the session, it just won't persist.
    }
  }, [items, hydrated]);

  return null;
}
