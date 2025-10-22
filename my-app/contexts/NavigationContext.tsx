// file: my-app/contexts/NavigationContext.tsx
"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

type Screen =
  | "login"
  | "register"
  | "home"
  | "viewAllHotels"
  | "viewAllLocations"
  | "searchResults"
  | "reservations"
  | "favorites"
  | "profile"
  | string;

interface NavigationContextType {
  navigateTo: (screen: Screen) => void;
  navigateToHome: () => void;
  navigateToSearch: (open?: boolean) => void;
  navigateToBookings: () => void;
  navigateToFavorites: () => void;
  navigateToProfile: () => void;
  navigateToLogin: () => void;
  navigateToHotelDetails: (id: string | number) => void;
  navigateBack: () => void;
  openSearchOnMount: boolean;
  setOpenSearchOnMount: (value: boolean) => void;
  // optional handlers that client screens can register to override bottom nav behavior
  bottomHomeHandler?: (() => void) | undefined;
  setBottomHomeHandler: (fn?: () => void) => void;
  bottomSearchHandler?: (() => void) | undefined;
  setBottomSearchHandler: (fn?: () => void) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [openSearchOnMount, setOpenSearchOnMount] = useState<boolean>(false);

  // handlers that can be registered by active client screens
  const [bottomHomeHandler, setBottomHomeHandler] = useState<
    (() => void) | undefined
  >(undefined);
  const [bottomSearchHandler, setBottomSearchHandler] = useState<
    (() => void) | undefined
  >(undefined);

  const navigateTo = (screen: Screen | string) => {
    const path =
      typeof screen === "string" && screen.startsWith("/")
        ? screen
        : `/${screen}`;
    router.push(path);
  };

  const navigateToHome = () => navigateTo("home");
  const navigateToSearch = (open = true) => {
    if (open) setOpenSearchOnMount(true);
    navigateTo("search");
  };
  const navigateToBookings = () => navigateTo("reservations");
  const navigateToFavorites = () => navigateTo("favorites");
  const navigateToProfile = () => navigateTo("profile");
  const navigateToLogin = () => navigateTo("login");

  const navigateToHotelDetails = (id: string | number) => {
    navigateTo(`hotelDetails/${id}`);
  };

  const navigateBack = () => {
    router.back();
  };

  return (
    <NavigationContext.Provider
      value={{
        navigateTo,
        navigateToHome,
        navigateToSearch,
        navigateToBookings,
        navigateToFavorites,
        navigateToProfile,
        navigateToHotelDetails,
        navigateBack,
        navigateToLogin,
        openSearchOnMount,
        setOpenSearchOnMount,
        bottomHomeHandler,
        setBottomHomeHandler,
        bottomSearchHandler,
        setBottomSearchHandler,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx)
    throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
