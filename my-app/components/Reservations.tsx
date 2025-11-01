"use client";

import {
  Calendar,
  MapPin,
  ChevronRight,
  Clock,
  ArrowRight,
  X,
  AlertTriangle,
  Wifi,
  Coffee,
  Dumbbell,
  Users,
  CreditCard,
  Phone,
  Mail,
  FileText,
  Check,
  XCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BottomNav } from "./BottomNav";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { useNavigation } from "../contexts/NavigationContext";
import { motion, AnimatePresence } from "framer-motion";

interface Reservation {
  id: string | number;
  hotelName: string;
  location: string;
  // support both the legacy imageUrl and a possible images.main field
  imageUrl?: string;
  images?: { main?: string; others?: string[] } | string[];
  checkIn: string;
  checkOut: string;
  confirmationNumber: string;
  status: "upcoming" | "completed";
  nights: number;
  price: string;
  tags?: { label: string; color: string }[];
}

const allHotelTags = [
  { label: "Minimalista", color: "#007AFF" },
  { label: "Para Amigos", color: "#FF9500" },
  { label: "Familiar", color: "#34C759" },
  { label: "Romántico", color: "#FF2D55" },
  { label: "Lujo", color: "#AF52DE" },
  { label: "Playa", color: "#5AC8FA" },
  { label: "Negocios", color: "#FF9500" },
  { label: "Aventura", color: "#34C759" },
];

// Function to get random tags for a hotel based on its ID
const getHotelTags = (hotelId: number) => {
  const seed = hotelId;
  const count = 2 + (seed % 3); // 2-4 tags
  const shuffled = [...allHotelTags].sort(
    () => ((seed * 9301 + 49297) % 233280) - 116640
  );
  return shuffled.slice(0, count);
};

