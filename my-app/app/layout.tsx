import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "StayWise - Reservación de Hoteles",
  description: "Encuentra y reserva los mejores hoteles alrededor del mundo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <div id="root">{children}</div>
        {/*         <script type="module" src="/src/main.tsx"></script> */}
      </body>
    </html>
  );
}
