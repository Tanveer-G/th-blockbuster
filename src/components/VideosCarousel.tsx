import CarouselRow, { VIDEO_BREAKPOINTS } from "./CarouselRow";
import type { Video, VideosResponse } from "@/types/tmdb";

export interface VideosCarouselProps {
  videos?: VideosResponse;
}

const VideosCarousel = ({ videos }: VideosCarouselProps) => {
  const results = videos?.results ?? [];

  return (
    <CarouselRow
      ariaLabel="Videos carousel"
      breakpoints={VIDEO_BREAKPOINTS}
      slides={results.map((video) => (
        <VideoCard key={video.id} data={video} />
      ))}
    />
  );
};

export default VideosCarousel;

export interface VideoCardProps {
  data: Video;
}

export const VideoCard = ({ data }: VideoCardProps) => {
  const yt = `https://www.youtube.com/embed/${data.key}`;

  return (
    <div className="w-full">
      <div className="loading-animation aspect-video w-full overflow-hidden rounded-md">
        <iframe
          className="h-full w-full"
          src={yt}
          title={data.name}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <h3 className="mt-2 truncate text-sm text-white">{data.name}</h3>
    </div>
  );
};
