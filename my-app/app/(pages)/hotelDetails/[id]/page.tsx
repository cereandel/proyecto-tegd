"use client";

import { HotelDetails } from "@/components/HotelDetails";
import { useSelectedHotel } from "@/contexts/SelectedHotelContext";

export default function HotelDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { selectedHotel } = useSelectedHotel();

  if (!selectedHotel || selectedHotel.id !== parseInt(id, 10)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          No se encontraron datos del hotel. Vuelve al inicio y selecciona un
          hotel.
        </p>
      </div>
    );
  }

  return (
    <HotelDetails
      hotel={selectedHotel}
      onBack={() => window.history.back()}
      onReserve={() => {}}
    />
  );
}
