import type { Metadata } from "next";
import BackgroundSync from "@/components/layout/common/BackgroundSync";
import SearchResults from "./SearchResults";

interface SearchPageProps {
  params: Promise<{ query: string }>;
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { query } = await params;
  return { title: `"${decodeURIComponent(query)}" search | MovieFlix` };
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);

  return (
    <div className="w-full">
      <BackgroundSync />
      <SearchResults query={decodedQuery} />
    </div>
  );
}
