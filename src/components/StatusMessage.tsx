"use client";

import Image from "next/image";
import { FALLBACK_NO_RESULTS } from "@/lib/image";

export interface StatusMessageProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Used for both "no results" and "request failed" states across the
 * Movies/Series/Search pages, so a failed fetch and a genuinely empty
 * result set look like one consistent, calm UI rather than a raw error.
 */
const StatusMessage = ({ title, description, onRetry }: StatusMessageProps) => (
  <div className="flex w-full flex-col items-center justify-center gap-3 py-16 text-center">
    <Image src={FALLBACK_NO_RESULTS} alt="" width={140} height={140} unoptimized />
    <p className="text-base font-semibold text-white">{title}</p>
    {description && (
      <p className="max-w-sm text-sm text-brand-gray-light">{description}</p>
    )}
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded bg-brand-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-red-hover"
      >
        Try again
      </button>
    )}
  </div>
);

export default StatusMessage;
