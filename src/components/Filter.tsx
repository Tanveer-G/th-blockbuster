"use client";

import type { ChangeEvent } from "react";
import { sortbyData } from "@/data/certificate";
import { Select } from "@/components/UI/Select";

export interface FilterProps {
  sortBy: string;
  onSortByChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
}

/**
 * Sort-by + release-year controls for the Movies/Series discover grids.
 * Paging itself is handled by infinite scroll (see `useInfiniteList`), so
 * this only surfaces the filters that actually change *which* results come
 * back, not which page of them is showing.
 */
const Filter = ({ sortBy, onSortByChange, year, onYearChange }: FilterProps) => {
  return (
    <div className="flex w-full flex-col gap-3 py-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-brand-gray-light">Sort by:</span>
        <Select
          value={sortBy}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onSortByChange(e.target.value)}
        >
          {sortbyData.map((sel) => (
            <option key={sel.value} value={sel.value}>
              {sel.label}
            </option>
          ))}
        </Select>
        <input
          className="w-20 rounded bg-brand-select-bg px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
          type="text"
          inputMode="numeric"
          placeholder="Year"
          value={year}
          maxLength={4}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onYearChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
          }
        />
      </div>
    </div>
  );
};

export default Filter;
