"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { posterUrl } from "@/lib/image";
import { useMyListToggle } from "@/hooks/useMyList";
import type { Credits, MediaDetails } from "@/types/tmdb";

export interface HeroProps {
  data: MediaDetails;
  credits: Credits;
  mediaType: "movie" | "tv";
}

const Hero = ({ data, credits, mediaType }: HeroProps) => {
  const {
    genres = [],
    title,
    overview,
    tagline,
    runtime,
    release_date,
    vote_average,
    backdrop_path,
    poster_path,
  } = data;

  const prefersReduced = useReducedMotion();
  // Deliberately a lean summary, not the full `data` object — `data` here
  // carries the whole details payload (cast, videos, similar,
  // recommendations…) which would otherwise get persisted into
  // localStorage every time someone bookmarks from this page.
  const [isSaved, toggleSaved] = useMyListToggle(
    {
      id: data.id,
      title: data.title,
      name: data.name,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      vote_average: data.vote_average,
      release_date: data.release_date,
      genre_ids: data.genres?.map((g) => g.id),
    },
    mediaType
  );

  const duration =
    runtime > 0
      ? `${Math.floor(runtime / 60)} hr : ${Math.floor(runtime % 60)} min`
      : "Runtime unavailable";

  const poster = posterUrl(poster_path ?? backdrop_path, "original");

  const director = credits.crew.filter((f) => f.job === "Director");
  const writer = credits.crew.filter(
    (f) =>
      f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
  );

  const displayTitle = title ?? data.name;

  return (
    <section
      aria-label="Featured title"
      className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 md:px-8 lg:flex-row lg:items-start lg:gap-10 lg:px-16 lg:py-12"
    >
      {/* ================= LEFT — CONTENT ================= */}
      <motion.div
        className="order-2 flex min-w-0 flex-1 flex-col items-start gap-2.5 lg:order-1 lg:gap-3"
        initial={prefersReduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {genres.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Genres">
            {genres.map((genre) => (
              <li
                key={genre.id}
                className="rounded-[3px] bg-brand-pink px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white sm:text-[0.7rem]"
              >
                {genre.name}
              </li>
            ))}
          </ul>
        )}

        <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
          {displayTitle}
        </h1>

        {tagline && (
          <p className="text-xs italic text-brand-gray-light sm:text-sm">
            {tagline}
          </p>
        )}

        <p className="max-w-2xl text-sm leading-relaxed text-brand-gray-light sm:text-base">
          {overview}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white sm:gap-x-6 sm:text-sm">
          <span className="flex items-center gap-1">
            <Image
              src="/images/stary.png"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
            />
            <span className="font-semibold text-brand-yellow">
              {vote_average.toFixed(1)}
            </span>
            <span className="text-brand-gray-light">/10</span>
          </span>

          <span className="flex items-center gap-1">
            <Image
              src="/images/clock1.png"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
            />
            {duration}
          </span>

          <span className="flex items-center gap-1">
            <Image
              src="/images/ticket1.png"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
            />
            {release_date || "Release date unavailable"}
          </span>
        </div>

        {(director.length > 0 || writer.length > 0) && (
          <div className="space-y-0.5 text-xs text-white sm:text-sm">
            {director.length > 0 && (
              <p>
                <span className="text-brand-gray-light">Director: </span>
                {director.map((dir, i) => (
                  <span key={dir.id}>
                    {dir.name}
                    {i < director.length - 1 && ", "}
                  </span>
                ))}
              </p>
            )}
            {writer.length > 0 && (
              <p>
                <span className="text-brand-gray-light">Writer: </span>
                {writer.map((w, i) => (
                  <span key={w.id}>
                    {w.name}
                    {i < writer.length - 1 && ", "}
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2.5 sm:gap-3">
          <motion.button
            type="button"
            aria-label={`Watch ${displayTitle}`}
            whileHover={prefersReduced ? undefined : { scale: 1.04 }}
            whileTap={prefersReduced ? undefined : { scale: 0.96 }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-red px-3.5 text-xs font-bold tracking-wide text-white shadow-[0_0_18px_#e50914bd] transition-colors hover:bg-brand-red-hover hover:shadow-[0_0_28px_#f40612af] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-10 sm:gap-2 sm:px-5 sm:text-sm"
          >
            <Image
              src="/images/play.png"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
            />
            WATCH
          </motion.button>

          <motion.button
            type="button"
            aria-label={isSaved ? `Remove ${displayTitle} from My List` : `Add ${displayTitle} to My List`}
            aria-pressed={isSaved}
            onClick={toggleSaved}
            whileHover={prefersReduced ? undefined : { scale: 1.04 }}
            whileTap={prefersReduced ? undefined : { scale: 0.96 }}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold tracking-wide text-white ring-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-10 sm:gap-2 sm:px-5 sm:text-sm ${
              isSaved
                ? "bg-brand-red ring-brand-red hover:bg-brand-red-hover"
                : "bg-black ring-white/15 hover:bg-[#111] hover:shadow-[0_0_10px_#999]"
            }`}
          >
            <Image
              src={isSaved ? "/images/heartr1.png" : "/images/heart0.png"}
              alt=""
              aria-hidden="true"
              width={16}
              height={14}
            />
            {isSaved ? "IN MY LIST" : "ADD LIST"}
          </motion.button>
        </div>
      </motion.div>

      {/* ================= RIGHT — POSTER ================= */}
      <motion.div
        className="order-1 flex w-full justify-center lg:order-2 lg:w-auto lg:flex-1 lg:items-start lg:justify-end"
        initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative aspect-[2/3] w-32 overflow-hidden rounded-lg shadow-2xl sm:w-36 md:w-44 lg:w-56 xl:w-64">
          <Image
            className="object-cover"
            src={poster}
            alt={`${displayTitle} poster`}
            fill
            priority
            sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, (max-width: 1024px) 176px, 256px"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;