"use client";

import { memo, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { useMyListToggle } from "@/hooks/useMyList";
import { posterUrl, profileUrl } from "@/lib/image";
import type { CastMember, MediaSummary, MediaType } from "@/types/tmdb";

export interface CardProps {
  data: MediaSummary;
  mediaType: MediaType;
}

const CardComponent = ({ data, mediaType }: CardProps) => {
  const router = useRouter();
  const { genresMovie, genresTv } = useAppSelector((state) => state.home);
  const [isSaved, toggleSaved] = useMyListToggle(data, mediaType);

  const title = data.title ?? data.name ?? "Untitled";
  const rating = data.vote_average ?? 0;
  const hasRating = rating > 0;
  const posterImg = posterUrl(data.poster_path, "w342");
  const year = data.release_date ?? data.first_air_date ?? "";
  const yearLabel = year.length >= 4 ? year.slice(0, 4) : "Not-App";

  const genreList = mediaType === "tv" ? genresTv : genresMovie;
  const genreNames = (data.genre_ids ?? [])
    .map((id) => genreList.find((g) => g.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 3);

  const overview = data.overview?.trim();

  return (
    <motion.div
      className="group relative w-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="relative cursor-pointer"
        onClick={() => router.push(`/${mediaType}/${data.id}`)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") router.push(`/${mediaType}/${data.id}`);
        }}
      >
        <motion.div className="relative aspect-2/3 w-full overflow-hidden rounded-md bg-brand-select-bg shadow-md ring-1 ring-white/5 transition-shadow duration-300 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.55)]">
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            src={posterImg}
            alt={title}
            fill
            sizes="(max-width: 640px) 150px, 180px"
          />

          <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
            {mediaType}
          </span>

          {hasRating && (
            <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-brand-yellow backdrop-blur">
              <Image src="/images/stary.png" alt="" width={10} height={10} />
              {rating.toFixed(1)}
            </span>
          )}

          {/* Bookmark toggle — always visible, never hover-gated.
           * z-20 keeps it above the quick-view overlay's hit area, and the
           * ::after inset expands the touch target to ~44px without
           * changing how large the button looks. */}
          <motion.button
            type="button"
            aria-label={
              isSaved ? `Remove ${title} from My List` : `Add ${title} to My List`
            }
            aria-pressed={isSaved}
            whileTap={{ scale: 0.85 }}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              toggleSaved();
            }}
            className={`absolute bottom-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 shadow-lg backdrop-blur-sm transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-8 sm:w-8`}
          >
            <Image
              src={isSaved ? "/images/heartr1.png" : "/images/heart0.png"}
              alt=""
              width={14}
              height={12}
            />
          </motion.button>

          {/* Quick-view overlay — desktop hover only, pure CSS (no JS hover
           * state needed); touch users tap straight through to details. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden flex-col gap-1.5 bg-gradient-to-t from-black via-black/85 to-transparent p-2.5 pt-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
            {overview && (
              <p className="line-clamp-3 pr-10 text-[11px] leading-snug text-brand-gray-light">
                {overview}
              </p>
            )}
            {genreNames.length > 0 && (
              /* pr-11 keeps the chips clear of the always-visible heart
               * button (which sits ~44px from the right edge), so nothing
               * overlaps on hover. */
              <div className="flex max-w-full flex-wrap gap-1 pr-11">
                {genreNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-white/30 px-1.5 py-0.5 text-[9px] text-white"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
            <span className="text-[10px] font-semibold text-brand-red">
              View details &rarr;
            </span>
          </div>
        </motion.div>

        <div className="pt-2">
          <h3 className="truncate text-sm font-semibold text-white">{title}</h3>

          <span className="mt-1 flex items-center justify-between text-xs">
            <p className="text-brand-gray-light">{yearLabel}</p>

            {hasRating && (
              <span className="flex items-center gap-1 sm:hidden">
                <Image src="/images/stary.png" alt="" width={14} height={12} />
                <span className="text-brand-yellow">{rating.toFixed(1)}</span>
              </span>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Card = memo(CardComponent);
export default Card;

export interface CastCardProps {
  data: CastMember;
}

export const CastCard = ({ data }: CastCardProps) => {
  const { name, character, profile_path } = data;
  const [isHovered, setIsHovered] = useState(false);

  const baseImgUrl = profileUrl(profile_path, "w185");

  return (
    <motion.div
      className="w-full text-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="mx-auto h-[95px] w-[95px] overflow-hidden rounded-full bg-brand-select-bg ring-2 ring-transparent"
        animate={{
          scale: isHovered ? 1.08 : 1,
          boxShadow: isHovered
            ? "0 8px 20px rgba(0,0,0,0.5)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.2 }}
      >
        <Image
          className="h-full w-full object-cover"
          src={baseImgUrl}
          alt={name}
          width={95}
          height={95}
        />
      </motion.div>
      <h3 className="mt-2 truncate text-sm font-semibold text-white">{name}</h3>
      <h5 className="truncate text-xs text-brand-gray-light">{character}</h5>
    </motion.div>
  );
};

export interface PersonProfileCardProps {
  data: MediaSummary;
}

export const PersonProfileCard = ({ data }: PersonProfileCardProps) => {
  const baseImgUrl = profileUrl(data.profile_path, "w185");

  return (
    <div className="w-[110px] shrink-0 text-center">
      <div className="loading-animation mx-auto h-[95px] w-[95px] overflow-hidden rounded-full">
        <Image
          className="h-full w-full object-cover"
          src={baseImgUrl}
          alt="poster"
          width={95}
          height={95}
        />
      </div>
      <h3 className="mt-2 truncate text-sm font-semibold text-white">{data.name}</h3>
      <h5 className="text-xs text-brand-gray-light">{data.popularity?.toFixed(1)}</h5>
    </div>
  );
};