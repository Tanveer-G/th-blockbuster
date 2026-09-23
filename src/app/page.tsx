import Carousel from "@/components/Carousel";
import Discover from "@/components/Discover";
import Section from "@/components/Section";
import WelcomeSearch from "@/components/WelcomeSearch";
import StatusMessage from "@/components/StatusMessage";
import BackgroundSync from "@/components/layout/common/BackgroundSync";
import { getOnTheAirTv, getUpcomingMovies } from "@/lib/tmdbService";
import type { PaginatedResponse } from "@/types/tmdb";

// Re-generate this page's server-fetched sections at most once an hour —
// upcoming-release lists don't need to be refetched on every single
// request, but shouldn't be frozen at build time forever either.
export const revalidate = 3600;

// Fetched once per request on the server — no client waterfall for the
// first thing visitors see below the fold.
async function safeFetch(
  fetcher: () => Promise<PaginatedResponse>
): Promise<PaginatedResponse | null> {
  try {
    return await fetcher();
  } catch (err) {
    console.error("[home] failed to load carousel data", err);
    return null;
  }
}

export default async function Home() {
  const [upcomingMovies, upcomingTv] = await Promise.all([
    safeFetch(() => getUpcomingMovies(1)),
    safeFetch(() => getOnTheAirTv(1)),
  ]);

  return (
    <div className="w-full">
      <BackgroundSync />
      <WelcomeSearch />

      <Section title="Upcoming Movies">
        {upcomingMovies && upcomingMovies.results.length > 0 ? (
          <Carousel data={upcomingMovies} mediaType="movie" />
        ) : (
          <StatusMessage
            title="Couldn't load upcoming movies"
            description="TMDB might be unreachable right now — please refresh."
          />
        )}
      </Section>

      <Section title="On The Air — TV Shows">
        {upcomingTv && upcomingTv.results.length > 0 ? (
          <Carousel data={upcomingTv} mediaType="tv" />
        ) : (
          <StatusMessage
            title="Couldn't load TV shows"
            description="TMDB might be unreachable right now — please refresh."
          />
        )}
      </Section>

      <Discover />
    </div>
  );
}
