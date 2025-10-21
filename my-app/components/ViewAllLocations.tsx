"use client";

import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { LocationCard } from "./LocationCard";
import { BottomNav } from "./BottomNav";
import { useState } from "react";

interface Location {
  id: number;
  name: string;
  country: string;
  hotelsCount: number;
  imageUrl: string;
}

interface ViewAllLocationsProps {
  title: string;
  locations: Location[];
  onBack: () => void;
}

export function ViewAllLocations({ title, locations, onBack }: ViewAllLocationsProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY = 8;
  const displayedLocations = showAll ? locations : locations.slice(0, INITIAL_DISPLAY);
  const hasMore = locations.length > INITIAL_DISPLAY;

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
          {displayedLocations.map((location) => (
            <LocationCard
              key={location.id}
              name={location.name}
              country={location.country}
              hotelsCount={location.hotelsCount}
              imageUrl={location.imageUrl}
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
