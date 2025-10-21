import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onSearch?: (query: string) => void;
}

export function SearchBar({ isExpanded, onExpand, onCollapse, onSearch }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch?.(searchValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex justify-center">
      <motion.div
        animate={{
          width: isExpanded ? "100%" : "56px",
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="relative"
      >
        {!isExpanded ? (
          // Collapsed state - circular search button
          <button
            onClick={onExpand}
            className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm hover:bg-white/30 transition-all"
            style={{ borderRadius: "9999px" }}
          >
            <Search className="text-white" size={20} />
          </button>
        ) : (
          // Expanded state - full search input
          <div className="relative w-full">
            <Search
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              size={20}
              onClick={handleSearch}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setTimeout(() => {
                  if (!searchValue) {
                    onCollapse();
                  }
                }, 200);
              }}
              placeholder="Buscar hoteles, destinos..."
              className="w-full pl-14 pr-6 py-4 bg-white border-none outline-none shadow-lg"
              style={{ borderRadius: "9999px" }}
              autoFocus
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
