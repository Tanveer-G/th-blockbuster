"use client";

import { useRef, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { useBreakpoint } from "@/hooks/useMediaQuery";

export interface CarouselBreakpoint {
  slidesPerView: number;
  spaceBetween: number;
}

export type CarouselBreakpoints = Record<number, CarouselBreakpoint>;

/** Default density tuned for poster-style cards (~150–180px wide). */
export const POSTER_BREAKPOINTS: CarouselBreakpoints = {
  0: { slidesPerView: 2.4, spaceBetween: 12 },
  480: { slidesPerView: 3.3, spaceBetween: 12 },
  640: { slidesPerView: 4.2, spaceBetween: 14 },
  768: { slidesPerView: 4.5, spaceBetween: 14 },
  1024: { slidesPerView: 5.5, spaceBetween: 16 },
  1280: { slidesPerView: 6.5, spaceBetween: 16 },
  1536: { slidesPerView: 7.5, spaceBetween: 18 },
};

/** Denser breakpoints for round cast/person avatars (~95–110px wide). */
export const PERSON_BREAKPOINTS: CarouselBreakpoints = {
  0: { slidesPerView: 3.4, spaceBetween: 12 },
  480: { slidesPerView: 4.5, spaceBetween: 12 },
  640: { slidesPerView: 5.5, spaceBetween: 14 },
  768: { slidesPerView: 6.5, spaceBetween: 14 },
  1024: { slidesPerView: 8.5, spaceBetween: 16 },
  1280: { slidesPerView: 10.5, spaceBetween: 16 },
  1536: { slidesPerView: 12.5, spaceBetween: 18 },
};

/** Wider spacing for 16:9 video embeds. */
export const VIDEO_BREAKPOINTS: CarouselBreakpoints = {
  0: { slidesPerView: 1.15, spaceBetween: 12 },
  480: { slidesPerView: 1.6, spaceBetween: 12 },
  640: { slidesPerView: 2.2, spaceBetween: 14 },
  1024: { slidesPerView: 3.2, spaceBetween: 16 },
  1536: { slidesPerView: 4.2, spaceBetween: 18 },
};

export interface CarouselRowProps {
  slides: ReactNode[];
  breakpoints?: CarouselBreakpoints;
  ariaLabel?: string;
}

/**
 * Shared horizontal carousel: swipes smoothly on touch, drags with the
 * mouse, responds to trackpad/mouse-wheel scrolling, and shows a
 * precise number of cards per breakpoint (rather than one fixed count for
 * every screen size). Prev/next arrows are only mounted on non-touch,
 * large-enough screens via `useBreakpoint` — mobile relies purely on the
 * swipe gesture instead of rendering unused buttons.
 */
const CarouselRow = ({
  slides,
  breakpoints = POSTER_BREAKPOINTS,
  ariaLabel,
}: CarouselRowProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { isDesktop } = useBreakpoint();
  const base = breakpoints[0] ?? { slidesPerView: 2, spaceBetween: 12 };

  if (slides.length === 0) {
    return (
      <p className="py-6 text-sm text-brand-gray-light">Nothing to show yet.</p>
    );
  }

  return (
    <div className="group/row relative w-full" role="region" aria-label={ariaLabel}>
      <Swiper
        modules={[FreeMode, Mousewheel, Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={base.slidesPerView}
        spaceBetween={base.spaceBetween}
        breakpoints={breakpoints}
        freeMode={{ enabled: true, momentum: true, momentumRatio: 0.8 }}
        mousewheel={{ forceToAxis: true, sensitivity: 0.6 }}
        grabCursor
        navigation={
          isDesktop
            ? { prevEl: ".carousel-prev", nextEl: ".carousel-next" }
            : false
        }
        className="!px-0.5 !py-1"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="!h-auto">
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>

      {isDesktop && (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            className="carousel-prev absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 shadow-lg backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-brand-red group-hover/row:flex group-hover/row:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current">
              <path d="M15 6l-6 6 6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="carousel-next absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 shadow-lg backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-brand-red group-hover/row:flex group-hover/row:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current">
              <path d="M9 6l6 6-6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default CarouselRow;
