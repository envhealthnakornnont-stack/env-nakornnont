"use client";
import NavigationButtons from "@/features/users/components/Carousel/NavigationButtons";
import Slide from "@/features/users/components/Carousel/Slide";
import { useCarousel } from "@/features/users/hooks/useCarousel";
import { BannerVideo } from "@/types/publicTypes";

interface CarouselProps {
  carousel: BannerVideo[];
}

const Carousel = ({ carousel }: CarouselProps) => {
  const {
    activeIndex,
    handleNext,
    handlePrev,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCarousel({ carousel });

  if (!carousel?.length) return null;

  const total = carousel.length;

  return (
    <div
      className="relative w-full h-[450px] xl:h-[650px] overflow-hidden bg-neutral"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
    >
      {carousel.map((item, index) => {
        const isActive = index === activeIndex;
        const isPrev = index === (activeIndex - 1 + total) % total;
        const isNext = index === (activeIndex + 1) % total;

        return (
          <Slide
            key={item.id ?? index}
            slide={item}
            isActive={isActive}
            isPrev={isPrev}
            isNext={isNext}   // ✅ ส่งสถานะ next ไปด้วย
          />
        );
      })}

      <NavigationButtons onNext={handleNext} onPrev={handlePrev} />
    </div>
  );
};

export default Carousel;
