"use client";

import type { ChangeEvent } from "react";
import { Countries } from "@/data/countries";
import { Languages } from "@/data/languages";
import { Select } from "@/components/UI/Select";

export interface TrendQueryValue {
  media: string;
  time: "day" | "week";
  language: string;
  region: string;
}

export interface TrendQueryProps {
  types: 1 | 2 | 3;
  value: TrendQueryValue;
  onChange: (next: Partial<TrendQueryValue>) => void;
}

/**
 * Filter bar for the home page's Discover section. Fully controlled by the
 * parent (`Discover.tsx`), which turns these into real TMDB query params —
 * trending's media/time window, or an original-language filter for the
 * Popular/Top Rated tabs.
 */
const TrendQuery = ({ types, value, onChange }: TrendQueryProps) => {
  if (types === 1) {
    return (
      <div className="flex flex-wrap items-center gap-3 py-3 text-sm text-brand-gray-light sm:gap-4">
        <div className="flex items-center gap-2">
          <span>Media:</span>
          <Select
            value={value.media}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ media: e.target.value })}
          >
            <option value="all">All</option>
            <option value="movie">Movie</option>
            <option value="tv">Tv</option>
          </Select>
        </div>
        <span className="hidden h-4 w-px bg-brand-line sm:block" />
        <div className="flex items-center gap-2">
          <span>Time:</span>
          <Select
            value={value.time}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onChange({ time: e.target.value as "day" | "week" })
            }
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 text-sm text-brand-gray-light sm:gap-4">
      <div className="flex items-center gap-2">
        <span>Media:</span>
        <Select
          value={value.media}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ media: e.target.value })}
        >
          <option value="movie">Movie</option>
          <option value="tv">Tv</option>
        </Select>
      </div>
      <span className="hidden h-4 w-px bg-brand-line sm:block" />
      <Select
        value={value.language}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ language: e.target.value })}
      >
        <option value="">Any language</option>
        {Languages.map((language) => (
          <option key={language.iso_639_1} value={language.iso_639_1}>
            {language.english_name}
          </option>
        ))}
      </Select>
      {types === 3 && (
        <>
          <span className="hidden h-4 w-px bg-brand-line sm:block" />
          <Select
            value={value.region}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ region: e.target.value })}
          >
            <option value="">Region: Any</option>
            {Countries.map((country) => (
              <option key={country.iso_3166_1} value={country.iso_3166_1}>
                {country.english_name}
              </option>
            ))}
          </Select>
        </>
      )}
    </div>
  );
};

export default TrendQuery;
