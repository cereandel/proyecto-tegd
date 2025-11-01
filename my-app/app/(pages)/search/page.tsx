"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "../../../components/SearchResults";
import { useState, useCallback } from "react";
import { useSelectedHotel } from "../../../contexts/SelectedHotelContext";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const { setSelectedHotel } = useSelectedHotel();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/hotels/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setHotels(data);
    } catch (err) {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleHotelClick = (hotel: any) => {
    setSelectedHotel(hotel);
    router.push(`/hotelDetails/${hotel._id || hotel.id}`);
  };

  return (
    <SearchResults
      searchQuery={query}
      hotels={hotels}
      //loading={loading}
      onBack={() => router.back()}
      onClearSearch={() => {
        router.back();
      }}
      onHotelClick={handleHotelClick}
      initialExpanded={true}
    />
  );
}
