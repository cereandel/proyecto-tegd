export interface MockHotel {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  images?: {
    main: string;
    others: string[];
  };
  description?: string;
}

export const MOCK_HOTELS: MockHotel[] = [
  {
    id: 1,
    name: "Grand Luxury Resort",
    location: "Cancún, México",
    price: "$250",
    rating: 4.8,
    images: {
      main: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1080&q=80",
      others: [
        "https://images.unsplash.com/photo-1759303690206-1dc66e9ef8ed?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1543539571-2d88da875d21?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1757889693295-27cf12654c4b?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?auto=format&fit=crop&w=1080&q=80"
      ]
    },
    description: "Resort frente a la playa con piscina infinita y spa.",
  },
  {
    id: 2,
    name: "Ocean View Paradise",
    location: "Miami Beach, USA",
    price: "$320",
    rating: 4.9,
    images: {
      main: "https://images.unsplash.com/photo-1729605412184-8d796f9c6f66?auto=format&fit=crop&w=1080&q=80",
      others: [
        "https://images.unsplash.com/photo-1697216563517-e48622ba218c?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1641150557653-e4c409426e59?auto=format&fit=crop&w=1080&q=80"
      ]
    },
    description: "Habitaciones con vistas al mar y desayuno incluido.",
  },
  {
    id: 3,
    name: "Metropolitan Hotel",
    location: "Ciudad de México, México",
    price: "$180",
    rating: 4.7,
    images: {
      main: "https://images.unsplash.com/photo-1695706807850-8c66b24b3413?auto=format&fit=crop&w=1080&q=80",
      others: [
        "https://images.unsplash.com/photo-1731336478850-6bce7235e320?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1757506417384-76c0439c97ee?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1641150557653-e4c409426e59?auto=format&fit=crop&w=1080&q=80"
      ]
    },
    description: "Céntrico y moderno, ideal para viajeros de negocios.",
  },
  {
    id: 4,
    name: "Boutique Casa Blanca",
    location: "Barcelona, España",
    price: "$280",
    rating: 4.9,
    images: {
      main: "https://images.unsplash.com/photo-1649731000184-7ced04998f44?auto=format&fit=crop&w=1080&q=80",
      others: [
        "https://images.unsplash.com/photo-1641150557653-e4c409426e59?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1757506417384-76c0439c97ee?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?auto=format&fit=crop&w=1080&q=80"
      ]
    },
    description: "Encantador hotel boutique en el centro de la ciudad.",
  },
  {
    id: 5,
    name: "Infinity Pool Sanctuary",
    location: "Santorini, Grecia",
    price: "$420",
    rating: 4.9,
    images: {
      main: "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?auto=format&fit=crop&w=1080&q=80",
      others: [
        "https://images.unsplash.com/photo-1709744873177-714d7ab0fe02?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1697216563517-e48622ba218c?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1757506417384-76c0439c97ee?auto=format&fit=crop&w=1080&q=80",
        "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?auto=format&fit=crop&w=1080&q=80"
      ]
    },
    description: "Vistas panorámicas y piscina privada en algunas suites.",
  },
];

export function getMockHotels(query?: string) {
  if (!query) return MOCK_HOTELS;
  const q = query.toLowerCase();
  return MOCK_HOTELS.filter(
    (h) =>
      h.name.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      (h.description || "").toLowerCase().includes(q)
  );
}
