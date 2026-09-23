/**
 * Core type definitions describing the shape of the (TMDB-flavoured) data
 * used throughout the app — both the bundled demo JSON in `src/data` and
 * anything fetched live via `src/lib/tmdbApi.ts`.
 *
 * These interfaces intentionally model only the fields the UI actually
 * reads. The bundled JSON fixtures carry many more fields than this (the
 * real TMDB API response shape), so fixture files are told to trust these
 * types via an `as` assertion rather than a `:` annotation — that keeps
 * TypeScript's excess-property checks from rejecting the extra fields
 * while still giving every consumer full type safety.
 */

export type MediaType = "movie" | "tv" | "person";

export interface Genre {
  id: number;
  name: string;
}

export interface ImageConfig {
  backdrop: string;
  poster: string;
  profile: string;
}

/** A single item as returned inside a paginated TMDB list response. */
export interface MediaSummary {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  vote_average?: number;
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  known_for?: MediaSummary[];
}

export interface PaginatedResponse<T = MediaSummary> {
  page?: number;
  results: T[];
  total_pages?: number;
  total_results?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department?: string;
  profile_path?: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface VideosResponse {
  results: Video[];
}

/** Full details payload for a single movie (or TV show), as consumed by
 * the Details page / Hero component. */
export interface MediaDetails {
  id: number;
  title?: string;
  name?: string;
  tagline?: string;
  overview: string;
  genres: Genre[];
  runtime: number;
  release_date: string;
  vote_average: number;
  backdrop_path: string | null;
  poster_path?: string | null;
  videos: VideosResponse;
  credits: Credits;
  similar: PaginatedResponse;
  recommendations: PaginatedResponse;
  [key: string]: unknown;
}

export interface SearchResultItem extends MediaSummary {
  media_type: MediaType;
}

export interface CertificationEntry {
  certification: string;
  meaning: string;
  order?: number;
}

export interface CertificationRegionMap {
  certifications: Record<string, CertificationEntry[]>;
}

export interface RegionOption {
  label: string;
  value: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name?: string;
}

/** `/configuration` response — used to build correctly-sized image URLs. */
export interface ConfigurationResponse {
  images: {
    secure_base_url: string;
    poster_sizes: string[];
    backdrop_sizes: string[];
    profile_sizes: string[];
  };
}

export interface GenreListResponse {
  genres: Genre[];
}

export type TrendingMediaType = "all" | "movie" | "tv";
export type TrendingWindow = "day" | "week";

/** Shared filter shape for `/discover/movie` and `/discover/tv`. */
export interface DiscoverParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  primary_release_year?: number;
  first_air_date_year?: number;
  "vote_average.gte"?: number;
  with_original_language?: string;
  region?: string;
  certification?: string;
  certification_country?: string;
  "certification.lte"?: string;
  [key: string]: string | number | undefined;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name?: string;
}
