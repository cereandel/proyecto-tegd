"use client";

import "../styles/globals.css";
import "../index.css";
import { ReactNode } from "react";
import { NavigationProvider } from "../contexts/NavigationContext";
import { SelectedHotelProvider } from "../contexts/SelectedHotelContext";
import { ViewAllProvider } from "../contexts/ViewAllContext";
import { ViewAllLocationsProvider } from "../contexts/ViewAllLocationsContext";

export default function App({ children }: { children?: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <SelectedHotelProvider>
            <ViewAllProvider>
              <ViewAllLocationsProvider>{children}</ViewAllLocationsProvider>
            </ViewAllProvider>
          </SelectedHotelProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
