"use client";

import {
  User,
  Heart,
  Shield,
  ChevronRight,
  CreditCard,
  LogOut,
  MapPin,
  Star,
} from "lucide-react";
import { BottomNav } from "./BottomNav";
import { PersonalInfo } from "./PersonalInfo";
import { HotelPreferences } from "./HotelPreferences";
import { SecuritySettings } from "./SecuritySettings";
import { PaymentMethods } from "./PaymentMethods";
import { useNavigation } from "../contexts/NavigationContext";
import { motion } from "framer-motion";
import { useState } from "react";

type SettingsView =
  | "main"
  | "personalInfo"
  | "preferences"
  | "security"
  | "payment";

export function Profile({
  user,
}: {
  user?: { id?: string; username?: string; email?: string } | null;
}) {
  const { navigateToLogin, navigateToFavorites } = useNavigation();
  const [currentView, setCurrentView] = useState<SettingsView>("main");
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  // If user prop not provided, show placeholder values
  const displayName = user?.username || "Usuario";
  const displayEmail = user?.email || "usuario@ejemplo.com";

  const handleLogout = () => {
    setShowLogoutAnimation(true);
    // Call backend to clear session cookie, then navigate after animation
    (async () => {
      try {
        await fetch("/api/auth/logout", { method: "GET" });
      } catch (err) {
        console.error("Logout request failed", err);
      }
      // Wait for animation to finish then navigate
      setTimeout(() => {
        navigateToLogin();
      }, 800);
    })();
  };

  const settingsSections = [
    {
      title: "Cuenta",
      items: [
        {
          icon: User,
          label: "Información Personal",
          description: "Nombre, email y teléfono",
          color: "#007AFF",
          onClick: () => setCurrentView("personalInfo"),
        },
      ],
    },
    {
      title: "Preferencias",
      items: [
        {
          icon: Heart,
          label: "Preferencias de Hotel",
          description: "Tipo de alojamiento favorito",
          color: "#FF2D55",
          onClick: () => setCurrentView("preferences"),
        },
        {
          icon: MapPin,
          label: "Destinos Favoritos",
          description: "Lugares que te interesan",
          color: "#34C759",
          onClick: () => navigateToFavorites(),
        },
      ],
    },
    {
      title: "Seguridad",
      items: [
        {
          icon: Shield,
          label: "Seguridad y Contraseña",
          description: "Cambiar contraseña",
          color: "#AF52DE",
          onClick: () => setCurrentView("security"),
        },
        {
          icon: CreditCard,
          label: "Métodos de Pago",
          description: "Tarjetas guardadas",
          color: "#00C7BE",
          onClick: () => setCurrentView("payment"),
        },
      ],
    },
  ];

  // Render detail views
  if (currentView === "personalInfo") {
    return <PersonalInfo onBack={() => setCurrentView("main")} user={user} />;
  }

  if (currentView === "preferences") {
    return <HotelPreferences onBack={() => setCurrentView("main")} />;
  }

  if (currentView === "security") {
    return (
      <SecuritySettings onBack={() => setCurrentView("main")} user={user} />
    );
  }

  if (currentView === "payment") {
    return <PaymentMethods onBack={() => setCurrentView("main")} />;
  }

  // Render main profile view
  return (
    <>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Header with Profile Info */}
        <div className="pt-12 pb-8 px-6" style={{ backgroundColor: "#007AFF" }}>
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <motion.div
              className="mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <User size={56} style={{ color: "#007AFF" }} />
              </div>
            </motion.div>

            {/* User Info */}
            <motion.div
              className="text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-white mb-1">{displayName}</h1>
              <p className="text-white/80 text-sm">{displayEmail}</p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 mt-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star size={16} fill="#FFD700" style={{ color: "#FFD700" }} />
                  <p className="text-white">12</p>
                </div>
                <p className="text-white/70 text-xs">Reservas</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart
                    size={16}
                    fill="#FF2D55"
                    style={{ color: "#FF2D55" }}
                  />
                  <p className="text-white">8</p>
                </div>
                <p className="text-white/70 text-xs">Favoritos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MapPin
                    size={16}
                    fill="#34C759"
                    style={{ color: "#34C759" }}
                  />
                  <p className="text-white">5</p>
                </div>
                <p className="text-white/70 text-xs">Destinos</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 px-6 py-6 pb-24 overflow-y-auto">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + sectionIndex * 0.1 }}
            >
              <h2 className="mb-3 px-2" style={{ color: "#1D1D1F" }}>
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <SettingCard
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    description={item.description}
                    color={item.color}
                    onClick={item.onClick}
                    delay={0.4 + sectionIndex * 0.1 + itemIndex * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className="w-full py-4 px-6 flex items-center justify-center gap-3 transition-all relative overflow-hidden"
            style={{
              backgroundColor: "#FF3B30",
              borderRadius: "20px",
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={
              showLogoutAnimation
                ? {
                    scale: [1, 0.95, 1.05, 0],
                    opacity: [1, 1, 1, 0],
                    y: 0,
                  }
                : { y: 0, opacity: 1 }
            }
            transition={
              showLogoutAnimation
                ? { duration: 0.8, times: [0, 0.3, 0.6, 1] }
                : { duration: 0.3, delay: 0.7 }
            }
            whileHover={{ scale: showLogoutAnimation ? 1 : 1.02 }}
            whileTap={{ scale: showLogoutAnimation ? 1 : 0.98 }}
            disabled={showLogoutAnimation}
          >
            <motion.div
              animate={
                showLogoutAnimation ? { rotate: [0, 0, 360] } : { rotate: 0 }
              }
              transition={
                showLogoutAnimation
                  ? { duration: 0.6, delay: 0.1 }
                  : { duration: 0 }
              }
            >
              <LogOut size={20} color="white" />
            </motion.div>
            <span className="text-white">
              {showLogoutAnimation ? "Cerrando sesión..." : "Cerrar Sesión"}
            </span>

            {/* Animación de fondo */}
            {showLogoutAnimation && (
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundColor: "#FF3B30",
                  borderRadius: "20px",
                }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </motion.button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="profile" />
      </div>

      {/* Logout Overlay */}
      {showLogoutAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "#007AFF" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              style={{
                display: "inline-block",
                transformOrigin: "center center",
              }}
            >
              <LogOut size={48} color="white" />
            </motion.div>
            <motion.p
              className="text-white mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Hasta pronto
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// Setting Card Component
function SettingCard({
  icon: Icon,
  label,
  description,
  color,
  onClick,
  delay,
}: {
  icon: any;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      className="w-full p-4 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        backgroundColor: "#F9FAFB",
        borderRadius: "20px",
        border: "1px solid #E5E7EB",
      }}
      onClick={onClick}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ backgroundColor: "#F3F4F6" }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: "48px",
          height: "48px",
          backgroundColor: `${color}15`,
          borderRadius: "14px",
        }}
      >
        <Icon size={24} style={{ color }} />
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        <p className="mb-0.5" style={{ color: "#1D1D1F" }}>
          {label}
        </p>
        <p className="text-sm" style={{ color: "#8E8E93" }}>
          {description}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight size={20} style={{ color: "#C7C7CC" }} />
    </motion.button>
  );
}
