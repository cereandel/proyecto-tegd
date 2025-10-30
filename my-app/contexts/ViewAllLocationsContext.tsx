"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Location {
  id: number;
  name: string;
  country: string;
  hotelsCount: number;
  imageUrl?: string;
  images?: { main?: string; others?: string[] } | string[];
}

interface ViewAllLocationsContextType {
  title: string;
  locations: Location[];
  setViewLocations: (title: string, locations: Location[]) => void;
  clearViewLocations: () => void;
}

const ViewAllLocationsContext = createContext<
  ViewAllLocationsContextType | undefined
>(undefined);

export function ViewAllLocationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [title, setTitle] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);

  const setViewLocations = (t: string, l: Location[]) => {
    setTitle(t);
    setLocations(l);
  };

  const clearViewLocations = () => {
    setTitle("");
    setLocations([]);
  };

  return (
    <ViewAllLocationsContext.Provider
      value={{ title, locations, setViewLocations, clearViewLocations }}
    >
      {children}
    </ViewAllLocationsContext.Provider>
  );
}

export function useViewAllLocations() {
  const ctx = useContext(ViewAllLocationsContext);
  if (!ctx)
    throw new Error(
      "useViewAllLocations must be used within ViewAllLocationsProvider"
    );
  return ctx;
}
