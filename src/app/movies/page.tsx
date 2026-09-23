import type { Metadata } from "next";
import MediaBrowsePage from "@/components/MediaBrowsePage";

export const metadata: Metadata = {
  title: "Movies | MovieFlix",
};

export default function MoviesPage() {
  return <MediaBrowsePage mediaType="movie" title="Movies" showCertificateFilter />;
}
