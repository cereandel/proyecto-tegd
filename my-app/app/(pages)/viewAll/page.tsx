"use client";

import { useRouter } from "next/navigation";
import { useViewAll } from "@/contexts/ViewAllContext";
import { ViewAllHotels } from "@/components/ViewAllHotels";

export default function ViewAllPage() {
  const router = useRouter();
  const { title, hotels, clearViewAll } = useViewAll();

  const handleBack = () => {
    clearViewAll();
    router.back();
  };

  return (
    <ViewAllHotels
      title={title || "Hoteles"}
      hotels={hotels}
      onBack={handleBack}
    />
  );
}
