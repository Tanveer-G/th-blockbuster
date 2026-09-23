/**
 * Every TMDB REST path the app calls, in one place. Grouped by resource so
 * a service function never has to hand-build a URL string itself.
 */
export const endpoints = {
  configuration: "/configuration",

  genre: {
    movieList: "/genre/movie/list",
    tvList: "/genre/tv/list",
  },

  trending: {
    /** mediaType: "all" | "movie" | "tv" | "person", window: "day" | "week" */
    all: (mediaType: string, window: string): string =>
      `/trending/${mediaType}/${window}`,
  },

  movie: {
    details: (movieId: number | string): string => `/movie/${movieId}`,
    images: (movieId: number | string): string => `/movie/${movieId}/images`,
    credits: (movieId: number | string): string => `/movie/${movieId}/credits`,
    videos: (movieId: number | string): string => `/movie/${movieId}/videos`,
    similar: (movieId: number | string): string => `/movie/${movieId}/similar`,
    recommendations: (movieId: number | string): string =>
      `/movie/${movieId}/recommendations`,
    discover: "/discover/movie",
    latest: "/movie/latest",
    popular: "/movie/popular",
    topRated: "/movie/top_rated",
    upcoming: "/movie/upcoming",
    nowPlaying: "/movie/now_playing",
  },

  tv: {
    details: (tvId: number | string): string => `/tv/${tvId}`,
    images: (tvId: number | string): string => `/tv/${tvId}/images`,
    credits: (tvId: number | string): string => `/tv/${tvId}/aggregate_credits`,
    videos: (tvId: number | string): string => `/tv/${tvId}/videos`,
    similar: (tvId: number | string): string => `/tv/${tvId}/similar`,
    recommendations: (tvId: number | string): string =>
      `/tv/${tvId}/recommendations`,
    discover: "/discover/tv",
    latest: "/tv/latest",
    popular: "/tv/popular",
    topRated: "/tv/top_rated",
    airingToday: "/tv/airing_today",
    onTheAir: "/tv/on_the_air",
  },

  person: {
    details: (personId: number | string): string => `/person/${personId}`,
  },

  search: {
    multi: "/search/multi",
    movie: "/search/movie",
    tv: "/search/tv",
  },
} as const;