export function Reservations() {
  const { navigateToHome } = useNavigation();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [upcomingReservations, setUpcomingReservations] = useState<
    Reservation[]
  >([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);

  React.useEffect(() => {
    fetch(`/api/bookings`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data?.bookings ?? [];
        const mapped = raw.map((r: any) => ({
          id: r._id,
          hotelName: r.hotelName ?? "Hotel",
          location:
            (r.location && typeof r.location === "string" && r.location) || "",
          imageUrl:
            r.imageUrl ??
            (Array.isArray(r.hotel?.images)
              ? r.hotel?.images[0]
              : (r.hotel?.images as any)?.main) ??
            "",
          checkIn: r.checkInDate
            ? new Date(r.checkInDate).toLocaleDateString()
            : "",
          checkOut: r.checkOutDate
            ? new Date(r.checkOutDate).toLocaleDateString()
            : "",
          confirmationNumber: r.confirmationNumber ?? "",
          status: "upcoming",
          nights:
            r.checkInDate && r.checkOutDate
              ? Math.ceil(
                  (new Date(r.checkOutDate).getTime() -
                    new Date(r.checkInDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0,
          price: r.price ?? "",
          tags: getHotelTags(r.hotelId ?? 1),
        }));
        setUpcomingReservations(mapped);
      })
      .catch((err) => {
        console.error(
          "Error fetching bookings for reservations component:",
          err
        );
      });
  }, []);

  const handleRemoveReservation = (id: string | number) => {
    setUpcomingReservations((prev) => prev.filter((r) => r.id !== id));
  };

  React.useEffect(() => {

    fetch(`/api/bookings/history`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data?.bookings ?? [];
        const mapped = raw.map((r: any) => ({
          id: r._id,
          hotelName: r.hotelName ?? "Hotel",
          location:
            (r.location && typeof r.location === "string" && r.location) || "",
          imageUrl:
            r.imageUrl ??
            (Array.isArray(r.hotel?.images)
              ? r.hotel?.images[0]
              : (r.hotel?.images as any)?.main) ??
            "",
          checkIn: r.checkInDate
            ? new Date(r.checkInDate).toLocaleDateString()
            : "",
          checkOut: r.checkOutDate
            ? new Date(r.checkOutDate).toLocaleDateString()
            : "",
          confirmationNumber: r.confirmationNumber ?? "",
          status: "completed",
          nights:
            r.checkInDate && r.checkOutDate
              ? Math.ceil(
                  (new Date(r.checkOutDate).getTime() -
                    new Date(r.checkInDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0,
          price: r.price ?? "",
          tags: getHotelTags(
            r.hotelId ?? (r.hotel?._id ? Number(r.hotel._id) : 1)
          ),
        }));
        setPastReservations(mapped);
      })
      .catch((err) => {
        console.error("Error fetching past bookings:", err);
      });
  }, []);

  // Show only first 6 past reservations unless expanded (2 rows of 3)
  const displayedPastReservations = showAllHistory
    ? pastReservations
    : pastReservations.slice(0, 6);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div
        className="px-6 py-8"
        style={{
          background: "linear-gradient(135deg, #007AFF 0%, #0051D5 100%)",
          borderRadius: "0 0 32px 32px",
        }}
      >
        <h1 className="text-white text-center mb-2">Mis Reservas</h1>
        <p className="text-white/80 text-center">
          Gestiona tus viajes pasados y futuros
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Upcoming Reservations Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Reservas Próximas</h2>
            <div
              className="px-3 py-1.5"
              style={{
                backgroundColor: "#007AFF1A",
                borderRadius: "12px",
              }}
            >
              <span style={{ color: "#007AFF" }}>
                {upcomingReservations.length}
              </span>
            </div>
          </div>

          {upcomingReservations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  isUpcoming={true}
                  onRemove={handleRemoveReservation}
                />
              ))}
            </div>
          ) : (
            <div
              className="p-8 text-center"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "24px",
              }}
            >
              <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No tienes reservas próximas</p>
              <button
                onClick={navigateToHome}
                className="mt-4 px-6 py-3 text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: "#007AFF",
                  borderRadius: "20px",
                }}
              >
                Explorar Hoteles
              </button>
            </div>
          )}
        </div>

        {/* Past Reservations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Historial de Viajes</h2>
            <div
              className="px-3 py-1.5"
              style={{
                backgroundColor: "#6B72801A",
                borderRadius: "12px",
              }}
            >
              <span className="text-gray-600">{pastReservations.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedPastReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                isUpcoming={false}
              />
            ))}
          </div>

          {/* View All Button - Only show if there are more than 6 reservations */}
          {!showAllHistory && pastReservations.length > 6 && (
            <button
              onClick={() => setShowAllHistory(true)}
              className="w-full mt-6 py-4 transition-all hover:opacity-80 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "20px",
                border: "2px solid #E5E7EB",
              }}
            >
              <span style={{ color: "#007AFF" }}>
                Ver Todo el Historial ({pastReservations.length - 6} más)
              </span>
              <ArrowRight size={18} style={{ color: "#007AFF" }} />
            </button>
          )}

          {/* Show Less Button - Only show when expanded */}
          {showAllHistory && pastReservations.length > 6 && (
            <button
              onClick={() => setShowAllHistory(false)}
              className="w-full mt-6 py-4 transition-all hover:opacity-80 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#007AFF",
                borderRadius: "20px",
              }}
            >
              <span className="text-white">Mostrar Menos</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="bookings" />
    </div>
  );
}


