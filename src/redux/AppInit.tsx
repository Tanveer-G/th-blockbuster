"use client";

import { useEffect } from "react";
import { getApiConfiguration, getGenresMovie, getGenresTv } from "./features/homeSlice";
import { useAppDispatch } from "./hooks";
import { getConfiguration, getMovieGenres, getTvGenres } from "@/lib/tmdbService";
import type { Genre, ImageConfig } from "@/types/tmdb";

// Used only if the live `/configuration` or `/genre/*` calls fail (e.g. no
// TMDB token configured yet) so the UI still has genre names/filters to
// show instead of rendering blank chips everywhere.
const FALLBACK_IMG_CONFIG: ImageConfig = {
  backdrop: "https://image.tmdb.org/t/p/original",
  poster: "https://image.tmdb.org/t/p/original",
  profile: "https://image.tmdb.org/t/p/original",
};

const FALLBACK_MOVIE_GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const FALLBACK_TV_GENRES: Genre[] = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

/**
 * Seeds the redux store with the live image-url configuration and genre
 * lists from TMDB on mount. Every page (Genres chips, Card badges, Filter
 * dropdowns) reads from `state.home` rather than fetching genres itself.
 */
export default function AppInit(): null {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    getConfiguration()
      .then((config) => {
        if (cancelled) return;
        dispatch(
          getApiConfiguration({
            backdrop: config.images.secure_base_url,
            poster: config.images.secure_base_url,
            profile: config.images.secure_base_url,
          })
        );
      })
      .catch(() => {
        if (!cancelled) dispatch(getApiConfiguration(FALLBACK_IMG_CONFIG));
      });

    getMovieGenres()
      .then((res) => {
        if (!cancelled) dispatch(getGenresMovie(res.genres));
      })
      .catch(() => {
        if (!cancelled) dispatch(getGenresMovie(FALLBACK_MOVIE_GENRES));
      });

    getTvGenres()
      .then((res) => {
        if (!cancelled) dispatch(getGenresTv(res.genres));
      })
      .catch(() => {
        if (!cancelled) dispatch(getGenresTv(FALLBACK_TV_GENRES));
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return null;
}
