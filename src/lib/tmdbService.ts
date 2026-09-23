import { fetchDataFromApi } from "./tmdbApi";
import { endpoints } from "./endPoints";
import type {
  ConfigurationResponse,
  Credits,
  DiscoverParams,
  GenreListResponse,
  MediaDetails,
  MediaType,
  PaginatedResponse,
  SearchResultItem,
  TrendingMediaType,
  TrendingWindow,
  VideosResponse,
} from "@/types/tmdb";

const DETAILS_APPEND = "videos,credits,similar,recommendations";

/** Normalizes a raw movie/tv `/details` payload (append_to_response'd with
 * videos, credits, similar & recommendations) into the shape the UI reads,
 * so components never have to branch on movie-vs-tv field names. */
function normalizeDetails(mediaType: MediaType, raw: Record<string, unknown>): MediaDetails {
  const runtimeFromEpisodes = Array.isArray(raw.episode_run_time)
    ? (raw.episode_run_time as number[])[0]
    : undefined;

  return {
    ...raw,
    id: raw.id as number,
    title: (raw.title as string | undefined) ?? (raw.name as string | undefined),
    name: raw.name as string | undefined,
    tagline: raw.tagline as string | undefined,
    overview: (raw.overview as string | undefined) ?? "",
    genres: (raw.genres as MediaDetails["genres"] | undefined) ?? [],
    runtime: (raw.runtime as number | undefined) ?? runtimeFromEpisodes ?? 0,
    release_date:
      (raw.release_date as string | undefined) ??
      (raw.first_air_date as string | undefined) ??
      "",
    vote_average: (raw.vote_average as number | undefined) ?? 0,
    backdrop_path: (raw.backdrop_path as string | null | undefined) ?? null,
    poster_path: (raw.poster_path as string | null | undefined) ?? null,
    videos: (raw.videos as VideosResponse | undefined) ?? { results: [] },
    credits: (raw.credits as Credits | undefined) ?? { cast: [], crew: [] },
    similar: (raw.similar as PaginatedResponse | undefined) ?? { results: [] },
    recommendations:
      (raw.recommendations as PaginatedResponse | undefined) ?? { results: [] },
    media_type: mediaType,
  } as MediaDetails;
}

// ---------------------------------------------------------------------------
// Configuration & genres
// ---------------------------------------------------------------------------

export const getConfiguration = (): Promise<ConfigurationResponse> =>
  fetchDataFromApi<ConfigurationResponse>(endpoints.configuration);

export const getMovieGenres = (): Promise<GenreListResponse> =>
  fetchDataFromApi<GenreListResponse>(endpoints.genre.movieList);

export const getTvGenres = (): Promise<GenreListResponse> =>
  fetchDataFromApi<GenreListResponse>(endpoints.genre.tvList);

// ---------------------------------------------------------------------------
// Trending / curated lists
// ---------------------------------------------------------------------------

export const getTrending = (
  mediaType: TrendingMediaType = "all",
  window: TrendingWindow = "day",
  page = 1
): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.trending.all(mediaType, window), {
    page,
  });

export const getPopularMovies = (page = 1): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.movie.popular, { page });

export const getTopRatedMovies = (page = 1): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.movie.topRated, { page });

export const getUpcomingMovies = (page = 1): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.movie.upcoming, { page });

export const getNowPlayingMovies = (page = 1): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.movie.nowPlaying, { page });

export const getPopularTv = (page = 1): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.tv.popular, { page });

export const getTopRatedTv = (page = 1): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.tv.topRated, { page });

export const getAiringTodayTv = (page = 1): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.tv.airingToday, { page });

export const getOnTheAirTv = (page = 1): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.tv.onTheAir, { page });

// ---------------------------------------------------------------------------
// Discover (genre/sort/year/certification-filtered browsing — Movies & Series pages)
// ---------------------------------------------------------------------------

export const discoverMovies = (params: DiscoverParams = {}): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.movie.discover, {
    sort_by: "popularity.desc",
    include_adult: false,
    ...params,
  });

export const discoverTv = (params: DiscoverParams = {}): Promise<PaginatedResponse> =>
  fetchDataFromApi<PaginatedResponse>(endpoints.tv.discover, {
    sort_by: "popularity.desc",
    include_adult: false,
    ...params,
  });

// ---------------------------------------------------------------------------
// Details (movie & tv)
// ---------------------------------------------------------------------------

export const getMovieDetails = async (id: number | string): Promise<MediaDetails> => {
  const raw = await fetchDataFromApi<Record<string, unknown>>(
    endpoints.movie.details(id),
    { append_to_response: DETAILS_APPEND }
  );
  return normalizeDetails("movie", raw);
};

export const getTvDetails = async (id: number | string): Promise<MediaDetails> => {
  const raw = await fetchDataFromApi<Record<string, unknown>>(endpoints.tv.details(id), {
    append_to_response: DETAILS_APPEND,
  });
  return normalizeDetails("tv", raw);
};

export const getMediaDetails = (
  mediaType: MediaType,
  id: number | string
): Promise<MediaDetails> =>
  mediaType === "tv" ? getTvDetails(id) : getMovieDetails(id);

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Small shared helpers
// ---------------------------------------------------------------------------

/**
 * `/discover/movie` and `/discover/tv` accept mostly the same `sort_by`
 * values, but a couple of field names differ (movies use
 * `primary_release_date` / `original_title`, TV uses `first_air_date` /
 * `name`). The Filter UI is shared between both pages, so this translates
 * a movie-flavoured value to its TV equivalent when needed.
 */
export function normalizeSortBy(sortBy: string, mediaType: MediaType): string {
  if (mediaType !== "tv") return sortBy;
  return sortBy
    .replace("primary_release_date", "first_air_date")
    .replace("original_title", "name");
}

export const searchMulti = (
  query: string,
  page = 1
): Promise<PaginatedResponse<SearchResultItem>> =>
  fetchDataFromApi<PaginatedResponse<SearchResultItem>>(endpoints.search.multi, {
    query,
    page,
    include_adult: false,
  });
