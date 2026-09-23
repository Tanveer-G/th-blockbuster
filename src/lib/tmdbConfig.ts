/**
 * TMDB connection constants shared by every server-side caller: the
 * isomorphic client (`tmdbApi.ts`) and the same-origin proxy route
 * (`app/api/tmdb/route.ts`). Kept in one place so the base URL and the
 * env-var fallback chain can't drift out of sync between the two.
 */
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Server-only credential — deliberately NOT prefixed with NEXT_PUBLIC_ so it
// never gets inlined into the client JS bundle. `NEXT_PUBLIC_TMDB_TOKEN` is
// accepted as a fallback purely so the app still runs if that's the only
// variable someone has set, but `TMDB_TOKEN` is what should be configured.
export const TMDB_TOKEN = process.env.TMDB_TOKEN ?? process.env.NEXT_PUBLIC_TMDB_TOKEN;

/** True once a server-side TMDB token has actually been configured. */
export const isTmdbConfigured = (): boolean => Boolean(TMDB_TOKEN);
