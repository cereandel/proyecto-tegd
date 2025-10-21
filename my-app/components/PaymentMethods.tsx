"use client";

import { ChevronLeft, CreditCard, Smartphone, DollarSign, Check, XCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentMethodsProps {
  onBack: () => void;
}

export function PaymentMethods({ onBack }: PaymentMethodsProps) {
  const [selectedMethods, setSelectedMethods] = useState<string[]>(["credit-card"]);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);

  const paymentOptions = [
    {
      id: "credit-card",
      label: "Tarjeta de Crédito/Débito",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      color: "#007AFF",
    },
    {
      id: "paypal",
      label: "PayPal",
      description: "Pago seguro con PayPal",
      icon: DollarSign,
      color: "#00C7BE",
    },
    {
      id: "apple-pay",
      label: "Apple Pay",
      description: "Pago rápido con Apple Pay",
      icon: Smartphone,
      color: "#1D1D1F",
    },
    {
      id: "google-pay",
      label: "Google Pay",
      description: "Pago rápido con Google Pay",
      icon: Smartphone,
      color: "#34C759",
    },
  ];

  const toggleMethod = (methodId: string) => {
    setSelectedMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSave = () => {
    setShowSaveAnimation(true);
    setTimeout(() => {
      setShowSaveAnimation(false);
      
      // Para simular error al guardar, descomenta la siguiente línea:
      // const hasError = selectedMethods.length === 0;
      const hasError = false;
      
      if (hasError) {
        setShowSaveError(true);
        setTimeout(() => {
          setShowSaveError(false);
        }, 3000);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <div
        className="pt-12 pb-6 px-6"
        style={{ backgroundColor: "#007AFF" }}
      >
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:opacity-80 transition-opacity"
            style={{ borderRadius: "12px" }}
          >
            <ChevronLeft size={24} color="white" />
          </button>
        </div>
        <div>
          <h1 className="text-white mb-1">Métodos de Pago</h1>
          <p className="text-white/80 text-sm">
            Selecciona tus métodos de pago preferidos
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {paymentOptions.map((option, index) => {
            const isSelected = selectedMethods.includes(option.id);
            const Icon = option.icon;

            return (
              <motion.button
                key={option.id}
                onClick={() => toggleMethod(option.id)}
                className="w-full p-4 transition-all relative overflow-hidden"
                style={{
                  backgroundColor: isSelected ? "#F0F8FF" : "#F9FAFB",
                  borderRadius: "20px",
                  border: isSelected ? "2px solid #007AFF" : "2px solid transparent",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isSelected ? option.color : "#E5E7EB",
                      borderRadius: "12px",
                    }}
                  >
                    <Icon size={24} color={isSelected ? "white" : "#6B7280"} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <p
                      style={{
                        color: isSelected ? "#007AFF" : "#1D1D1F",
                      }}
                    >
                      {option.label}
                    </p>
                    <p className="text-sm" style={{ color: "#8E8E93" }}>
                      {option.description}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <motion.div
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isSelected ? "#007AFF" : "#E5E7EB",
                      borderRadius: "6px",
                    }}
                    animate={{
                      scale: isSelected ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check size={16} color="white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Info Message */}
        <motion.div
          className="mt-6 p-4"
          style={{
            backgroundColor: "#F0F8FF",
            borderRadius: "16px",
            border: "1px solid #007AFF20",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <p className="text-sm" style={{ color: "#007AFF" }}>
            💡 Estos métodos de pago estarán disponibles al momento de realizar
            una reservación
          </p>
        </motion.div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={selectedMethods.length === 0 || showSaveAnimation}
          className="w-full mt-6 py-4 px-6 text-white relative overflow-hidden"
          style={{
            backgroundColor:
              selectedMethods.length === 0 ? "#E5E7EB" : "#007AFF",
            borderRadius: "20px",
            opacity: selectedMethods.length === 0 ? 0.5 : 1,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          whileTap={{ scale: selectedMethods.length > 0 ? 0.98 : 1 }}
        >
          <AnimatePresence mode="wait">
            {!showSaveAnimation ? (
              <motion.span
                key="save"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Guardar Preferencias
              </motion.span>
            ) : (
              <motion.div
                key="saving"
                className="flex items-center justify-center gap-3 relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "white" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Check size={20} color="#34C759" strokeWidth={3} />
                  </motion.div>
                </motion.div>
                <span>¡Guardado!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success animation background */}
          {showSaveAnimation && (
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundColor: "#34C759",
                borderRadius: "20px",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      </div>

      {/* Error Overlay */}
      <AnimatePresence>
        {showSaveError && (
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
                Error al Guardar
              </motion.h2>
              <motion.p
                className="text-white/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                No se pudieron guardar tus métodos de pago
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
