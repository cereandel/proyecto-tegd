"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "../../../components/SearchResults";
import { getMockHotels } from "../../../data/mocks/hotels";
import { useSelectedHotel } from "../../../contexts/SelectedHotelContext";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const { setSelectedHotel } = useSelectedHotel();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const hotels = getMockHotels(query);

  const handleHotelClick = (hotel: any) => {
    setSelectedHotel(hotel);
    router.push(`/hotelDetails/${hotel.id}`);
  };

  return (
    <SearchResults
      searchQuery={query}
      hotels={hotels}
      onBack={() => router.back()}
      onClearSearch={() => {
        router.back();
      }}
      onHotelClick={handleHotelClick}
      initialExpanded={true}
    />
  );
}
