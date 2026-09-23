"use client";

import { useEffect, useState } from "react";

/**
 * Tailwind's default breakpoints — kept in one place so every hook/component
 * that needs to reason about screen size agrees on the same numbers.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * SSR-safe `matchMedia` hook. Returns `false` on the server and on the very
 * first client render (before hydration can know the real viewport), then
 * updates synchronously once mounted and on every subsequent resize.
 *
 * Unlike Tailwind's `hidden md:block` pattern — which renders *both*
 * variants into the DOM and just toggles their visibility with CSS — this
 * hook lets a component decide not to render a subtree at all on a given
 * screen size, so the unused markup never reaches the DOM in the first
 * place (fewer nodes, no hidden-but-interactive elements, cheaper paints).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export interface BreakpointState {
  /** True below the `sm` breakpoint (< 640px). */
  isMobile: boolean;
  /** True between `sm` and `lg` (640–1023px). */
  isTablet: boolean;
  /** True at `lg` and above (>= 1024px). */
  isDesktop: boolean;
  /** The largest Tailwind breakpoint currently matched, or "base" below `sm`. */
  breakpoint: BreakpointKey | "base";
  /** Raw viewport width in px (0 until mounted on the client). */
  width: number;
}

/**
 * Single source of truth for "what size screen is this" — used to mount or
 * unmount whole subtrees (desktop nav vs. mobile hamburger, bottom nav bar,
 * carousel slide counts, etc.) instead of hiding them with CSS.
 */
export function useBreakpoint(): BreakpointState {
  const [width, setWidth] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const updateWidth = (): void => setWidth(window.innerWidth);
    updateWidth();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (!mounted) {
    // Sensible desktop-first default avoids a flash of mobile UI while the
    // real width is being measured; the effect above corrects it instantly.
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: "xl",
      width: 0,
    };
  }

  let breakpoint: BreakpointKey | "base" = "base";
  if (width >= BREAKPOINTS["2xl"]) breakpoint = "2xl";
  else if (width >= BREAKPOINTS.xl) breakpoint = "xl";
  else if (width >= BREAKPOINTS.lg) breakpoint = "lg";
  else if (width >= BREAKPOINTS.md) breakpoint = "md";
  else if (width >= BREAKPOINTS.sm) breakpoint = "sm";

  return {
    isMobile: width < BREAKPOINTS.sm,
    isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    breakpoint,
    width,
  };
}
