"use client";

import { useAppSelector } from "@/redux/hooks";
import Background from "./Background";

/**
 * Mounted once in the root layout. Renders the shared page background,
 * always sourced from `state.home.backgroundImage` — the home page resets
 * it to the default site image, and a movie/show's details page swaps it
 * for that title's backdrop via `<BackgroundSync />`.
 */
const GlobalBackground = () => {
  const backgroundImage = useAppSelector((state) => state.home.backgroundImage);

  return <Background bG={backgroundImage} />;
};

export default GlobalBackground;
