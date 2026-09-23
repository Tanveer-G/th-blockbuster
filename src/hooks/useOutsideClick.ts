"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Calls `onOutsideClick` whenever a pointer event lands outside the
 * returned element ref — the standard "close this dropdown/menu/popover"
 * pattern, implemented once so every dropdown in the app behaves the same
 * way instead of each component hand-rolling its own listener.
 *
 * "Stable" here means:
 * - The DOM listener is only ever attached/re-attached when `enabled`
 *   changes, never on every render (the callback itself is read from a
 *   ref, so passing a fresh inline arrow function each render is fine and
 *   won't cause the listener to be torn down and re-added).
 * - Pass `enabled={false}` while the element is already closed so no
 *   listener is registered at all until there's actually something to
 *   dismiss — e.g. `useOutsideClick(close, isOpen)`.
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  onOutsideClick: () => void,
  enabled = true
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onOutsideClick);

  useEffect(() => {
    callbackRef.current = onOutsideClick;
  });

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent): void => {
      const node = ref.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) {
        callbackRef.current();
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") callbackRef.current();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  return ref;
}
