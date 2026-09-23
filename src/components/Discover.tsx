"use client";

import { useState } from "react";
import Tabs, { type TabsData } from "./Tabs";
import TrendQuery, { type TrendQueryValue } from "./TrendQuery";
import Carousel from "./Carousel";
import StatusMessage from "./StatusMessage";
import { RowSkeleton } from "./skeletons/Skeletons";
import { useApiQuery } from "@/hooks/useApiQuery";
import { discoverMovies, discoverTv, getTrending } from "@/lib/tmdbService";
import type { MediaSummary, MediaType, PaginatedResponse, TrendingMediaType } from "@/types/tmdb";

const tabData: TabsData = {
  name: ["Trends Now", "Popular", "Top Rated"],
  icon1: ["/images/arrow11.png", "/images/fire1.png", "/images/star1.png"],
  icon0: ["/images/arrow0.png", "/images/fire0.png", "/images/star0.png"],
};

const DEFAULT_FILTERS: TrendQueryValue = {
  media: "all",
  time: "day",
  language: "",
  region: "",
};

const Discover = () => {
  const [tab, setTab] = useState<1 | 2 | 3>(1);
  const [filters, setFilters] = useState<TrendQueryValue>(DEFAULT_FILTERS);

  const handleTabInfo = (tabNumber: number): void => {
    if (tabNumber === 1 || tabNumber === 2 || tabNumber === 3) {
      setTab(tabNumber);
      // Popular/Top Rated only ever deal in movie/tv — reset away from
      // "all" (a trending-only concept) when leaving the Trends tab.
      setFilters((prev) => ({ ...prev, media: prev.media === "all" ? "movie" : prev.media }));
    }
  };

  const { data, loading, error } = useApiQuery<PaginatedResponse>(
    () => {
      if (tab === 1) {
        return getTrending(filters.media as TrendingMediaType, filters.time, 1).then((res) => ({
          ...res,
          // "all" mixes in `person` results, which this grid can't render
          // (no poster/runtime) — keep only titles the Card can show.
          results: res.results.filter(
            (item) => !item.media_type || item.media_type !== "person"
          ),
        }));
      }

      const mediaType = (filters.media || "movie") as MediaType;
      const sortBy = tab === 2 ? "popularity.desc" : "vote_average.desc";
      const discoverParams = {
        sort_by: sortBy,
        with_original_language: filters.language || undefined,
        region: tab === 3 ? filters.region || undefined : undefined,
        "vote_average.gte": tab === 3 ? 6.5 : undefined,
        "vote_count.gte": tab === 3 ? 100 : undefined,
      };

      return mediaType === "tv" ? discoverTv(discoverParams) : discoverMovies(discoverParams);
    },
    [tab, filters.media, filters.time, filters.language, filters.region]
  );

  const mediaType: MediaType = tab === 1 ? "movie" : ((filters.media || "movie") as MediaType);

  return (
    <div className="w-full py-4">
      <Tabs data={tabData} tabInfo={handleTabInfo} />
      <TrendQuery
        types={tab}
        value={filters}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
      />

      {loading && !data ? (
        <RowSkeleton />
      ) : error && !data ? (
        <StatusMessage title="Couldn't load this list" description="Please try a different tab or filter." />
      ) : !data || data.results.length === 0 ? (
        <StatusMessage title="Nothing to show" description="Try a different filter combination." />
      ) : (
        <Carousel data={data} mediaType={mediaType} />
      )}
    </div>
  );
};

export default Discover;
