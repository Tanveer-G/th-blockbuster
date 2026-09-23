/**
 * Skeleton placeholders shown while data is loading — every shape mirrors
 * the real component it stands in for (Card, Hero, CastCard…) so the
 * layout doesn't jump once the real content arrives. All use the
 * `.loading-animation` shimmer defined in `globals.css`.
 */

export const CardSkeleton = () => (
  <div className="w-full">
    <div className="loading-animation aspect-2/3 w-full rounded-md" />
    <div className="pt-2">
      <div className="loading-animation h-3.5 w-4/5 rounded" />
      <div className="loading-animation mt-2 h-3 w-1/3 rounded" />
    </div>
  </div>
);

export interface CardGridSkeletonProps {
  count?: number;
  className?: string;
}

export const CardGridSkeleton = ({ count = 12, className = "" }: CardGridSkeletonProps) => (
  <div
    className={`grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 ${className}`}
  >
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const RowSkeleton = ({ count = 7 }: { count?: number }) => (
  <div className="flex w-full gap-3 overflow-hidden sm:gap-4">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="w-[42%] shrink-0 sm:w-[22%] lg:w-[16%] xl:w-[13%]">
        <CardSkeleton />
      </div>
    ))}
  </div>
);

export const PersonRowSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="flex w-full gap-4 overflow-hidden">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="w-[110px] shrink-0 text-center">
        <div className="loading-animation mx-auto h-[95px] w-[95px] rounded-full" />
        <div className="loading-animation mx-auto mt-2 h-3 w-4/5 rounded" />
      </div>
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <section
    aria-label="Loading featured title"
    aria-busy="true"
    className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 md:px-8 lg:flex-row lg:items-start lg:gap-10 lg:px-16 lg:py-12"
  >
    {/* ================= LEFT — CONTENT ================= */}
    <div className="order-2 flex min-w-0 flex-1 flex-col items-start gap-2.5 lg:order-1 lg:gap-3">
      {/* Genre tags */}
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="loading-animation h-5 w-16 rounded-[3px] sm:h-[1.35rem] sm:w-20"
          />
        ))}
      </div>

      {/* Title */}
      <div className="loading-animation h-8 w-3/4 rounded sm:h-9 lg:h-10" />

      {/* Tagline */}
      <div className="loading-animation h-3.5 w-1/3 rounded sm:h-4" />

      {/* Overview (3 lines) */}
      <div className="flex w-full max-w-2xl flex-col gap-1.5">
        <div className="loading-animation h-3.5 w-full rounded sm:h-4" />
        <div className="loading-animation h-3.5 w-11/12 rounded sm:h-4" />
        <div className="loading-animation h-3.5 w-2/3 rounded sm:h-4" />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:gap-x-6">
        <div className="loading-animation h-3.5 w-16 rounded sm:h-4 sm:w-20" />
        <div className="loading-animation h-3.5 w-20 rounded sm:h-4 sm:w-24" />
        <div className="loading-animation h-3.5 w-20 rounded sm:h-4 sm:w-24" />
      </div>

      {/* Director / Writer */}
      <div className="flex w-full flex-col gap-1.5">
        <div className="loading-animation h-3.5 w-1/2 rounded sm:h-4" />
        <div className="loading-animation h-3.5 w-2/5 rounded sm:h-4" />
      </div>

      {/* Actions */}
      <div className="mt-2 flex flex-wrap gap-2.5 sm:gap-3">
        <div className="loading-animation h-9 w-24 rounded-full sm:h-10 sm:w-28" />
        <div className="loading-animation h-9 w-28 rounded-full sm:h-10 sm:w-32" />
      </div>
    </div>

    {/* ================= RIGHT — POSTER ================= */}
    <div className="order-1 flex w-full justify-center lg:order-2 lg:w-auto lg:flex-1 lg:items-start lg:justify-end">
      <div className="loading-animation relative aspect-[2/3] w-32 overflow-hidden rounded-lg shadow-2xl sm:w-36 md:w-44 lg:w-56 xl:w-64" />
    </div>
  </section>
);

export const VideoCardSkeleton = () => (
  <div className="w-full">
    <div className="loading-animation aspect-video w-full rounded-md" />
    <div className="loading-animation mt-2 h-3 w-3/4 rounded" />
  </div>
);
