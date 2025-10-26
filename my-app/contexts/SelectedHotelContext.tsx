"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

interface SelectedHotelContextType {
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel | null) => void;
}

const SelectedHotelContext = createContext<
  SelectedHotelContextType | undefined
>(undefined);

export function SelectedHotelProvider({ children }: { children: ReactNode }) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  return (
    <SelectedHotelContext.Provider value={{ selectedHotel, setSelectedHotel }}>
      {children}
    </SelectedHotelContext.Provider>
  );
}

export function useSelectedHotel() {
  const ctx = useContext(SelectedHotelContext);
  if (!ctx) {
    throw new Error(
      "useSelectedHotel must be used within SelectedHotelProvider"
    );
  }
  return ctx;
}
