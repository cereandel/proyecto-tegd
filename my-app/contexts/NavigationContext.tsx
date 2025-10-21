"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Screen =
  | "login"
  | "register"
  | "home"
  | "viewAllHotels"
  | "viewAllLocations"
  | "hotelDetails"
  | "searchResults"
  | "reservations"
  | "favorites"
  | "profile";

interface NavigationContextType {
  currentScreen: Screen;
  previousScreen: Screen | null;
  navigateTo: (screen: Screen) => void;
  navigateBack: () => void;
  navigateToHome: () => void;
  navigateToSearch: () => void;
  navigateToBookings: () => void;
  navigateToFavorites: () => void;
  navigateToProfile: () => void;
  navigateToLogin: () => void;
  openSearchOnMount: boolean;
  setOpenSearchOnMount: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [openSearchOnMount, setOpenSearchOnMount] = useState(false);

  const navigateTo = (screen: Screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (previousScreen) {
      setCurrentScreen(previousScreen);
      setPreviousScreen(null);
    } else {
      setCurrentScreen("home");
    }
  };

  const navigateToHome = () => {
    setOpenSearchOnMount(false);
    setPreviousScreen(currentScreen);
    setCurrentScreen("home");
  };

  const navigateToSearch = () => {
    setOpenSearchOnMount(true);
    setPreviousScreen(currentScreen);
    setCurrentScreen("home");
  };

  const navigateToBookings = () => {
    setOpenSearchOnMount(false);
    setPreviousScreen(currentScreen);
    setCurrentScreen("reservations");
  };

  const navigateToFavorites = () => {
    setOpenSearchOnMount(false);
    setPreviousScreen(currentScreen);
    setCurrentScreen("favorites");
  };

  const navigateToProfile = () => {
    setOpenSearchOnMount(false);
    setPreviousScreen(currentScreen);
    setCurrentScreen("profile");
  };

  const navigateToLogin = () => {
    setOpenSearchOnMount(false);
    setPreviousScreen(null);
    setCurrentScreen("login");
  };

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        previousScreen,
        navigateTo,
        navigateBack,
        navigateToHome,
        navigateToSearch,
        navigateToBookings,
        navigateToFavorites,
        navigateToProfile,
        navigateToLogin,
        openSearchOnMount,
        setOpenSearchOnMount,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
