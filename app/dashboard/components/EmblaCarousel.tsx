import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const EmblaCarousel = ({ skills }: { skills: string[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: "trimSnaps", // Prevents items from overflowing
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", updateButtons);
    updateButtons();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative p-2 overflow-hidden">
      {/* Carousel Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 w-full">
          {skills.map((skill, index) => (
            <div key={index} className="flex-shrink-0  px-1">
              <Card
                className="h-10 w-fit p-2 bg-slate-100 shadow-4xl rounded-lg text-sm text-center  whitespace-nowrap text-ellipsis"
                title={skill}
              >
                {skill}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {canScrollPrev && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-300 h-10 w-fit p-2 rounded-full shadow-md"
          onClick={scrollPrev}
        >
          <HiChevronLeft />
        </button>
      )}
      {canScrollNext && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-300 h-10 w-fit p-2 rounded-full shadow-md"
          onClick={scrollNext}
        >
          <HiChevronRight />
        </button>
      )}
    </div>
  );
};

export default EmblaCarousel;
