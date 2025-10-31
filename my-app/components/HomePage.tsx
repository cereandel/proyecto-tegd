"use client";

import { SearchBar } from "./SearchBar";
import { HotelCarousel } from "./HotelCarousel";
import { LocationCarousel } from "./LocationCarousel";
import { BottomNav } from "./BottomNav";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, MapPin, Hotel, Globe, Search } from "lucide-react";
import { useNavigation } from "../contexts/NavigationContext";
import { useSelectedHotel } from "../contexts/SelectedHotelContext";
import { getMockHotels } from "../data/mocks/hotels";
import { useViewAll } from "../contexts/ViewAllContext";
import { useViewAllLocations } from "../contexts/ViewAllLocationsContext";

interface HomePageProps {
  onViewAllHotels?: (category: string, hotels: any[]) => void;
  onViewAllLocations?: (locations: any[]) => void;
  onHotelClick?: (hotel: any) => void;
  onSearch?: (query: string) => void;
  openSearchOnMount?: boolean;
}

export function HomePage({
  onViewAllHotels,
  onViewAllLocations,
  onHotelClick,
  onSearch,
  openSearchOnMount: openSearchOnMountProp = false,
}: HomePageProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(
    openSearchOnMountProp
  );
  const [isSearching, setIsSearching] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const { navigateTo, openSearchOnMount, setOpenSearchOnMount } =
    useNavigation();

  const { setSelectedHotel } = useSelectedHotel();
  const { setViewAll } = useViewAll();
  const { setBottomSearchHandler } = useNavigation();
  const { setViewLocations } = useViewAllLocations();

  const handleHotelClick = (hotel: any) => {
    // store selected hotel in context so details page can access it
    setSelectedHotel(hotel);
    navigateTo(`hotelDetails/${hotel._id}`);
  };

  const [popularHotels,setPopularHotels] = useState()
  const [recommendedHotels,setRecommendedHotels] = useState()

  async function getAllHoteles(){
      const response = await fetch(`/api/hotels`, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
      });
      if (response.ok) {
          const res = await response.json();
          setPopularHotels(res.data);
          setRecommendedHotels(res.recommended);
      } else {
          console.log('error al recibir cookie')
      }
  }

  // Handle openSearchOnMount changes
  useEffect(() => {
    if (openSearchOnMount) {
      // reset the flag and expand search
      setOpenSearchOnMount?.(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setIsSearchExpanded(true);
      }, 250);
    }
    // Note: when flag is false we don't force collapse here to avoid
    // interfering with local interactions.
  }, [openSearchOnMount, setOpenSearchOnMount]);

  // Scroll to top when navigating to home
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Register a handler so BottomNav's search button expands the search bar on this screen
  useEffect(() => {
      getAllHoteles();

    const handler = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsSearchExpanded(true);
    };

    // store the handler function in navigation context
    setBottomSearchHandler?.(() => handler);

    return () => {
      // cleanup when leaving the home screen
      setBottomSearchHandler?.(undefined);
    };
  }, []);

  const featuredHotels = [
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
      id: 3,
      name: "Metropolitan Hotel",
      location: "Ciudad de México, México",
      price: "$180",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1695706807850-8c66b24b3413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MDk3NjAwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
      id: 7,
      name: "Elegant Boutique Inn",
      location: "Ámsterdam, Países Bajos",
      price: "$270",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1682221568203-16f33b35e57d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwbG9iYnl8ZW58MXx8fHwxNzYwOTIwMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
  ];



  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div
        className="px-6 pt-12 pb-8 relative overflow-hidden"
        style={{
          backgroundColor: "#007AFF",
          borderRadius: "0 0 32px 32px",
          fontFamily:
            "Quicksand, Nunito, Poppins, Rounded, system-ui, sans-serif",
        }}
      >
        <h1 className="text-white mb-2 text-4xl font-bold">StayWise</h1>
        <p className="text-white/90 text-lg">Encuentra tu hotel perfecto</p>

        {/* Decorative Floating Icons - Only visible when search is collapsed */}
        {!isSearchExpanded && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                x: [0, 20, 0],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-20 right-12 opacity-20"
            >
              <Plane size={32} className="text-white" />
            </motion.div>

            <motion.div
              animate={{
                x: [0, -15, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-32 right-28 opacity-15"
            >
              <Hotel size={24} className="text-white" />
            </motion.div>

            <motion.div
              animate={{
                x: [0, 15, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-24 right-48 opacity-10"
            >
              <MapPin size={28} className="text-white" />
            </motion.div>

            <motion.div
              animate={{
                x: [0, -20, 0],
                y: [0, 15, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute top-16 right-64 opacity-15"
            >
              <Globe size={26} className="text-white" />
            </motion.div>
          </div>
        )}

        {/* Search Bar */}
        <div ref={searchBarRef} className="mt-6 relative z-10">
          <SearchBar
            isExpanded={isSearchExpanded}
            onExpand={() => setIsSearchExpanded(true)}
            onCollapse={() => setIsSearchExpanded(false)}
            onSearch={(query) => {
              setIsSearchExpanded(false);
              setIsSearching(true);

              // navigate to the search page with the query so SearchResults can read it
              navigateTo(`search?query=${encodeURIComponent(query)}`);

              // Simular búsqueda con delay (kept for UX on Home)
              setTimeout(() => {
                setIsSearching(false);
                onSearch?.(query);
              }, 800);
            }}
          />
        </div>
      </div>

      {/* Searching Overlay */}
      <AnimatePresence>
        {isSearching && (
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

      {/* Curated Recommendation Banner */}
      <div className="px-6 py-6">
        <div
          className="p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)",
            borderRadius: "24px",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -right-8 -top-8 opacity-20"
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          />
          <div
            className="absolute -left-4 -bottom-4 opacity-10"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-white mb-1 text-2xl">Te recomendamos hoy</h2>
            <p className="text-white/90 text-sm">
              Contenido curado especialmente para ti
            </p>
          </div>
        </div>
      </div>

        {recommendedHotels && (
      <HotelCarousel
        title="Tus Recomendaciones Destacadas"
        hotels={recommendedHotels}
        featured={true}
        onViewAll={() => {
          setViewAll("Tus Recomendaciones Destacadas", recommendedHotels);
          navigateTo("viewAll");
          onViewAllHotels?.("Tus Recomendaciones Destacadas", recommendedHotels);
        }}
        onHotelClick={handleHotelClick}
      />
        )}
        {/*Popular Hotels Carousel*/}
      {popularHotels && (
      <HotelCarousel
        title="Hoteles Populares"
        hotels={popularHotels}
        onViewAll={() => {
          setViewAll("Hoteles Populares", popularHotels);
          navigateTo("viewAll");
          onViewAllHotels?.("Hoteles Populares", popularHotels);
        }}
        onHotelClick={handleHotelClick}
      />
        )}
        {/* Bottom Navigation */}
      <BottomNav activeTab={isSearchExpanded ? "search" : "home"} />
    </div>
  );
}
