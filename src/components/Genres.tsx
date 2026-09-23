"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import type { MediaType } from "@/types/tmdb";

export interface GenresProps {
  mediaType: Extract<MediaType, "movie" | "tv">;
  /** Currently-selected genre id, or `null` for "All". Controlled by the parent
   * (Movies/Series page) so the selection can drive the discover query. */
  selectedGenreId: number | null;
  onSelect: (genreId: number | null) => void;
}

/**
 * Horizontal, scrollable genre chip picker. Reads the live genre list for
 * the given media type from redux (seeded by `AppInit` from TMDB's
 * `/genre/movie/list` and `/genre/tv/list`) rather than a hardcoded array,
 * so movie and TV genre sets are correctly different.
 */
/** The "All" chip and every genre chip share this same selected/unselected
 * styling — pulled out once so the two `motion.li`s below can't drift. */
const chipClass = (selected: boolean): string =>
  `shrink-0 cursor-pointer rounded-full border px-4 py-1 text-sm transition-colors ${
    selected
      ? "border-brand-red bg-brand-red text-white"
      : "border-brand-gray-dark text-brand-gray-light hover:border-brand-red hover:text-white"
  }`;

const Genres = ({ mediaType, selectedGenreId, onSelect }: GenresProps) => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const genres = useAppSelector((state) =>
    mediaType === "tv" ? state.home.genresTv : state.home.genresMovie
  );

  const scrollBy = (amount: number): void => {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="flex w-full items-center gap-2 py-3">
      <button
        type="button"
        aria-label="Scroll genres left"
        onClick={() => scrollBy(-240)}
        className="hidden shrink-0 text-lg text-brand-gray-light transition-colors hover:text-white sm:block"
      >
        &#8249;
      </button>

      <ul
        ref={scrollerRef}
        className="no-scrollbar flex flex-1 gap-3 overflow-x-auto scroll-smooth"
      >
        <motion.li
          whileTap={{ scale: 0.92 }}
          onClick={() => onSelect(null)}
          className={chipClass(selectedGenreId === null)}
        >
          All
        </motion.li>
        {genres.map((genre) => (
          <motion.li
            key={genre.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(selectedGenreId === genre.id ? null : genre.id)}
            className={chipClass(selectedGenreId === genre.id)}
          >
            {genre.name}
          </motion.li>
        ))}
      </ul>

      <button
        type="button"
        aria-label="Scroll genres right"
        onClick={() => scrollBy(240)}
        className="hidden shrink-0 text-lg text-brand-gray-light transition-colors hover:text-white sm:block"
      >
        &#8250;
      </button>
    </div>
  );
};

export default Genres;
