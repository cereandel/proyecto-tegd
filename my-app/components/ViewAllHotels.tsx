"use client";

import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { HotelCard } from "./HotelCard";
import { BottomNav } from "./BottomNav";
import { useState } from "react";

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

interface ViewAllHotelsProps {
  title: string;
  hotels: Hotel[];
  onBack: () => void;
  onHotelClick?: (hotel: Hotel) => void;
}

export function ViewAllHotels({ title, hotels, onBack, onHotelClick }: ViewAllHotelsProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY = 8;
  const displayedHotels = showAll ? hotels : hotels.slice(0, INITIAL_DISPLAY);
  const hasMore = hotels.length > INITIAL_DISPLAY;

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 transition-colors"
            style={{ borderRadius: "50%" }}
          >
            <ChevronLeft size={24} style={{ color: "#007AFF" }} />
          </button>
          <h2 className="text-gray-900">{title}</h2>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedHotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              name={hotel.name}
              location={hotel.location.city}
              price={hotel.pricePerNight.toString()}
              rating={hotel.averageRating}
              imageUrl={hotel.images[0]}
              onClick={() => onHotelClick?.(hotel)}
            />
          ))}
        </div>

        {/* Show More/Less Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-4 text-white transition-all hover:shadow-lg flex items-center gap-2"
              style={{
                backgroundColor: "#007AFF",
                borderRadius: "24px"
              }}
            >
              <span>{showAll ? "Mostrar menos" : "Mostrar más"}</span>
              {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab="home"
      />
    </div>
  );
}