function ReservationCard({
  reservation,
  isUpcoming,
  onRemove,
}: {
  reservation: Reservation;
  isUpcoming: boolean;
  onRemove?: (id: string | number) => void;
}) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [showCancelError, setShowCancelError] = useState(false);

  const handleCancelReservation = () => {
    setIsCanceling(true);

    (async () => {
      try {
        const res = await fetch(`/api/bookings/${reservation.id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });

        setIsCanceling(false);

        if (!res.ok) {

          setShowCancelError(true);
          setTimeout(() => {
            setShowCancelError(false);
            setShowCancelModal(false);
          }, 3000);
          return;
        }


        setIsCanceled(true);
        setTimeout(() => {
          setShowCancelModal(false);

          setTimeout(() => {
            if (onRemove) onRemove(reservation.id);
          }, 300);
        }, 1200);
      } catch (e) {
        console.error("Cancel booking error:", e);
        setIsCanceling(false);
        setShowCancelError(true);
        setTimeout(() => {
          setShowCancelError(false);
          setShowCancelModal(false);
        }, 3000);
      }
    })();
  };

  return (
    <>
      <div
        className="overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: isUpcoming ? "#007AFF" : "#F9FAFB",
          borderRadius: "20px",
          border: isUpcoming ? "none" : "1px solid #E5E7EB",
        }}
      >
        {/* Image */}
        <div className="relative h-44">
          <ImageWithFallback
            src={
              (reservation as any).images?.main ?? reservation.imageUrl ?? ""
            }
            alt={reservation.hotelName}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute top-2 right-2 px-2.5 py-1.5 backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "10px",
            }}
          >
            <span className="text-xs" style={{ color: "#007AFF" }}>
              {reservation.nights}N
            </span>
          </div>
          {isUpcoming && (
            <div
              className="absolute top-2 left-2 px-2.5 py-1.5 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(52, 199, 89, 0.95)",
                borderRadius: "10px",
              }}
            >
              <span className="text-xs text-white">Próxima</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3
            className="mb-1 line-clamp-1"
            style={{
              color: isUpcoming ? "white" : "#111827",
              fontSize: "16px",
            }}
          >
            {reservation.hotelName}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            <MapPin
              size={14}
              style={{ color: isUpcoming ? "#ffffff99" : "#6B7280" }}
            />
            <span
              className="text-xs line-clamp-1"
              style={{ color: isUpcoming ? "#ffffff99" : "#6B7280" }}
            >
              {reservation.location}
            </span>
          </div>

          {/* Hotel Tags */}
          {reservation.tags && reservation.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {reservation.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs"
                  style={{
                    backgroundColor: isUpcoming
                      ? "rgba(255, 255, 255, 0.2)"
                      : `${tag.color}15`,
                    color: isUpcoming ? "white" : tag.color,
                    borderRadius: "10px",
                    border: isUpcoming
                      ? "1px solid rgba(255, 255, 255, 0.3)"
                      : `1px solid ${tag.color}30`,
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          {/* Dates - Compact Version */}
          <div
            className="p-3 mb-3"
            style={{
              backgroundColor: isUpcoming
                ? "rgba(255, 255, 255, 0.15)"
                : "white",
              borderRadius: "12px",
              border: isUpcoming
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <p
                  className="text-xs mb-0.5"
                  style={{ color: isUpcoming ? "#ffffff99" : "#9CA3AF" }}
                >
                  Check-in
                </p>
                <p
                  className="text-xs"
                  style={{ color: isUpcoming ? "white" : "#111827" }}
                >
                  {reservation.checkIn}
                </p>
              </div>
              <ChevronRight
                size={16}
                style={{ color: isUpcoming ? "#ffffff66" : "#D1D5DB" }}
              />
              <div className="flex-1">
                <p
                  className="text-xs mb-0.5"
                  style={{ color: isUpcoming ? "#ffffff99" : "#9CA3AF" }}
                >
                  Check-out
                </p>
                <p
                  className="text-xs"
                  style={{ color: isUpcoming ? "white" : "#111827" }}
                >
                  {reservation.checkOut}
                </p>
              </div>
            </div>
          </div>

          {/* Price & Confirmation */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p
                className="text-xs"
                style={{ color: isUpcoming ? "#ffffff99" : "#9CA3AF" }}
              >
                {reservation.confirmationNumber}
              </p>
            </div>
            <div>
              <p
                className="text-sm"
                style={{ color: isUpcoming ? "white" : "#007AFF" }}
              >
                {reservation.price}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {isUpcoming ? (
            <div className="space-y-2">
              <button
                onClick={() => setShowDetailsModal(true)}
                className="w-full py-2.5 transition-all hover:opacity-90 active:scale-95 text-sm flex items-center justify-center"
                style={{
                  backgroundColor: "white",
                  color: "#007AFF",
                  borderRadius: "12px",
                }}
              >
                Ver Detalles
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-2.5 transition-all hover:opacity-90 active:scale-95 text-sm flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                Cancelar Reserva
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDetailsModal(true)}
              className="w-full py-2.5 transition-all hover:opacity-90 active:scale-95 text-sm flex items-center justify-center"
              style={{
                backgroundColor: "#007AFF",
                color: "white",
                borderRadius: "12px",
              }}
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{
            borderRadius: "24px",
            border: "none",
          }}
        >
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "#007AFF15",
                  borderRadius: "14px",
                }}
              >
                <FileText size={24} style={{ color: "#007AFF" }} />
              </div>
              <div>
                <DialogTitle
                  className="text-2xl text-left"
                  style={{ color: "#111827" }}
                >
                  Detalles de la Reserva
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-0.5">
                  Confirmación: {reservation.confirmationNumber}
                </p>
              </div>
            </div>
            <DialogDescription className="sr-only">
              Información completa de tu reserva en {reservation.hotelName}
            </DialogDescription>
          </DialogHeader>

          {/* Hotel Image */}
          <div
            className="relative h-64 -mx-6 mb-4 overflow-hidden"
            style={{ borderRadius: "0" }}
          >
            <ImageWithFallback
              src={
                (reservation as any).images?.main ?? reservation.imageUrl ?? ""
              }
              alt={reservation.hotelName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hotel Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-900 mb-1">{reservation.hotelName}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={16} />
                <span className="text-sm">{reservation.location}</span>
              </div>

              {/* Hotel Tags in Modal */}
              {reservation.tags && reservation.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {reservation.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm"
                      style={{
                        backgroundColor: `${tag.color}15`,
                        color: tag.color,
                        borderRadius: "12px",
                        border: `1px solid ${tag.color}30`,
                      }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reservation Type */}
            <div
              className="p-4"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "16px",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">
                  Tipo de Habitación
                </span>
                <span className="text-gray-900">Habitación Deluxe</span>
              </div>
            </div>

            {/* Dates */}
            <div
              className="p-4"
              style={{
                backgroundColor: "#007AFF0D",
                borderRadius: "16px",
                border: "1px solid #007AFF33",
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Check-in</p>
                  <p className="text-gray-900">{reservation.checkIn}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    A partir de las 3:00 PM
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Check-out</p>
                  <p className="text-gray-900">{reservation.checkOut}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hasta las 11:00 AM
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {reservation.nights}{" "}
                  {reservation.nights === 1 ? "noche" : "noches"} de estadía
                </p>
              </div>
            </div>

            {/* Guest Details */}
            <div
              className="p-4 space-y-3"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "16px",
              }}
            >
              <h4 className="text-gray-900">Información del Huésped</h4>
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={16} />
                <span className="text-sm">2 Adultos</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">guest@example.com</span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-gray-900 mb-3">Servicios Incluidos</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Wifi size={16} style={{ color: "#007AFF" }} />
                  <span className="text-sm">WiFi Gratis</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Coffee size={16} style={{ color: "#007AFF" }} />
                  <span className="text-sm">Desayuno</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Dumbbell size={16} style={{ color: "#007AFF" }} />
                  <span className="text-sm">Gimnasio</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard size={16} style={{ color: "#007AFF" }} />
                  <span className="text-sm">Estacionamiento</span>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div
              className="p-4"
              style={{
                backgroundColor: "#007AFF",
                borderRadius: "16px",
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/80 text-sm">Precio Total</p>
                  <p className="text-xs text-white/60 mt-1">
                    Incluye impuestos y cargos
                  </p>
                </div>
                <p className="text-2xl text-white">{reservation.price}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowDetailsModal(false)}
            className="w-full py-3 mt-2 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center"
            style={{
              backgroundColor: "#F3F4F6",
              color: "#6B7280",
              borderRadius: "12px",
            }}
          >
            Cerrar
          </button>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent
          className="max-w-md"
          style={{
            borderRadius: "24px",
            border: "none",
          }}
        >
          <AnimatePresence mode="wait">
            {!isCanceling && !isCanceled && !showCancelError ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-16 h-16 flex items-center justify-center"
                      style={{
                        backgroundColor: "#FEE2E2",
                        borderRadius: "50%",
                      }}
                    >
                      <AlertTriangle size={32} style={{ color: "#EF4444" }} />
                    </div>
                  </div>
                  <DialogTitle
                    className="text-center text-xl"
                    style={{ color: "#111827" }}
                  >
                    ¿Cancelar Reserva?
                  </DialogTitle>
                  <DialogDescription className="text-center pt-2">
                    Estás a punto de cancelar tu reserva en{" "}
                    <strong>{reservation.hotelName}</strong> para el{" "}
                    {reservation.checkIn}.
                  </DialogDescription>
                </DialogHeader>

                <div
                  className="p-4 my-4"
                  style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    border: "1px solid #FCD34D",
                  }}
                >
                  <p className="text-sm text-gray-800">
                    <strong>Nota:</strong> Dependiendo de la política de
                    cancelación, podrías no recibir un reembolso completo.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-3 transition-all hover:opacity-80 active:scale-95 flex items-center justify-center"
                    style={{
                      backgroundColor: "#F3F4F6",
                      color: "#6B7280",
                      borderRadius: "12px",
                    }}
                  >
                    No, Mantener
                  </button>
                  <button
                    onClick={handleCancelReservation}
                    className="flex-1 py-3 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center"
                    style={{
                      backgroundColor: "#EF4444",
                      color: "white",
                      borderRadius: "12px",
                    }}
                  >
                    Sí, Cancelar
                  </button>
                </div>
              </motion.div>
            ) : isCanceling && !isCanceled && !showCancelError ? (
              <motion.div
                key="canceling"
                className="py-12 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#FEE2E2" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock size={40} style={{ color: "#EF4444" }} />
                </motion.div>
                <h3 className="text-xl mb-2" style={{ color: "#111827" }}>
                  Cancelando Reserva
                </h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Por favor espera...
                </p>
              </motion.div>
            ) : isCanceled && !showCancelError ? (
              <motion.div
                key="canceled"
                className="py-12 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#DCFCE7" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Check
                      size={40}
                      style={{ color: "#22C55E" }}
                      strokeWidth={3}
                    />
                  </motion.div>
                </motion.div>
                <motion.h3
                  className="text-xl mb-2"
                  style={{ color: "#111827" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  ¡Reserva Cancelada!
                </motion.h3>
                <motion.p
                  className="text-sm"
                  style={{ color: "#6B7280" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Se procesará tu reembolso pronto
                </motion.p>
              </motion.div>
            ) : showCancelError ? (
              <motion.div
                key="error"
                className="py-12 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#FEE2E2" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  <XCircle
                    size={40}
                    style={{ color: "#EF4444" }}
                    strokeWidth={2.5}
                  />
                </motion.div>
                <motion.h3
                  className="text-xl mb-2"
                  style={{ color: "#111827" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Error al Cancelar
                </motion.h3>
                <motion.p
                  className="text-sm text-center px-6"
                  style={{ color: "#6B7280" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  No se pudo cancelar la reserva. Intenta de nuevo más tarde.
                </motion.p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
