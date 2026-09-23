"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setBackgroundImage,
  DEFAULT_BACKGROUND_IMAGE,
} from "@/redux/features/homeSlice";

export interface BackgroundSyncProps {
  /** Image to use for the shared page background while this page is
   * mounted. Falls back to the default site background when omitted. */
  image?: string | null;
}

/**
 * Renders nothing — it just keeps the shared background (see
 * `GlobalBackground`) in sync with whichever page is currently mounted.
 * Pages import this once and pass the image they want behind their
 * content; unmounting doesn't need to reset it, since the next page to
 * mount will sync its own value straight away.
 */
const BackgroundSync = ({ image }: BackgroundSyncProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBackgroundImage(image ?? DEFAULT_BACKGROUND_IMAGE));
  }, [dispatch, image]);

  return null;
};

export default BackgroundSync;
