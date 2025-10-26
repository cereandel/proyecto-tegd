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

interface ViewAllContextType {
  title: string;
  hotels: Hotel[];
  setViewAll: (title: string, hotels: Hotel[]) => void;
  clearViewAll: () => void;
}

const ViewAllContext = createContext<ViewAllContextType | undefined>(undefined);

export function ViewAllProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const setViewAll = (t: string, h: Hotel[]) => {
    setTitle(t);
    setHotels(h);
  };

  const clearViewAll = () => {
    setTitle("");
    setHotels([]);
  };

  return (
    <ViewAllContext.Provider
      value={{ title, hotels, setViewAll, clearViewAll }}
    >
      {children}
    </ViewAllContext.Provider>
  );
}

export function useViewAll() {
  const ctx = useContext(ViewAllContext);
  if (!ctx) throw new Error("useViewAll must be used within ViewAllProvider");
  return ctx;
}
