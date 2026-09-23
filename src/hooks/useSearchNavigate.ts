"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Controlled search-input state plus the "submit -> /search/[query]"
 * navigation every search box in the app needs (`HeaderTop`, `MobileDrawer`,
 * `WelcomeSearch`). Trims whitespace and percent-encodes the query so
 * titles containing `/`, `?`, `&`, etc. don't produce a broken route —
 * previously only `WelcomeSearch` did this; the header and drawer searches
 * built the URL from the raw string.
 *
 * `onNavigate` is an optional side effect to run right before navigating
 * (e.g. closing the mobile drawer).
 */
export function useSearchNavigate(onNavigate?: () => void) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    onNavigate?.();
    router.push(`/search/${encodeURIComponent(trimmed)}`);
  }, [query, router, onNavigate]);

  return { query, setQuery, submit };
}
