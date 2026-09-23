import Card, { CastCard } from "./Card";
import CarouselRow, { PERSON_BREAKPOINTS } from "./CarouselRow";
import type { Credits, MediaType, PaginatedResponse } from "@/types/tmdb";

export interface CarouselProps {
  data?: PaginatedResponse;
  mediaType?: MediaType;
}

const Carousel = ({ data, mediaType = "movie" }: CarouselProps) => {
  const results = data?.results ?? [];

  return (
    <CarouselRow
      ariaLabel={`${mediaType} carousel`}
      slides={results.map((item, i) => (
        <Card key={item.id ?? i} data={item} mediaType={item.media_type ?? mediaType} />
      ))}
    />
  );
};

export default Carousel;

export interface CastCarouselProps {
  credits?: Credits;
}

export const CastCarousel = ({ credits }: CastCarouselProps) => {
  const cast = credits?.cast?.slice(0, 26) ?? [];

  return (
    <CarouselRow
      ariaLabel="Cast carousel"
      breakpoints={PERSON_BREAKPOINTS}
      slides={cast.map((member, i) => (
        <CastCard key={member.id ?? i} data={member} />
      ))}
    />
  );
};
