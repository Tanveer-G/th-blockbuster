"use client";

import { useMemo, useState } from "react";
import Genres from "@/components/Genres";
import Filter from "@/components/Filter";
import Card from "@/components/Card";
import Section from "@/components/Section";
import StatusMessage from "@/components/StatusMessage";
import { CardGridSkeleton, CardSkeleton } from "@/components/skeletons/Skeletons";
import BackgroundSync from "@/components/layout/common/BackgroundSync";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import { discoverMovies, discoverTv, normalizeSortBy } from "@/lib/tmdbService";
import { certificateMovie, TvCertListRegion } from "@/data/certificate";
import { Select } from "@/components/UI/Select";
import type { DiscoverParams, MediaSummary } from "@/types/tmdb";

export interface MediaBrowsePageProps {
  mediaType: "movie" | "tv";
  title: string;
  /** Movies support certification filtering via TMDB discover; TV does not
   * expose an equivalent, so the Series page omits this control. */
  showCertificateFilter?: boolean;
}

const GRID_CLASSES =
  "grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8";

export default function MediaBrowsePage({
  mediaType,
  title,
  showCertificateFilter = false,
}: MediaBrowsePageProps) {
  const [genreId, setGenreId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [year, setYear] = useState<string>("");
  const [certRegion, setCertRegion] = useState<string>("US");
  const [certification, setCertification] = useState<string>("");

  const certOptions = certificateMovie.certifications[certRegion] ?? [];

  const params: DiscoverParams = useMemo(() => {
    const p: DiscoverParams = {
      sort_by: normalizeSortBy(sortBy, mediaType),
    };
    if (genreId) p.with_genres = String(genreId);
    if (year.length === 4) {
      if (mediaType === "tv") p.first_air_date_year = Number(year);
      else p.primary_release_year = Number(year);
    }
    if (showCertificateFilter && certification) {
      p.certification = certification;
      p.certification_country = certRegion;
    }
    return p;
  }, [mediaType, genreId, sortBy, year, showCertificateFilter, certification, certRegion]);

  const resetKey = JSON.stringify(params);

  const { items, isInitialLoading, isLoadingMore, error, hasMore, sentinelRef, retry } =
    useInfiniteList<MediaSummary>({
      resetKey,
      fetchPage: (page) =>
        mediaType === "tv"
          ? discoverTv({ ...params, page })
          : discoverMovies({ ...params, page }),
    });

  return (
    <div className="w-full pb-10">
      <BackgroundSync />
      <h1 className="pt-6 text-2xl font-bold text-white sm:text-3xl">{title}</h1>

      <Genres mediaType={mediaType} selectedGenreId={genreId} onSelect={setGenreId} />

      {showCertificateFilter && (
        <div className="flex flex-wrap items-center gap-3 py-3 text-sm text-brand-gray-light">
          <span>Certificate Issued By:</span>
          <Select
            value={certRegion}
            onChange={(e) => {
              setCertRegion(e.target.value);
              setCertification("");
            }}
          >
            {TvCertListRegion.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>

          <span>Certification Type:</span>
          <Select value={certification} onChange={(e) => setCertification(e.target.value)}>
            <option value="">Any</option>
            {certOptions.map((value) => (
              <option key={value.certification} value={value.certification}>
                {`${value.certification} : ${value.meaning.slice(0, 40)}${
                  value.meaning.length > 40 ? "…" : ""
                }`}
              </option>
            ))}
          </Select>
        </div>
      )}

      <Filter sortBy={sortBy} onSortByChange={setSortBy} year={year} onYearChange={setYear} />

      <Section title={isInitialLoading ? "Loading…" : `${items.length} titles`}>
        {isInitialLoading ? (
          <CardGridSkeleton />
        ) : error && items.length === 0 ? (
          <StatusMessage
            title="Couldn't load titles"
            description="Something went wrong talking to TMDB. Check your connection and try again."
            onRetry={retry}
          />
        ) : items.length === 0 ? (
          <StatusMessage
            title="No titles match these filters"
            description="Try a different genre, year, or sort order."
          />
        ) : (
          <>
            <div className={GRID_CLASSES}>
              {items.map((item) => (
                <Card key={item.id} data={item} mediaType={mediaType} />
              ))}
              {isLoadingMore &&
                Array.from({ length: 6 }, (_, i) => <CardSkeleton key={`more-${i}`} />)}
            </div>
            {hasMore && <div ref={sentinelRef} className="h-1 w-full" aria-hidden />}
          </>
        )}
      </Section>
    </div>
  );
}
