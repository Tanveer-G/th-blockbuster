import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Carousel, { CastCarousel } from "@/components/Carousel";
import VideosCarousel from "@/components/VideosCarousel";
import Section from "@/components/Section";
import StatusMessage from "@/components/StatusMessage";
import BackgroundSync from "@/components/layout/common/BackgroundSync";
import { getMediaDetails } from "@/lib/tmdbService";
import { backdropUrl } from "@/lib/image";
import { DEFAULT_BACKGROUND_IMAGE } from "@/redux/features/homeSlice";
import type { MediaDetails, MediaType } from "@/types/tmdb";

interface DetailsPageProps {
  params: Promise<{ mediaType: string; id: string }>;
}

// Details for a given title rarely change minute-to-minute — cache each
// page for an hour rather than hitting TMDB fresh on every visit.
export const revalidate = 3600;

function isValidMediaType(value: string): value is Extract<MediaType, "movie" | "tv"> {
  return value === "movie" || value === "tv";
}

async function loadDetails(mediaType: string, id: string): Promise<MediaDetails | null> {
  if (!isValidMediaType(mediaType) || !id || Number.isNaN(Number(id))) return null;
  try {
    return await getMediaDetails(mediaType, id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: DetailsPageProps): Promise<Metadata> {
  const { mediaType, id } = await params;
  const data = await loadDetails(mediaType, id);
  const name = data?.title ?? data?.name;
  return { title: name ? `${name} | MovieFlix` : "MovieFlix" };
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  const { mediaType, id } = await params;

  if (!isValidMediaType(mediaType)) notFound();

  const data = await loadDetails(mediaType, id);
  if (!data) notFound();

  const backgroundImage = data.backdrop_path
    ? backdropUrl(data.backdrop_path, "original")
    : DEFAULT_BACKGROUND_IMAGE;

  const { similar, recommendations, videos, credits } = data;
  const hasCast = credits.cast.length > 0;
  const hasVideos = videos.results.length > 0;
  const hasRecommendations = recommendations.results.length > 0;
  const hasSimilar = similar.results.length > 0;

  return (
    <>
      <BackgroundSync image={backgroundImage} />

      <div className="w-full">
        <Hero data={data} credits={credits} mediaType={mediaType} />
      </div>

      {hasCast && (
        <Section title="Featured Cast">
          <CastCarousel credits={credits} />
        </Section>
      )}

      {hasVideos && (
        <Section title="Official Videos">
          <VideosCarousel videos={videos} />
        </Section>
      )}

      <Section title="Recommended">
        {hasRecommendations ? (
          <Carousel data={recommendations} mediaType={mediaType} />
        ) : (
          <StatusMessage title="No recommendations yet" />
        )}
      </Section>

      <Section title="Similar">
        {hasSimilar ? (
          <Carousel data={similar} mediaType={mediaType} />
        ) : (
          <StatusMessage title="No similar titles found" />
        )}
      </Section>
    </>
  );
}
