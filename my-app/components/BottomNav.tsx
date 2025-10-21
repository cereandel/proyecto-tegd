import { Home, Search, Calendar, User, Heart } from "lucide-react";
import { useNavigation } from "../contexts/NavigationContext";

interface BottomNavProps {
  activeTab?: string;
}

export function BottomNav({ activeTab = "home" }: BottomNavProps) {
  const { navigateToHome, navigateToSearch, navigateToBookings, navigateToFavorites, navigateToProfile } = useNavigation();

  const navItems = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "search", label: "Búsqueda", icon: Search },
    { id: "bookings", label: "Reservas", icon: Calendar },
    { id: "favorites", label: "Favoritos", icon: Heart },
    { id: "profile", label: "Perfil", icon: User },
  ];

  const handleItemClick = (id: string) => {
    if (id === "home") {
      navigateToHome();
    } else if (id === "search") {
      navigateToSearch();
    } else if (id === "bookings") {
      navigateToBookings();
    } else if (id === "favorites") {
      navigateToFavorites();
    } else if (id === "profile") {
      navigateToProfile();
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100"
      style={{ borderRadius: '32px 32px 0 0' }}
    >
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="flex flex-col items-center gap-1 py-2 px-4 transition-all hover:opacity-70 active:scale-95"
            >
              <div 
                className="p-2.5 transition-all"
                style={{
                  backgroundColor: isActive ? '#007AFF' : 'transparent',
                  borderRadius: '16px'
                }}
              >
                <Icon 
                  size={22} 
                  className={isActive ? "text-white" : "text-gray-400"}
                />
              </div>
              <span 
                className="text-xs transition-colors"
                style={{ color: isActive ? '#007AFF' : '#9CA3AF' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
