"use client";

import { ChevronLeft, X, Search } from "lucide-react";
import { HotelCard } from "./HotelCard";
import { BottomNav } from "./BottomNav";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useNavigation } from "../contexts/NavigationContext";

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  images?: { main?: string; others?: string[] } | string[];
}

interface SearchResultsProps {
  searchQuery: string;
  hotels: Hotel[];
  onBack: () => void;
  onClearSearch: () => void;
  onHotelClick?: (hotel: Hotel) => void;
  onSearch?: (query: string) => void;
  initialExpanded?: boolean;
}

export function SearchResults({
  searchQuery,
  hotels,
  onBack,
  onClearSearch,
  onHotelClick,
  onSearch,
  initialExpanded = false,
}: SearchResultsProps) {
  const [isSearching, setIsSearching] = useState<boolean>(initialExpanded);
  const [isPerformingSearch, setIsPerformingSearch] = useState(false);
  const [newSearchValue, setNewSearchValue] = useState("");
  const handleHomeFromBottomNav = () => {
    onBack();
  };

  const handleSearchFromBottomNav = () => {
    setIsSearching(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const {
    setBottomHomeHandler,
    setBottomSearchHandler,
    openSearchOnMount,
    setOpenSearchOnMount,
  } = useNavigation();

  useEffect(() => {
    // Register handlers so BottomNav can invoke them while this screen is active
    setBottomHomeHandler(() => handleHomeFromBottomNav);
    setBottomSearchHandler(() => handleSearchFromBottomNav);

    // Cleanup when leaving the screen to avoid stale handlers
    return () => {
      setBottomHomeHandler(undefined);
      setBottomSearchHandler(undefined);
    };
    // include setters in deps so eslint/react-hooks won't warn; functions are stable from context
  }, [setBottomHomeHandler, setBottomSearchHandler]);

  // If navigation requested opening search on mount, open input and reset flag
  useEffect(() => {
    if (openSearchOnMount) {
      setIsSearching(true);
      setOpenSearchOnMount(false);
      // bring into view
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [openSearchOnMount, setOpenSearchOnMount]);

  const handleNewSearch = () => {
    if (newSearchValue.trim()) {
      setIsPerformingSearch(true);

      setTimeout(() => {
        onSearch?.(newSearchValue.trim());
        setIsSearching(false);
        setNewSearchValue("");
        setIsPerformingSearch(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNewSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 transition-colors"
            style={{ borderRadius: "50%" }}
          >
            <ChevronLeft size={24} style={{ color: "#007AFF" }} />
          </button>
          <h2 className="text-gray-900">Resultados de búsqueda</h2>
        </div>

        {/* Search Input - Active or Display Mode */}
        {isSearching ? (
          <div className="relative w-full">
            <Search
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              size={20}
              onClick={handleNewSearch}
            />
            <input
              type="text"
              value={newSearchValue}
              onChange={(e) => setNewSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setTimeout(() => {
                  if (!newSearchValue) {
                    setIsSearching(false);
                  }
                }, 200);
              }}
              placeholder="Buscar hoteles, destinos..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 outline-none shadow-sm focus:border-blue-400"
              style={{ borderRadius: "9999px" }}
              autoFocus
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-between px-5 py-3 gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsSearching(true)}
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: "9999px",
            }}
          >
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Buscaste:</p>
              <p className="text-gray-900">{searchQuery}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearSearch();
              }}
              className="p-2 hover:bg-gray-200 transition-colors"
              style={{ borderRadius: "50%" }}
              title="Limpiar búsqueda"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Results Content */}
      <div className="flex-1 px-6 py-6">
        {hotels.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">
              Encontramos {hotels.length}{" "}
              {hotels.length === 1 ? "hotel" : "hoteles"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotels.map((hotel) => {
                const h = hotel as any;
                const mappedHotel = {
                  id:
                    h.id ||
                    (h._id ? h._id.toString() : Math.random().toString()),
                  name: h.name,
                  location:
                    h.location && typeof h.location === "object"
                      ? `${h.location.city ?? ""}, ${h.location.country ?? ""}`
                      : h.location ?? "",
                  price:
                    h.price ?? (h.pricePerNight ? `$${h.pricePerNight}` : ""),
                  rating: h.rating ?? h.averageRating ?? 0,
                  imageSrc:
                    h.images?.main ??
                    (Array.isArray(h.images) && h.images[0]) ??
                    "",
                };
                return (
                  <HotelCard
                    key={mappedHotel.id}
                    name={mappedHotel.name}
                    location={mappedHotel.location}
                    price={mappedHotel.price}
                    rating={mappedHotel.rating}
                    imageSrc={mappedHotel.imageSrc}
                    onClick={() => onHotelClick?.(hotel)}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-20 h-20 mb-4 flex items-center justify-center"
              style={{
                backgroundColor: "#F3F4F6",
                borderRadius: "50%",
              }}
            >
              <X size={40} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No encontramos resultados</h3>
            <p className="text-gray-600 mb-6">
              No hay hoteles que coincidan con "{searchQuery}"
            </p>
            <button
              onClick={onClearSearch}
              className="px-6 py-3 text-white transition-all"
              style={{
                backgroundColor: "#007AFF",
                borderRadius: "9999px",
              }}
            >
              Intentar otra búsqueda
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="search" />

      {/* Searching Overlay */}
      <AnimatePresence>
        {isPerformingSearch && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "#007AFF" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Animated Search Icon */}
              <motion.div
                className="relative mb-6"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Search size={64} color="white" strokeWidth={2} />

                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{
                    scale: [1, 1.5, 2],
                    opacity: [0.8, 0.4, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{
                    scale: [1, 1.5, 2],
                    opacity: [0.8, 0.4, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5,
                  }}
                />
              </motion.div>

              <motion.h2
                className="text-white text-2xl mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Buscando...
              </motion.h2>
              <motion.p
                className="text-white/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Encontrando los mejores hoteles
              </motion.p>

              {/* Animated dots */}
              <motion.div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.15,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
