import axios, { type AxiosRequestConfig } from "axios";
import { TMDB_BASE_URL, TMDB_TOKEN } from "./tmdbConfig";

const isServer = typeof window === "undefined";

export type ApiParams = AxiosRequestConfig["params"];

/**
 * Isomorphic, thin wrapper around the TMDB REST API.
 *
 * - On the server (Server Components, Route Handlers, generateMetadata…)
 *   this calls TMDB directly with a bearer token that lives only in the
 *   Node process.
 * - In the browser it calls our own same-origin `/api/tmdb` proxy instead
 *   (see `src/app/api/tmdb/route.ts`), which holds that same token
 *   server-side. Client code therefore never needs, and never ships, the
 *   TMDB credential.
 *
 * Callers (see `src/lib/tmdbService.ts`) don't need to know or care which
 * path is taken — they just get back parsed JSON or a thrown error.
 */
export const fetchDataFromApi = async <T = unknown>(
  path: string,
  params?: ApiParams
): Promise<T> => {
  try {
    if (isServer) {
      const { data } = await axios.get<T>(TMDB_BASE_URL + path, {
        headers: { Authorization: `Bearer ${TMDB_TOKEN ?? ""}` },
        params,
      });
      return data;
    }

    const { data } = await axios.get<T>("/api/tmdb", {
      params: { ...params, path },
    });
    return data;
  } catch (err) {
    console.error(`[tmdb] request failed for "${path}":`, err);
    throw err;
  }
};

export { isTmdbConfigured } from "./tmdbConfig";
