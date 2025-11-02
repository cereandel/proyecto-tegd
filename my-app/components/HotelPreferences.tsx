"use client";

import {
  ChevronLeft,
  Home,
  DollarSign,
  Users,
  Sparkles,
  Wifi,
  Coffee,
  Dumbbell,
  Waves,
  Car,
  Wind,
  Check,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cookies } from "next/headers";
import hotelModel from "@/app/lib/models/hotel.model";
import { getSocketUrl } from "next/dist/client/components/react-dev-overlay/internal/helpers/get-socket-url";

interface HotelPreferencesProps {
  onBack: () => void;
}

export function HotelPreferences({ onBack }: HotelPreferencesProps) {
  const [preferences, setPreferences] = useState({
    hotelType: "",
    priceRange: "",
    groupSize: "",
    amenities: [] as string[],
  });

  async function getUserPreferences() {
    const response = await fetch(`/api/session`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const res = await response.json();
      const prefs = res.session?.safeUser?.preferences ?? null;
      setPreferences((prev) => ({
        ...prev,
        hotelType: prefs?.hotelType ?? "",
        priceRange: prefs?.priceRange ?? "",
        groupSize: prefs?.groupSize ?? "",
        amenities: Array.isArray(prefs?.amenities) ? prefs!.amenities : [],
      }));
    } else {
      console.log("error al recibir cookie");
    }
  }

  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);

  const handleSave = () => {
    (async () => {
      try {
        setShowSaveAnimation(true);
        const mapPrice = (p: string) => {
          if (!p) return p;
          const lower = p.toLowerCase();
          if (lower === "low" || lower === "económico" || lower === "economico")
            return "economic";
          if (lower === "medium" || lower === "medio") return "medium";
          if (lower === "expensive" || lower === "lujo") return "luxury";
          if (lower === "economic" || lower === "medium" || lower === "luxury")
            return lower;
          return p;
        };

        const normalizedPreferences = {
          ...preferences,
          priceRange: mapPrice(preferences.priceRange),
        };

        const resp = await fetch("/api/user/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: normalizedPreferences }),
        });
        const data = await resp.json();
        setTimeout(() => setShowSaveAnimation(false), 700);
        if (!resp.ok) {
          console.error("Save preferences failed:", data);
          setShowSaveError(true);
          setTimeout(() => setShowSaveError(false), 3000);
          return;
        }
        if (data?.preferences) {
          setPreferences((prev) => ({
            ...prev,
            hotelType: data.preferences.hotelType,
            priceRange: data.preferences.priceRange,
            groupSize: data.preferences.groupSize,
            amenities: data.preferences.amenities,
          }));
          // notify other parts of the app (HomePage) that preferences changed
          try {
            window.dispatchEvent(
              new CustomEvent("preferences:updated", {
                detail: { preferences: data.preferences },
              })
            );
          } catch (e) {
            // ignore in non-browser environments
          }
        }
      } catch (err) {
        console.error("Save preferences error:", err);

        setTimeout(() => setShowSaveAnimation(false), 700);
        setShowSaveError(true);
        setTimeout(() => setShowSaveError(false), 3000);
      }
    })();
  };

  const hotelTypes = [
    { id: "Resort", label: "Resort", icon: Sparkles, color: "#FF9500" },
    { id: "Boutique", label: "Boutique", icon: Home, color: "#5856D6" },
    { id: "Business", label: "Negocios", icon: Wind, color: "#007AFF" },
    { id: "Family", label: "Familiar", icon: Users, color: "#34C759" },
    { id: "Hostel", label: "Hostel", icon: Sparkles, color: "#FFCC00" },
    { id: "Apartment", label: "Apartamento", icon: Home, color: "#00C2A8" },
  ];

  const priceRanges = [
    { id: "economic", label: "Económico", range: "< $100", color: "#34C759" },
    { id: "medium", label: "Medio", range: "$100 - $250", color: "#FF9500" },
    { id: "luxury", label: "Lujo", range: "> $250", color: "#AF52DE" },
  ];

  const groupSizes = [
    { id: "Solo", label: "Solo", icon: "👤" },
    { id: "Couple", label: "Pareja", icon: "💑" },
    { id: "Family", label: "Familia", icon: "👨‍👩‍👧‍👦" },
    { id: "Group", label: "Grupo", icon: "👥" },
  ];

  const amenities = [
    { id: "wifi", label: "WiFi Gratis", icon: Wifi },
    { id: "breakfast", label: "Desayuno", icon: Coffee },
    { id: "gym", label: "Gimnasio", icon: Dumbbell },
    { id: "pool", label: "Piscina", icon: Waves },
  ];

  const toggleHotelType = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      hotelType: prev.hotelType == id ? "" : id,
    }));
  };

  const toggleAmenity = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  useEffect(() => {
    getUserPreferences();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Header */}
      <div
        className="pt-12 pb-6 px-6 sticky top-0 z-10"
        style={{ backgroundColor: "#007AFF" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 transition-transform active:scale-90"
          >
            <ChevronLeft size={28} color="white" />
          </button>
          <h1 className="text-white">Preferencias de Hotel</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 pb-8 overflow-y-auto">
        {/* Hotel Type */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-4" style={{ color: "#1D1D1F" }}>
            Tipo de Hotel Preferido
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {hotelTypes.map((type, index) => {
              const isSelected = preferences.hotelType == type.id;
              return (
                <motion.button
                  key={type.id}
                  onClick={() => toggleHotelType(type.id)}
                  className="p-4 flex flex-col items-center gap-2 transition-all"
                  style={{
                    backgroundColor: isSelected ? `${type.color}15` : "#F9FAFB",
                    borderRadius: "20px",
                    border: isSelected
                      ? `2px solid ${type.color}`
                      : "1px solid #E5E7EB",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <type.icon
                    size={28}
                    style={{ color: isSelected ? type.color : "#8E8E93" }}
                  />
                  <span style={{ color: isSelected ? type.color : "#1D1D1F" }}>
                    {type.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Price Range */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="mb-4" style={{ color: "#1D1D1F" }}>
            Rango de Precio
          </h2>
          <div className="space-y-3">
            {priceRanges.map((range, index) => {
              const isSelected = preferences.priceRange === range.id;
              return (
                <motion.button
                  key={range.id}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      priceRange: prev.priceRange === range.id ? "" : range.id,
                    }))
                  }
                  className="w-full p-4 flex items-center justify-between transition-all"
                  style={{
                    backgroundColor: isSelected
                      ? `${range.color}15`
                      : "#F9FAFB",
                    borderRadius: "20px",
                    border: isSelected
                      ? `2px solid ${range.color}`
                      : "1px solid #E5E7EB",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 flex items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? range.color : "#E5E7EB",
                        borderRadius: "12px",
                      }}
                    >
                      <DollarSign
                        size={24}
                        color={isSelected ? "white" : "#8E8E93"}
                      />
                    </div>
                    <div className="text-left">
                      <p
                        style={{ color: isSelected ? range.color : "#1D1D1F" }}
                      >
                        {range.label}
                      </p>
                      <p className="text-sm" style={{ color: "#8E8E93" }}>
                        {range.range}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: range.color }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Group Size */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="mb-4" style={{ color: "#1D1D1F" }}>
            Tamaño del Grupo
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {groupSizes.map((size, index) => {
              const isSelected = preferences.groupSize === size.id;
              return (
                <motion.button
                  key={size.id}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      groupSize: prev.groupSize === size.id ? "" : size.id,
                    }))
                  }
                  className="p-3 flex flex-col items-center gap-2 transition-all"
                  style={{
                    backgroundColor: isSelected ? "#007AFF15" : "#F9FAFB",
                    borderRadius: "16px",
                    border: isSelected
                      ? "2px solid #007AFF"
                      : "1px solid #E5E7EB",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ fontSize: "28px" }}>{size.icon}</span>
                  <span
                    className="text-xs"
                    style={{ color: isSelected ? "#007AFF" : "#8E8E93" }}
                  >
                    {size.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Amenities */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="mb-4" style={{ color: "#1D1D1F" }}>
            Comodidades Importantes
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {amenities.map((amenity, index) => {
              const isSelected =
                Array.isArray(preferences.amenities) &&
                preferences.amenities.includes(amenity.id);
              return (
                <motion.button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className="p-4 flex items-center gap-3 transition-all"
                  style={{
                    backgroundColor: isSelected ? "#34C75915" : "#F9FAFB",
                    borderRadius: "16px",
                    border: isSelected
                      ? "2px solid #34C759"
                      : "1px solid #E5E7EB",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <amenity.icon
                    size={20}
                    style={{ color: isSelected ? "#34C759" : "#8E8E93" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: isSelected ? "#34C759" : "#1D1D1F" }}
                  >
                    {amenity.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={showSaveAnimation}
          className="w-full py-4 px-6 text-white relative overflow-hidden"
          style={{
            backgroundColor: "#007AFF",
            borderRadius: "20px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          whileTap={{ scale: showSaveAnimation ? 1 : 0.98 }}
        >
          <AnimatePresence mode="wait">
            {!showSaveAnimation ? (
              <motion.span
                key="save"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Guardar Preferencias
              </motion.span>
            ) : (
              <motion.div
                key="saving"
                className="flex items-center justify-center gap-3 relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "white" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Check size={20} color="#34C759" strokeWidth={3} />
                  </motion.div>
                </motion.div>
                <span>¡Guardado!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success animation background */}
          {showSaveAnimation && (
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundColor: "#34C759",
                borderRadius: "20px",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      </div>

      {/* Error Overlay */}
      <AnimatePresence>
        {showSaveError && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "#FF3B30" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="text-center px-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <XCircle size={64} color="white" strokeWidth={2} />
              </motion.div>
              <motion.h2
                className="text-white text-2xl mt-4 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Error al Guardar
              </motion.h2>
              <motion.p
                className="text-white/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                No se pudieron guardar tus preferencias
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
