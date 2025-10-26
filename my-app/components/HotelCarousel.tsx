import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HotelCard } from "./HotelCard";

interface Hotel {
    _id:string;
    name: string;
    description: string;
    location:{
        city: string;
        country: string;
    },
    amenities: string[];
    hotelType: string;
    priceRange: string;
    groupSize: string;
    pricePerNight: number;
    images: string[];
    reviews: {
        stars: number;
        comment: string;
        date: Date;
    }[];
    averageRating: number;
}

interface HotelCarouselProps {
  title: string;
  hotels: Hotel[];
  featured?: boolean;
  onViewAll?: () => void;
  onHotelClick?: (hotel: Hotel) => void;
}

export function HotelCarousel({
  title,
  hotels,
  featured = false,
  onViewAll,
  onHotelClick,
}: HotelCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
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
        <h3 className={`text-gray-900 ${featured ? "text-xl" : ""}`}>
          {title}
        </h3>
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
            scrollBehavior: "smooth",
          }}
        >
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className={`flex-shrink-0 ${featured ? "w-80" : "w-72"}`}
            >
              <HotelCard
                name={hotel.name}
                location={hotel.location.city}
                price={hotel.pricePerNight.toString()}
                rating={hotel.averageRating}
                imageUrl={hotel.images[0]}
                onClick={() => onHotelClick?.(hotel)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
