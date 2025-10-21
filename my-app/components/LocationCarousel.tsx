import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LocationCard } from "./LocationCard";

interface Location {
  id: number;
  name: string;
  country: string;
  hotelsCount: number;
  imageUrl: string;
}

interface LocationCarouselProps {
  title: string;
  locations: Location[];
  onViewAll?: () => void;
}

export function LocationCarousel({ title, locations, onViewAll }: LocationCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-6">
        <h3 className="text-gray-900">{title}</h3>
        <button 
          onClick={onViewAll}
          className="text-sm" 
          style={{ color: "#007AFF" }}
        >
          Ver todos
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderRadius: "50%" }}
        >
          <ChevronLeft size={20} style={{ color: "#007AFF" }} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderRadius: "50%" }}
        >
          <ChevronRight size={20} style={{ color: "#007AFF" }} />
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 py-2"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            scrollBehavior: "smooth"
          }}
        >
          {locations.map((location) => (
            <div key={location.id} className="flex-shrink-0 w-64">
              <LocationCard
                name={location.name}
                country={location.country}
                hotelsCount={location.hotelsCount}
                imageUrl={location.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
