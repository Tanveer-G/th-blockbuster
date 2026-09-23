/**
 * Single source of truth for building TMDB image URLs. Every component
 * that renders a poster/backdrop/profile picture should go through these
 * helpers instead of hand-rolling `https://image.tmdb.org/t/p/...` strings,
 * so the fallback image and size policy only need to live in one place.
 */

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const POSTER_SIZES = ["w92", "w154", "w185", "w342", "w500", "w780", "original"] as const;
export const BACKDROP_SIZES = ["w300", "w780", "w1280", "original"] as const;
export const PROFILE_SIZES = ["w45", "w185", "h632", "original"] as const;

export type PosterSize = (typeof POSTER_SIZES)[number];
export type BackdropSize = (typeof BACKDROP_SIZES)[number];
export type ProfileSize = (typeof PROFILE_SIZES)[number];

export const FALLBACK_POSTER = "/images/default/no-poster.png";
export const FALLBACK_BACKDROP = "/images/default/no-poster.png";
export const FALLBACK_AVATAR = "/images/default/avatar.png";
export const FALLBACK_NO_RESULTS = "/images/default/no-results.png";

const buildUrl = (
  path: string | null | undefined,
  size: string,
  fallback: string
): string => (path ? `${TMDB_IMAGE_BASE}/${size}${path}` : fallback);

/** Poster image URL (2:3 portrait) with a graceful local fallback. */
export const posterUrl = (
  path: string | null | undefined,
  size: PosterSize = "w500"
): string => buildUrl(path, size, FALLBACK_POSTER);

/** Backdrop image URL (16:9 landscape) with a graceful local fallback. */
export const backdropUrl = (
  path: string | null | undefined,
  size: BackdropSize = "w1280"
): string => buildUrl(path, size, FALLBACK_BACKDROP);

/** Cast/crew/person profile photo URL with a graceful local fallback. */
export const profileUrl = (
  path: string | null | undefined,
  size: ProfileSize = "w185"
): string => buildUrl(path, size, FALLBACK_AVATAR);

/**
 * Prefers a backdrop image (landscape) and falls back to the poster
 * (portrait) when no backdrop is available — used for hero/backgrounds
 * where any usable image beats none.
 */
export const heroImageUrl = (
  backdropPath: string | null | undefined,
  posterPath: string | null | undefined,
  size: BackdropSize = "original"
): string =>
  backdropPath
    ? `${TMDB_IMAGE_BASE}/${size}${backdropPath}`
    : posterUrl(posterPath, "original");
