"use client";

import { ChevronLeft, Star, MapPin, Wifi, Coffee, Dumbbell, Waves, Heart, Check, Loader2, CheckCircle2, FileText, XCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BottomNav } from "./BottomNav";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface Hotel {
    _id:string;
    name: string;
    description: string;
    location:{
        city: string;
        country: string;
    },
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

const hotelTags = [
  { label: "Minimalista", color: "#007AFF" },
  { label: "Para Amigos", color: "#FF9500" },
  { label: "Familiar", color: "#34C759" },
  { label: "Romántico", color: "#FF2D55" },
  { label: "Lujo", color: "#AF52DE" },
  { label: "Playa", color: "#5AC8FA" },
];

const amenities = [
  { icon: Wifi, label: "WiFi Gratis" },
  { icon: Coffee, label: "Desayuno" },
  { icon: Dumbbell, label: "Gimnasio" },
  { icon: Waves, label: "Piscina" },
];

export function HotelDetails({ hotel, onBack, onReserve }: HotelDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([0, 2]); // Preselected: WiFi and Gym
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

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsReserving(false);
    
    // Para simular error al reservar, descomenta la siguiente línea:
    // const hasError = hotel.id === 1;
    const hasError = false;
    
    if (hasError) {
      setShowReservationError(true);
      setTimeout(() => {
        setShowReservationError(false);
      }, 3000);
    } else {
      setReservationComplete(true);
      // Show success for 2 seconds then call onReserve
      setTimeout(() => {
        onReserve();
      }, 2000);
    }
  };

  // Mock data for hotel details
  const galleryImages = [
    hotel.images[0],
    "https://images.unsplash.com/photo-1759303690206-1dc66e9ef8ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGFtZW5pdGllcyUyMHNwYXxlbnwxfHx8fDE3NjA5NzkzMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1543539571-2d88da875d21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlc3RhdXJhbnQlMjBkaW5pbmd8ZW58MXx8fHwxNzYwOTE3ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1757889693295-27cf12654c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHBvb2wlMjBsb3VuZ2V8ZW58MXx8fHwxNzYwOTc5MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ];

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
          src={hotel.images[0]}
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
          <p className="text-gray-600 leading-relaxed">
            Disfruta de una experiencia inolvidable en {hotel.name}. Nuestro hotel ofrece 
            habitaciones de lujo con vistas espectaculares, servicios de primera clase y una 
            ubicación privilegiada. Ya sea que viajes por negocios o placer, encontrarás todo 
            lo que necesitas para una estancia perfecta.
          </p>
        </div>

        {/* Amenities */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4">Servicios</h3>
          <div className="grid grid-cols-2 gap-4">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAmenities((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index]
                    );
                  }}
                  className="flex items-center gap-3 p-4 transition-all hover:scale-105 active:scale-95"
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "#007AFF",
                    border: "2px solid transparent",
                    borderColor:  "#007AFF",
                  }}
                >
                  <div
                    className="p-2 flex-shrink-0"
                    style={{
                      backgroundColor:  "white" ,
                      opacity:  1 ,
                      borderRadius: "12px",
                    }}
                  >
                    <Icon size={20} style={{ color:  "#007AFF", opacity: 1 }} />
                  </div>
                  <span className="flex-1 text-left" style={{ color: "white"  }}>
                    {amenity.label}
                  </span>

                    <div
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                      }}
                    >
                      <Check size={14} style={{ color: "#007AFF" }} />
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
            {galleryImages.slice(1).map((image, index) => (
              <ImageWithFallback
                key={index}
                src={image}
                alt={`Hotel gallery ${index + 1}`}
                className="w-full h-40 object-cover"
                style={{ borderRadius: "20px" }}
              />
            ))}
          </div>
        </div>

        {/* Reviews Summary */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4">Reseñas</h3>
          <div
            className="p-6 bg-gray-50"
            style={{ borderRadius: "24px" }}
          >
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
                      fill={i < Math.floor(hotel.averageRating) ? "#FFD700" : "none"}
                      style={{
                        color: i < Math.floor(hotel.averageRating) ? "#FFD700" : "#D1D5DB",
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
            borderRadius: '24px',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-gray-600 text-sm">Precio por noche</p>
              <p className="text-gray-900 text-2xl">{hotel.pricePerNight}</p>
            </div>
            <button
              onClick={handleReserveClick}
              disabled={isReserving || reservationComplete || showReservationError}
              className="px-8 py-4 text-white transition-all hover:opacity-90 active:scale-95 shadow-md disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[180px]"
              style={{
                backgroundColor: showReservationError ? "#FF3B30" : reservationComplete ? "#34C759" : "#007AFF",
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
      <BottomNav 
        activeTab="home"
      />

      {/* Terms and Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent 
          className="max-w-md mx-auto"
          style={{
            borderRadius: '24px',
            maxHeight: '90vh',
            overflow: 'hidden',
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-3"
                style={{
                  backgroundColor: '#007AFF1A',
                  borderRadius: '16px',
                }}
              >
                <FileText size={24} style={{ color: '#007AFF' }} />
              </div>
              <DialogTitle style={{ margin: 0 }}>Condiciones de Reserva</DialogTitle>
            </div>
            <DialogDescription>
              Por favor, lee y acepta nuestras condiciones antes de continuar
            </DialogDescription>
          </DialogHeader>

          <div 
            className="overflow-y-auto py-4"
            style={{ maxHeight: '50vh' }}
          >
            <div className="space-y-4">
              <div>
                <h4 className="mb-2" style={{ color: '#007AFF' }}>1. Política de Cancelación</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Puedes cancelar sin cargo hasta 48 horas antes de la fecha de check-in. 
                  Cancelaciones posteriores tendrán un cargo del 50% del total de la reserva.
                </p>
              </div>

              <div>
                <h4 className="mb-2" style={{ color: '#007AFF' }}>2. Check-in y Check-out</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  El check-in es a partir de las 15:00 hrs y el check-out hasta las 12:00 hrs. 
                  Check-in anticipado y check-out tardío están sujetos a disponibilidad.
                </p>
              </div>

              <div>
                <h4 className="mb-2" style={{ color: '#007AFF' }}>3. Métodos de Pago</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Aceptamos tarjetas de crédito y débito principales. Se requiere un depósito 
                  del 30% al momento de la reserva.
                </p>
              </div>

              <div>
                <h4 className="mb-2" style={{ color: '#007AFF' }}>4. Política de Mascotas</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Las mascotas son bienvenidas con un cargo adicional de $25 por noche. 
                  Notifícanos con anticipación para preparar tu habitación.
                </p>
              </div>

              <div>
                <h4 className="mb-2" style={{ color: '#007AFF' }}>5. Daños y Responsabilidad</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  El huésped es responsable de cualquier daño causado durante su estancia. 
                  Se podrán aplicar cargos adicionales según sea necesario.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowTermsModal(false)}
              className="flex-1 py-3 transition-all hover:opacity-80 active:scale-95 text-center"
              style={{
                backgroundColor: '#F3F4F6',
                color: '#6B7280',
                borderRadius: '16px',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleAcceptTerms}
              className="flex-1 py-3 text-white transition-all hover:opacity-90 active:scale-95 text-center"
              style={{
                backgroundColor: '#007AFF',
                borderRadius: '16px',
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
