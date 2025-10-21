"use client";

import { ChevronLeft, Lock, Eye, EyeOff, Shield, Smartphone, Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface SecuritySettingsProps {
  onBack: () => void;
}

export function SecuritySettings({ onBack }: SecuritySettingsProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const savedPassword = "••••••••••";

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    biometricAuth: true,
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <div
        className="pt-12 pb-6 px-6 sticky top-0 z-10"
        style={{ backgroundColor: "#007AFF" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 transition-transform active:scale-90"
          >
            <ChevronLeft size={28} color="white" />
          </button>
          <h1 className="text-white">Seguridad</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 pb-8 overflow-y-auto">
        {/* View Password Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-4" style={{ color: "#1D1D1F" }}>
            Contraseña
          </h2>
          
          <div>
            <Label 
              htmlFor="password" 
              className="mb-2 block"
              style={{ color: "#1D1D1F" }}
            >
              Tu Contraseña
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock size={20} style={{ color: "#8E8E93" }} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={showPassword ? "MiContraseña123" : savedPassword}
                disabled
                className="pl-12 pr-12 py-6 border-0"
                style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "16px",
                  border: "1px solid #E5E7EB",
                }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <EyeOff size={20} style={{ color: "#007AFF" }} />
                ) : (
                  <Eye size={20} style={{ color: "#8E8E93" }} />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Security Options */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="mb-4" style={{ color: "#1D1D1F" }}>
            Opciones de Seguridad
          </h2>

          {/* Two-Factor Authentication */}
          <motion.div
            className="p-4 flex items-center justify-between"
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: "20px",
              border: "1px solid #E5E7EB",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{
                  backgroundColor: "#AF52DE15",
                  borderRadius: "12px",
                }}
              >
                <Shield size={24} style={{ color: "#AF52DE" }} />
              </div>
              <div>
                <p style={{ color: "#1D1D1F" }}>
                  Autenticación de Dos Factores
                </p>
                <p className="text-sm" style={{ color: "#8E8E93" }}>
                  Seguridad adicional para tu cuenta
                </p>
              </div>
            </div>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
              }
            />
          </motion.div>

          {/* Login Notifications */}
          <motion.div
            className="p-4 flex items-center justify-between"
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: "20px",
              border: "1px solid #E5E7EB",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{
                  backgroundColor: "#FF950015",
                  borderRadius: "12px",
                }}
              >
                <Mail size={24} style={{ color: "#FF9500" }} />
              </div>
              <div>
                <p style={{ color: "#1D1D1F" }}>
                  Notificaciones de Inicio
                </p>
                <p className="text-sm" style={{ color: "#8E8E93" }}>
                  Aviso por correo al iniciar sesión
                </p>
              </div>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) =>
                setSecuritySettings({ ...securitySettings, loginNotifications: checked })
              }
            />
          </motion.div>

          {/* Biometric Authentication */}
          <motion.div
            className="p-4 flex items-center justify-between"
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: "20px",
              border: "1px solid #E5E7EB",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{
                  backgroundColor: "#34C75915",
                  borderRadius: "12px",
                }}
              >
                <Smartphone size={24} style={{ color: "#34C759" }} />
              </div>
              <div>
                <p style={{ color: "#1D1D1F" }}>
                  Autenticación Biométrica
                </p>
                <p className="text-sm" style={{ color: "#8E8E93" }}>
                  Huella digital o Face ID
                </p>
              </div>
            </div>
            <Switch
              checked={securitySettings.biometricAuth}
              onCheckedChange={(checked) =>
                setSecuritySettings({ ...securitySettings, biometricAuth: checked })
              }
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
