"use client";

import { useRouter } from "next/navigation";
import { useViewAll } from "@/contexts/ViewAllContext";
import { ViewAllHotels } from "@/components/ViewAllHotels";
import { useSelectedHotel } from "@/contexts/SelectedHotelContext";

export default function ViewAllPage() {
  const router = useRouter();
  const { title, hotels, clearViewAll } = useViewAll();

  const handleBack = () => {
    clearViewAll();
    router.back();
  };

  const { setSelectedHotel } = useSelectedHotel();

  const handleHotelClick = (hotel: any) => {
    setSelectedHotel(hotel);
    router.push(`/hotelDetails/${hotel._id ?? hotel.id}`);
  };

  return (
    <ViewAllHotels
      title={title || "Hoteles"}
      hotels={hotels}
      onBack={handleBack}
      onHotelClick={handleHotelClick}
    />
  );
}
