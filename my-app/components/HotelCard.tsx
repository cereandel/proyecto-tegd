import { MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HotelCardProps {
  name: string;
  location: string;
  price: string;
  rating: number;
  imageSrc: string;
  onClick?: () => void;
}

export function HotelCard({
  name,
  location,
  price,
  rating,
  imageSrc,
  onClick,
}: HotelCardProps) {
  return (
    <div
      className="bg-white overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      style={{ borderRadius: "24px" }}
      onClick={onClick}
    >
      <div
        className="relative h-48 overflow-hidden"
        style={{ borderRadius: "24px 24px 0 0" }}
      >
        <ImageWithFallback
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute top-4 right-4 px-3 py-1.5 flex items-center gap-1"
          style={{
            backgroundColor: "#007AFF",
            borderRadius: "9999px",
          }}
        >
          <Star size={14} fill="white" className="text-white" />
          <span className="text-white text-sm">{rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-gray-900 mb-2">{name}</h3>
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin size={16} className="text-gray-400" />
          <span className="text-gray-500 text-sm">{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-900">{price}</span>
            <span className="text-gray-500 text-sm"> / noche</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click propagation to parent
              onClick?.();
            }}
            className="px-6 py-2 text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#007AFF",
              borderRadius: "9999px",
            }}
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}
