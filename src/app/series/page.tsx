import type { Metadata } from "next";
import MediaBrowsePage from "@/components/MediaBrowsePage";

export const metadata: Metadata = {
  title: "Series | MovieFlix",
};

export default function SeriesPage() {
  return <MediaBrowsePage mediaType="tv" title="TV Series" />;
}
