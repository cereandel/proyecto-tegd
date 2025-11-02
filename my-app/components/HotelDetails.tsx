"use client";

import {
  ChevronLeft,
  Star,
  MapPin,
  Wifi,
  Coffee,
  Dumbbell,
  Waves,
  Heart,
  Check,
  Loader2,
  CheckCircle2,
  FileText,
  XCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BottomNav } from "./BottomNav";
import { useState } from "react";
import { getTagsFromHotel } from "./utils/getTagsFromHotel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
  };
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

interface HotelDetailsProps {
  hotel: Hotel;
  onBack: () => void;
  onReserve: () => void;
}

const AMENITY_OPTIONS = [
  {
    icon: Wifi,
    label: "WiFi Gratis",
    keys: ["wifi", "wi-fi", "internet"],
    color: "#007AFF",
  },
  {
    icon: Coffee,
    label: "Desayuno",
    keys: ["desayuno", "breakfast"],
    color: "#FF9500",
  },
  {
    icon: Dumbbell,
    label: "Gimnasio",
    keys: ["gimnasio", "gym", "fitness"],
    color: "#34C759",
  },
  {
    icon: Waves,
    label: "Piscina",
    keys: ["piscina", "pool"],
    color: "#5AC8FA",
  },
];

export function HotelDetails({ hotel, onBack, onReserve }: HotelDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [nights, setNights] = useState<number>(7);
  const formatDateInput = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const todayStr = formatDateInput(new Date());
  const [checkIn, setCheckIn] = useState<string>(todayStr);

  const hotelTags = getTagsFromHotel(hotel);

  const isAmenityAvailable = (index: number) => {
    const entries: any[] = (hotel as any)?.amenities ?? [];
    const keys = AMENITY_OPTIONS[index]?.keys ?? [];
    return entries.some((e) => {
      if (!e && e !== 0) return false;
      const s = String(e).toLowerCase();
      return keys.some((k) => s.includes(k));
    });
  };

  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(() =>
    AMENITY_OPTIONS.map((_, i) => (isAmenityAvailable(i) ? i : -1)).filter(
      (i) => i !== -1
    )
  );
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [showReservationError, setShowReservationError] = useState(false);

  const handleReserveClick = () => {
    setShowTermsModal(true);
  };

  const handleAcceptTerms = async () => {
    setShowTermsModal(false);
    setIsReserving(true);

    // Parse the YYYY-MM-DD input as a local date (avoid Date("YYYY-MM-DD") which is parsed as UTC)
    const [y, m, d] = checkIn.split("-").map((v) => Number(v));
    const checkInDate = new Date(y, (m || 1) - 1, d || 1);
    // Add nights in local time to avoid timezone shifts (use setDate)
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + nights);

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          hotelId: hotel._id,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          nights,
          services: selectedAmenities.map((i) => AMENITY_OPTIONS[i].label),
        }),
      });
      setIsReserving(false);
      setReservationComplete(true);
      setTimeout(() => {
        onReserve();
      }, 2000);
    } catch (error) {
      setIsReserving(false);
      setShowReservationError(true);
      setTimeout(() => {
        setShowReservationError(false);
      }, 3000);
    }
  };

  const resolveImage = (h: any) => {
    const imgs = h?.images;
    if (!imgs) return "";
    if (Array.isArray(imgs)) return imgs[0] ?? "";
    if (typeof imgs === "object" && imgs !== null) {
      if (typeof imgs.main === "string") return imgs.main;
      const normalizeEntry = (e: any) => {
        if (!e && e !== 0) return "";
        if (typeof e === "string") return e;
        if (typeof e === "object") return e.url ?? e.src ?? e.path ?? "";
        return "";
      };

      if (typeof imgs.main === "string") return imgs.main;
      if (Array.isArray(imgs.main))
        return (
          normalizeEntry(imgs.main[0]) ?? normalizeEntry(imgs.others?.[0]) ?? ""
        );
      return normalizeEntry(imgs.others?.[0]) ?? "";
    }
    if (typeof imgs === "string") return imgs;
    return "";
  };

  const galleryImages: string[] = (() => {
    const imgs = (hotel as any)?.images;
    if (!imgs) return [];
    if (Array.isArray(imgs)) {
      return imgs.length > 1
        ? imgs
            .slice(1)
            .map((e: any) =>
              typeof e === "string" ? e : e?.url ?? e?.src ?? ""
            )
        : imgs.map((e: any) =>
            typeof e === "string" ? e : e?.url ?? e?.src ?? ""
          );
    }
    if (typeof imgs === "object" && imgs !== null) {
      const others = imgs.others ?? [];
      if (Array.isArray(others) && others.length > 0)
        return others.map((e: any) =>
          typeof e === "string" ? e : e?.url ?? e?.src ?? ""
        );
      if (imgs.main)
        return [
          typeof imgs.main === "string"
            ? imgs.main
            : imgs.main?.[0] ?? imgs.main?.url ?? imgs.main?.src ?? "",
        ];
      return [];
    }
    if (typeof imgs === "string") return [imgs];
    return [];
  })();

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 transition-colors"
            style={{ borderRadius: "50%" }}
          >
            <ChevronLeft size={24} style={{ color: "#007AFF" }} />
          </button>
          <motion.button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 -mr-2 hover:bg-gray-100 transition-colors"
            style={{ borderRadius: "50%" }}
            whileTap={{ scale: 0.85 }}
          >
            <motion.div
              animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={24}
                fill={isFavorite ? "#FF2D55" : "none"}
                style={{ color: isFavorite ? "#FF2D55" : "#6B7280" }}
              />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <ImageWithFallback
          src={resolveImage(hotel)}
          alt={hotel.name}
          className="w-full h-80 object-cover"
        />
        <div
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg"
          style={{ borderRadius: "20px" }}
        >
          <div className="flex items-center gap-1">
            <Star size={16} fill="#FFD700" style={{ color: "#FFD700" }} />
            <span className="ml-1">{hotel.averageRating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Hotel Name and Location */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">{hotel.name}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            <span>{hotel.location.city},</span>
            <span>{hotel.location.country}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {hotelTags.map((tag, index) => (
              <div
                key={index}
                className="px-4 py-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: `${tag.color}1A`, // 1A = 10% opacity in hex
                  borderRadius: "20px",
                  border: `1.5px solid ${tag.color}`,
                }}
              >
                <span style={{ fontWeight: 500, color: tag.color }}>
                  {tag.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-3">Sobre este hotel</h3>
          <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
        </div>

        {/* Amenities */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4">Servicios</h3>
          <div className="grid grid-cols-2 gap-4">
            {AMENITY_OPTIONS.map((amenity, index) => {
              const Icon = amenity.icon as any;
              const available = isAmenityAvailable(index);
              const isSelected = selectedAmenities.includes(index);
              const isUnavailable = !available;
              return (
                <button
                  key={index}
                  // Make services non-interactive: available amenities are pre-selected
                  // and cannot be deselected by the user. Unavailable remain disabled.
                  disabled={true}
                  aria-disabled={true}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-3 p-4`}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: isUnavailable
                      ? "rgba(0,122,255,0.12)"
                      : isSelected
                      ? "#007AFF"
                      : "white",
                    border: "none",
                    cursor: "default",
                  }}
                >
                  <div
                    className="p-2 flex-shrink-0"
                    style={{
                      // Only show selected styling when the amenity is selected.
                      backgroundColor: isSelected ? "white" : "#007AFF",
                      opacity: isUnavailable ? 0.5 : 1,
                      borderRadius: "12px",
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        color: isSelected ? "#007AFF" : "white",
                        opacity: isUnavailable ? 0.6 : 1,
                      }}
                    />
                  </div>

                  <span
                    className="flex-1 text-left"
                    style={{ color: isSelected ? "white" : "#007AFF" }}
                  >
                    {amenity.label}
                  </span>

                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      backgroundColor: isSelected ? "#007AFF" : "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      border:
                        !isSelected && !isUnavailable
                          ? "2px solid #007AFF"
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSelected ? (
                      <Check
                        size={14}
                        style={{
                          color: "white",
                        }}
                      />
                    ) : (
                      <div style={{ width: 14, height: 14 }} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4">Galería</h3>
          <div className="grid grid-cols-2 gap-3">
            {galleryImages.map((image, index) => (
              <div key={index}>
                <ImageWithFallback
                  key={index}
                  src={image}
                  alt={`Hotel gallery ${index + 1}`}
                  className="w-full h-40 object-cover"
                  style={{ borderRadius: "20px" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Summary */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4">Reseñas</h3>
          <div className="p-6 bg-gray-50" style={{ borderRadius: "24px" }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl mb-1" style={{ color: "#007AFF" }}>
                  {hotel.averageRating}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={
                        i < Math.floor(hotel.averageRating) ? "#FFD700" : "none"
                      }
                      style={{
                        color:
                          i < Math.floor(hotel.averageRating)
                            ? "#FFD700"
                            : "#D1D5DB",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600">Basado en 1,234 reseñas</p>
                <p className="text-gray-500 text-sm mt-1">
                  "Excelente ubicación y servicio impecable"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price and Reserve Button Section */}
      <div
        className="bg-gray-50 px-6 py-6 mx-6 mb-6"
        style={{
          borderRadius: "24px",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-gray-600 text-sm">Precio por noche</p>
            <p className="text-gray-900 text-2xl">{hotel.pricePerNight}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <label className="text-sm text-gray-600">Check-in</label>
            <input
              type="date"
              value={checkIn}
              min={todayStr}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-40 text-center py-2 rounded-lg border border-gray-200 bg-white"
            />
            <label className="text-sm text-gray-600">Noches</label>
            <input
              type="number"
              min={1}
              max={30}
              value={nights}
              onChange={(e) =>
                setNights(
                  Math.max(1, Math.min(30, Number(e.target.value || 1)))
                )
              }
              className="w-24 text-center py-2 rounded-lg border border-gray-200"
            />
            <div className="text-right text-sm text-gray-600">
              Total: {(hotel.pricePerNight * nights).toFixed(2)}
            </div>
          </div>
          <button
            onClick={handleReserveClick}
            disabled={
              isReserving || reservationComplete || showReservationError
            }
            className="px-8 py-4 text-white transition-all hover:opacity-90 active:scale-95 shadow-md disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[180px]"
            style={{
              backgroundColor: showReservationError
                ? "#FF3B30"
                : reservationComplete
                ? "#34C759"
                : "#007AFF",
              borderRadius: "24px",
            }}
          >
            <AnimatePresence mode="wait">
              {isReserving ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="animate-spin" size={20} />
                  <span>Procesando...</span>
                </motion.div>
              ) : showReservationError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <XCircle size={20} />
                  <span>Error al Reservar</span>
                </motion.div>
              ) : reservationComplete ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  <span>¡Reservado!</span>
                </motion.div>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Reservar Ahora
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" />

      {/* Terms and Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent
          className="max-w-md mx-auto"
          style={{
            borderRadius: "24px",
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-3"
                style={{
                  backgroundColor: "#007AFF1A",
                  borderRadius: "16px",
                }}
              >
                <FileText size={24} style={{ color: "#007AFF" }} />
              </div>
              <DialogTitle style={{ margin: 0 }}>
                Condiciones de Reserva
              </DialogTitle>
            </div>
            <DialogDescription>
              Por favor, lee y acepta nuestras condiciones antes de continuar
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto py-4" style={{ maxHeight: "50vh" }}>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2" style={{ color: "#007AFF" }}>
                  1. Política de Cancelación
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Puedes cancelar sin cargo hasta 48 horas antes de la fecha de
                  check-in. Cancelaciones posteriores tendrán un cargo del 50%
                  del total de la reserva.
                </p>
              </div>

              <div>
                <h4 className="mb-2" style={{ color: "#007AFF" }}>
                  2. Check-in y Check-out
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  El check-in es a partir de las 15:00 hrs y el check-out hasta
                  las 12:00 hrs. Check-in anticipado y check-out tardío están
                  sujetos a disponibilidad.
                </p>
              </div>

              <div>
                <h4 className="mb-2" style={{ color: "#007AFF" }}>
                  3. Métodos de Pago
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Aceptamos tarjetas de crédito y débito principales. Se
                  requiere un depósito del 30% al momento de la reserva.
                </p>
              </div>

              <div>
                <h4 className="mb-2" style={{ color: "#007AFF" }}>
                  4. Política de Mascotas
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Las mascotas son bienvenidas con un cargo adicional de $25 por
                  noche. Notifícanos con anticipación para preparar tu
                  habitación.
                </p>
              </div>

              <div>
                <h4 className="mb-2" style={{ color: "#007AFF" }}>
                  5. Daños y Responsabilidad
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  El huésped es responsable de cualquier daño causado durante su
                  estancia. Se podrán aplicar cargos adicionales según sea
                  necesario.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowTermsModal(false)}
              className="flex-1 py-3 transition-all hover:opacity-80 active:scale-95 text-center"
              style={{
                backgroundColor: "#F3F4F6",
                color: "#6B7280",
                borderRadius: "16px",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleAcceptTerms}
              className="flex-1 py-3 text-white transition-all hover:opacity-90 active:scale-95 text-center"
              style={{
                backgroundColor: "#007AFF",
                borderRadius: "16px",
              }}
            >
              Aceptar y Reservar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
