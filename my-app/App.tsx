"use client";

import { useState } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { HomePage } from "./components/HomePage";
import { ViewAllHotels } from "./components/ViewAllHotels";
import { ViewAllLocations } from "./components/ViewAllLocations";
import { HotelDetails } from "./components/HotelDetails";
import { SearchResults } from "./components/SearchResults";
import { Reservations } from "./components/Reservations";
import { Favorites } from "./components/Favorites";
import { Profile } from "./components/Profile";
import { NavigationProvider, useNavigation } from "./contexts/NavigationContext";

interface ViewAllData {
  title: string;
  hotels?: any[];
  locations?: any[];
}

function AppContent() {
  const { currentScreen, navigateTo, navigateBack, openSearchOnMount } = useNavigation();
  const [viewAllData, setViewAllData] = useState<ViewAllData | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // All hotels data for searching
  const allHotels = [
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
    {
      id: 9,
      name: "Tropical Paradise Resort",
      location: "Phuket, Tailandia",
      price: "$150",
      rating: 4.6,
      imageUrl:
        "https://images.unsplash.com/photo-1697216563517-e48622ba218c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzYwOTUxNTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
      id: 11,
      name: "Mountain View Lodge",
      location: "Aspen, Colorado",
      price: "$220",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1757506417384-76c0439c97ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxvZGdlfGVufDF8fHx8MTc2MDk3Nzk1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
      id: 13,
      name: "Villa Tranquila",
      location: "Tulum, México",
      price: "$175",
      rating: 4.6,
      imageUrl:
        "https://images.unsplash.com/photo-1694967832949-09984640b143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjB2aWxsYXxlbnwxfHx8fDE3NjA5Nzg0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 14,
      name: "Rooftop Urban Hotel",
      location: "Singapur",
      price: "$210",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1720746942586-72083beaa07a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGhvdGVsJTIwcm9vZnRvcHxlbnwxfHx8fDE3NjA5Nzg0NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 15,
      name: "Heritage Palace Hotel",
      location: "Jaipur, India",
      price: "$165",
      rating: 4.5,
      imageUrl:
        "https://images.unsplash.com/photo-1649731000184-7ced04998f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsfGVufDF8fHx8MTc2MDg4NjQwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 16,
      name: "Azure Beach Club",
      location: "Ibiza, España",
      price: "$295",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1729605412184-8d796f9c6f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhvdGVsfGVufDF8fHx8MTc2MDg5MDI3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 17,
      name: "Sunset Beach Resort",
      location: "Bali, Indonesia",
      price: "$190",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1729605412184-8d796f9c6f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhvdGVsfGVufDF8fHx8MTc2MDg5MDI3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 18,
      name: "City Center Suites",
      location: "Londres, Reino Unido",
      price: "$240",
      rating: 4.6,
      imageUrl:
        "https://images.unsplash.com/photo-1695706807850-8c66b24b3413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MDk3NjAwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
    {
      id: 20,
      name: "Alpine Retreat",
      location: "Zermatt, Suiza",
      price: "$300",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1757506417384-76c0439c97ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxvZGdlfGVufDF8fHx8MTc2MDk3Nzk1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 21,
      name: "Modern Sky Tower",
      location: "Tokio, Japón",
      price: "$310",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwaG90ZWwlMjBuaWdodHxlbnwxfHx8fDE3NjA5Nzc5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 22,
      name: "Prestige Oceanfront",
      location: "Seychelles",
      price: "$410",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1641150557653-e4c409426e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBiZWFjaCUyMGFlcmlhbHxlbnwxfHx8fDE3NjA5Nzc5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 23,
      name: "Charming Boutique Stay",
      location: "Praga, República Checa",
      price: "$195",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1682221568203-16f33b35e57d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwbG9iYnl8ZW58MXx8fHwxNzYwOTIwMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 24,
      name: "Tropical Pool Villa",
      location: "Koh Samui, Tailandia",
      price: "$235",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1697216563517-e48622ba218c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzYwOTUxNTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const results = allHotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lowerQuery) ||
        hotel.location.toLowerCase().includes(lowerQuery)
    );
    setSearchQuery(query);
    setSearchResults(results);
    navigateTo("searchResults");
  };

  // Render login screen
  if (currentScreen === "login") {
    return (
      <Login
        onNavigateToRegister={() => navigateTo("register")}
        onLogin={() => navigateTo("home")}
      />
    );
  }

  // Render register screen
  if (currentScreen === "register") {
    return (
      <Register
        onNavigateToLogin={() => navigateTo("login")}
        onRegister={() => navigateTo("home")}
      />
    );
  }

  // Render hotel details screen
  if (currentScreen === "hotelDetails" && selectedHotel) {
    return (
      <HotelDetails
        hotel={selectedHotel}
        onBack={() => {
          setSelectedHotel(null);
          navigateBack();
        }}
        onReserve={() => {
          alert(`Reserva confirmada para ${selectedHotel.name}`);
        }}
      />
    );
  }

  // Render view all hotels screen
  if (currentScreen === "viewAllHotels" && viewAllData?.hotels) {
    return (
      <ViewAllHotels
        title={viewAllData.title}
        hotels={viewAllData.hotels}
        onBack={() => navigateBack()}
        onHotelClick={(hotel) => {
          setSelectedHotel(hotel);
          navigateTo("hotelDetails");
        }}
      />
    );
  }

  // Render view all locations screen
  if (currentScreen === "viewAllLocations" && viewAllData?.locations) {
    return (
      <ViewAllLocations
        title={viewAllData.title}
        locations={viewAllData.locations}
        onBack={() => navigateBack()}
      />
    );
  }

  // Render search results screen
  if (currentScreen === "searchResults") {
    return (
      <SearchResults
        searchQuery={searchQuery}
        hotels={searchResults}
        onBack={() => navigateBack()}
        onClearSearch={() => {
          setSearchQuery("");
          setSearchResults([]);
          navigateTo("home");
        }}
        onHotelClick={(hotel) => {
          setSelectedHotel(hotel);
          navigateTo("hotelDetails");
        }}
        onSearch={handleSearch}
      />
    );
  }

  // Render reservations screen
  if (currentScreen === "reservations") {
    return <Reservations />;
  }

  // Render favorites screen
  if (currentScreen === "favorites") {
    return (
      <Favorites
        onHotelClick={(hotel) => {
          setSelectedHotel(hotel);
          navigateTo("hotelDetails");
        }}
      />
    );
  }

  // Render profile screen
  if (currentScreen === "profile") {
    return <Profile />;
  }

  // Render home screen
  return (
    <HomePage
      onViewAllHotels={(category, hotels) => {
        setViewAllData({ title: category, hotels });
        navigateTo("viewAllHotels");
      }}
      onViewAllLocations={(locations) => {
        setViewAllData({ title: "Lugares Populares", locations });
        navigateTo("viewAllLocations");
      }}
      onHotelClick={(hotel) => {
        setSelectedHotel(hotel);
        navigateTo("hotelDetails");
      }}
      onSearch={handleSearch}
      openSearchOnMount={openSearchOnMount}
    />
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
