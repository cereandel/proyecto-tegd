"use client";

import { Mail, Lock, Eye, EyeOff, LogIn, XCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginProps {
  onNavigateToRegister: () => void;
  onLogin: () => void;
}

export function Login({ onNavigateToRegister, onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginAnimation(true);
    setShowError(false);

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        setShowLoginAnimation(false);
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data?.error || "Error al iniciar sesión");
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
          return;
        }
        onLogin();
      })
      .catch((err) => {
        setShowLoginAnimation(false);
        setErrorMessage("Error de red");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      });
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
          <p className="text-white/90 text-lg">Bienvenido de nuevo</p>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-6 py-8">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none outline-none transition-all focus:bg-white focus:shadow-md"
                  style={{ borderRadius: "24px" }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-8">
              <label className="block mb-2 text-gray-700">Contraseña</label>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Login Button */}
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
              Iniciar sesión
            </button>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-gray-600">¿No tienes una cuenta? </span>
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="transition-opacity hover:opacity-80"
                style={{ color: "#007AFF" }}
              >
                Regístrate
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Login Overlay */}
      <AnimatePresence>
        {showLoginAnimation && (
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
                <LogIn size={48} color="white" />
              </motion.div>
              <motion.p
                className="text-white mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Iniciando sesión...
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Error Overlay */}
        {showError && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "#FF3B30" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="text-center px-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <XCircle size={64} color="white" strokeWidth={2} />
              </motion.div>
              <motion.h2
                className="text-white text-2xl mt-4 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Error al iniciar sesión
              </motion.h2>
              <motion.p
                className="text-white/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {errorMessage}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
