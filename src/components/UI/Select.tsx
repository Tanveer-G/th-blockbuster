import type { SelectHTMLAttributes } from "react";

/**
 * The one `<select>` style used across every filter bar in the app
 * (Filter, TrendQuery, MediaBrowsePage's certificate picker). Previously
 * each of those files carried its own copy of this class string — one of
 * them (the certificate selects) had quietly drifted to a slightly
 * different look (no focus ring, smaller text). Centralizing it here means
 * every dropdown looks and behaves the same, and a future style tweak is a
 * one-line change instead of a find-and-replace across three files.
 */
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return (
    <select
      {...rest}
      className={`rounded bg-brand-select-bg px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-red ${className}`}
    />
  );
}
