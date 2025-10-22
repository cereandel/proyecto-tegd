"use client";

import { useRouter } from "next/navigation";
import { useViewAllLocations } from "@/contexts/ViewAllLocationsContext";
import { ViewAllLocations } from "@/components/ViewAllLocations";

export default function ViewLocationsPage() {
  const router = useRouter();
  const { title, locations, clearViewLocations } = useViewAllLocations();

  const handleBack = () => {
    clearViewLocations();
    router.back();
  };

  return (
    <ViewAllLocations
      title={title || "Lugares"}
      locations={locations}
      onBack={handleBack}
    />
  );
}
