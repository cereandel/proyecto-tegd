import { MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LocationCardProps {
  name: string;
  country: string;
  hotelsCount: number;
  imageUrl: string;
}

export function LocationCard({ name, country, hotelsCount, imageUrl }: LocationCardProps) {
  return (
    <div
      className="bg-white shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      style={{ borderRadius: "24px" }}
    >
      {/* Image Container */}
      <div className="relative h-40 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
          }}
        />
        {/* Location Info on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-white mb-1">{name}</h4>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin size={14} />
            <span>{country}</span>
          </div>
        </div>
      </div>

      {/* Hotels Count */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-600">{hotelsCount} hoteles disponibles</p>
      </div>
    </div>
  );
}
