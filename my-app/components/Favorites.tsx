"use client";

import { Heart, MapPin, Star, Trash2, HeartCrack } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BottomNav } from "./BottomNav";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "../contexts/NavigationContext";
import { useSelectedHotel } from "../contexts/SelectedHotelContext";

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  imageUrl: string;
}

interface FavoritesProps {
  onHotelClick?: (hotel: Hotel) => void;
}

export function Favorites({ onHotelClick }: FavoritesProps) {
  const { navigateToHome, navigateToHotelDetails } = useNavigation();
  const { setSelectedHotel } = useSelectedHotel();

  // Mock data for favorite hotels
  const [favorites, setFavorites] = useState<Hotel[]>([
    {
      id: 1,
      name: "Grand Luxury Resort",
      location: "Cancún, México",
      price: "$250",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTUwNDI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      name: "Ocean View Paradise",
      location: "Miami Beach, USA",
      price: "$320",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1729605412184-8d796f9c6f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhvdGVsfGVufDF8fHx8MTc2MDg5MDI3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 4,
      name: "Boutique Casa Blanca",
      location: "Barcelona, España",
      price: "$280",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1649731000184-7ced04998f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsfGVufDF8fHx8MTc2MDg4NjQwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 5,
      name: "Infinity Pool Sanctuary",
      location: "Santorini, Grecia",
      price: "$420",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGluZmluaXR5JTIwcG9vbHxlbnwxfHx8fDE3NjA5Nzg0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 6,
      name: "Luxury Suite Collection",
      location: "París, Francia",
      price: "$390",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGJlZHJvb218ZW58MXx8fHwxNzYwOTA5MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 8,
      name: "Coastal Villa Resort",
      location: "Amalfi, Italia",
      price: "$350",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1709744873177-714d7ab0fe02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwaG90ZWwlMjB2aWV3fGVufDF8fHx8MTc2MDk3ODQ1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 10,
      name: "Urban Skyline Hotel",
      location: "Nueva York, USA",
      price: "$200",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwaG90ZWwlMjBuaWdodHxlbnwxfHx8fDE3NjA5Nzc5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 12,
      name: "Coastal Breeze Resort",
      location: "Maldivas",
      price: "$350",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1641150557653-e4c409426e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBiZWFjaCUyMGFlcmlhbHxlbnwxfHx8fDE3NjA5Nzc5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 19,
      name: "Royal Palace Hotel",
      location: "Dubai, UAE",
      price: "$380",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTUwNDI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((hotel) => hotel.id !== id));
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div
        className="px-6 py-8"
        style={{
          background: "linear-gradient(135deg, #FF2D55 0%, #D5004F 100%)",
          borderRadius: "0 0 32px 32px",
        }}
      >
        <h1 className="text-white text-center mb-2">Mis Favoritos</h1>
        <p className="text-white/80 text-center">
          Tus hoteles guardados para futuras reservas
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {favorites.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900">Hoteles Guardados</h2>
              <div
                className="px-3 py-1.5"
                style={{
                  backgroundColor: "#FF2D551A",
                  borderRadius: "12px",
                }}
              >
                <span style={{ color: "#FF2D55" }}>{favorites.length}</span>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((hotel) => (
                  <motion.div
                    key={hotel.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FavoriteCard
                      hotel={hotel}
                      onRemove={removeFavorite}
                      onClick={() => {
                        setSelectedHotel(hotel);
                        if (onHotelClick) {
                          onHotelClick(hotel);
                        } else {
                          navigateToHotelDetails?.(hotel.id);
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </>
        ) : (
          <div
            className="p-12 text-center"
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: "24px",
            }}
          >
            <Heart size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-gray-900 mb-2">No tienes favoritos aún</h3>
            <p className="text-gray-500 mb-6">
              Guarda hoteles que te gusten para encontrarlos fácilmente
            </p>
            <button
              onClick={navigateToHome}
              className="px-6 py-3 text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "#FF2D55",
                borderRadius: "20px",
              }}
            >
              Explorar Hoteles
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="favorites" />
    </div>
  );
}

// Favorite Card Component
function FavoriteCard({
  hotel,
  onRemove,
  onClick,
}: {
  hotel: Hotel;
  onRemove: (id: number) => void;
  onClick: () => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(hotel.id);
    }, 300);
  };

  return (
    <motion.div
      className="overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      style={{
        backgroundColor: "#F9FAFB",
        borderRadius: "20px",
        border: "1px solid #E5E7EB",
      }}
      animate={
        isRemoving ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }
      }
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48">
        <ImageWithFallback
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <motion.button
          onClick={handleRemove}
          onMouseEnter={() => setIsHoveringHeart(true)}
          onMouseLeave={() => setIsHoveringHeart(false)}
          className="absolute top-2 right-2 p-2 backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "12px",
          }}
          whileTap={{ scale: 0.85 }}
        >
          <motion.div
            animate={
              isHoveringHeart
                ? { scale: 1.1, rotate: [0, -10, 10, -10, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isHoveringHeart ? (
                <motion.div
                  key="broken"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <HeartCrack
                    size={20}
                    fill="#FF2D55"
                    style={{ color: "#FF2D55" }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart
                    size={20}
                    fill="#FF2D55"
                    style={{ color: "#FF2D55" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
        <div
          className="absolute bottom-2 right-2 px-2.5 py-1.5 backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "10px",
          }}
        >
          <div className="flex items-center gap-1">
            <Star size={14} fill="#FFD700" style={{ color: "#FFD700" }} />
            <span className="text-xs">{hotel.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="mb-1 line-clamp-1"
          style={{
            color: "#111827",
            fontSize: "16px",
          }}
        >
          {hotel.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={14} style={{ color: "#6B7280" }} />
          <span className="text-xs line-clamp-1 text-gray-600">
            {hotel.location}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Por noche</p>
            <p className="text-lg" style={{ color: "#FF2D55" }}>
              {hotel.price}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="px-4 py-2 text-white text-sm transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: "#FF2D55",
              borderRadius: "12px",
            }}
          >
            Ver Hotel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
