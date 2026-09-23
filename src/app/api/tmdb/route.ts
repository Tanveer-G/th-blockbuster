import { NextResponse, type NextRequest } from "next/server";
import axios from "axios";
import { TMDB_BASE_URL, TMDB_TOKEN } from "@/lib/tmdbConfig";

// Only ever proxy the read-only, public-data endpoints this app actually
// uses. Keeps the server token from being usable as an open TMDB relay.
const ALLOWED_PREFIXES = [
  "/configuration",
  "/genre/",
  "/trending/",
  "/movie",
  "/tv",
  "/person/",
  "/search/",
  "/discover/",
];

function isAllowedPath(path: string): boolean {
  return ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * Same-origin proxy for the TMDB API. The browser calls this route (via
 * `fetchDataFromApi` in `src/lib/tmdbApi.ts`) instead of TMDB directly, so
 * the bearer token stays server-side. Pass the upstream TMDB path via the
 * `path` query param; every other query param is forwarded through as-is.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { error: "Missing required 'path' query parameter." },
      { status: 400 }
    );
  }

  if (!isAllowedPath(path)) {
    return NextResponse.json(
      { error: `Path "${path}" is not permitted through this proxy.` },
      { status: 403 }
    );
  }

  if (!TMDB_TOKEN) {
    return NextResponse.json(
      {
        error:
          "TMDB API token is not configured. Set TMDB_TOKEN in your environment (see .env.example).",
      },
      { status: 500 }
    );
  }

  const forwardedParams = new URLSearchParams(searchParams);
  forwardedParams.delete("path");

  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
      params: Object.fromEntries(forwardedParams),
    });

    return NextResponse.json(data, {
      headers: {
        // Short edge/browser cache — TMDB list data doesn't need to be
        // fetched fresh on every scroll tick or re-render.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    const status = axios.isAxiosError(err) ? (err.response?.status ?? 502) : 502;
    const detail = axios.isAxiosError(err)
      ? (err.response?.data ?? err.message)
      : "Unknown error";
    console.error(`[api/tmdb] upstream error for "${path}":`, status, detail);
    return NextResponse.json(
      { error: "TMDB request failed.", detail },
      { status }
    );
  }
}
