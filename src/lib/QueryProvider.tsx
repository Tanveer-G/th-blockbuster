"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // TMDB list/detail data doesn't change second-to-second — avoid
        // redundant refetches on every window focus/remount while still
        // picking up genuinely new data within a few minutes.
        staleTime: 5 * 60_000,
        gcTime: 30 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
}

function getQueryClient(): QueryClient {
  // Server: always create a fresh client so requests never share state
  // across users. Browser: reuse one client across renders/navigations.
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(getQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
