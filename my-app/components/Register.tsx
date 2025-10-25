"use client";

import { Mail, Lock, User, Eye, EyeOff, UserPlus, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RegisterProps {
  onNavigateToLogin: () => void;
  onRegister: () => void;
}

export function Register({ onNavigateToLogin, onRegister }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) {
      return "Debes ingresar al menos un nombre y un apellido";
    }
    if (parts[0].length < 2 || parts[1].length < 2) {
      return "El nombre y apellido deben tener al menos 2 caracteres";
    }
    return "";
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFormErrors({ name: "", email: "", password: "" });

    const nameError = validateName(formData.name);
    if (nameError) {
      setFormErrors((prev) => ({ ...prev, name: nameError }));
      return;
    }

    const passwordError = validatePasswords();
    if (passwordError) {
      setFormErrors((prev) => ({ ...prev, password: passwordError }));
      return;
    }

    setIsCreating(true);

    (async () => {
      try {
        const resp = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await resp.json();

        setIsCreating(false);

        if (!resp.ok) {
          if (data?.error?.includes("already in use")) {
            setFormErrors((prev) => ({
              ...prev,
              email: "Este correo o usuario ya está registrado",
            }));
          } else if (data?.error) {
            setFormErrors((prev) => ({ ...prev, email: data.error }));
          } else {
            setFormErrors((prev) => ({ ...prev, email: "Ocurrió un error" }));
          }
          return;
        }

        setIsCreated(true);
        setTimeout(() => {
          setIsCreated(false);
          setTimeout(() => {
            onNavigateToLogin();
          }, 300);
        }, 1200);
      } catch (error) {
        setIsCreating(false);
        setFormErrors((prev) => ({ ...prev, email: "Error de red" }));
        console.error("Signup client error:", error);
      }
    })();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "name" && formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: "" }));
    }
    if (field === "email" && formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: "" }));
    }
    if (
      (field === "password" || field === "confirmPassword") &&
      formErrors.password
    ) {
      setFormErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div
          className="px-6 pt-16 pb-12 text-center"
          style={{
            backgroundColor: "#007AFF",
            borderRadius: "0 0 32px 32px",
            fontFamily:
              "Quicksand, Nunito, Poppins, Rounded, system-ui, sans-serif",
          }}
        >
          <h1 className="text-white mb-2 text-4xl font-bold">StayWise</h1>
          <p className="text-white/90 text-lg">Crea tu cuenta</p>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-6 py-8 pb-12">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            {/* Name Input */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">
                Nombre completo
              </label>
              <div className="relative">
                <User
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none outline-none transition-all focus:bg-white focus:shadow-md"
                  style={{
                    borderRadius: "24px",
                    border: formErrors.name ? "2px solid #FF3B30" : "none",
                  }}
                  required
                />
              </div>
              {formErrors.name && (
                <motion.p
                  className="text-sm mt-2 ml-2"
                  style={{ color: "#FF3B30" }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formErrors.name}
                </motion.p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none outline-none transition-all focus:bg-white focus:shadow-md"
                  style={{
                    borderRadius: "24px",
                    border: formErrors.email ? "2px solid #FF3B30" : "none",
                  }}
                  required
                />
              </div>
              {formErrors.email && (
                <motion.p
                  className="text-sm mt-2 ml-2"
                  style={{ color: "#FF3B30" }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formErrors.email}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">Contraseña</label>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 bg-gray-50 border-none outline-none transition-all focus:bg-white focus:shadow-md"
                  style={{ borderRadius: "24px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-2">
              <label className="block mb-2 text-gray-700">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 bg-gray-50 border-none outline-none transition-all focus:bg-white focus:shadow-md"
                  style={{
                    borderRadius: "24px",
                    border: formErrors.password ? "2px solid #FF3B30" : "none",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <motion.p
                  className="text-sm mt-2 ml-2"
                  style={{ color: "#FF3B30" }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formErrors.password}
                </motion.p>
              )}
            </div>

            <div className="mb-6" />

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-4 text-white transition-opacity hover:opacity-90 mb-8 text-center font-bold text-lg"
              style={{
                backgroundColor: "#007AFF",
                borderRadius: "24px",
                fontFamily:
                  "Quicksand, Nunito, Poppins, Rounded, system-ui, sans-serif",
              }}
            >
              Crear cuenta
            </button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-gray-600">¿Ya tienes una cuenta? </span>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="transition-opacity hover:opacity-80"
                style={{ color: "#007AFF" }}
              >
                Inicia sesión
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Creating Account Overlay */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "#007AFF" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                style={{
                  display: "inline-block",
                  transformOrigin: "center center",
                }}
              >
                <UserPlus size={48} color="white" />
              </motion.div>
              <motion.p
                className="text-white mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Creando tu cuenta...
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {isCreated && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "#34C759" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: "white" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: "spring", delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Check
                    size={60}
                    style={{ color: "#34C759" }}
                    strokeWidth={3}
                  />
                </motion.div>
              </motion.div>
              <motion.h2
                className="text-white text-2xl mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                ¡Cuenta Creada!
              </motion.h2>
              <motion.p
                className="text-white/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Redirigiendo a inicio de sesión...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
