"use client";

import { ChevronLeft, User, Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PersonalInfoProps {
  onBack: () => void;
  user?: { username?: string; email?: string } | null;
}

export function PersonalInfo({ onBack, user }: PersonalInfoProps) {
  const username = user?.username || "";
  const nameParts = username.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const [formData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: user?.email || "",
  });

  const inputFields = [
    {
      id: "firstName",
      label: "Nombre",
      icon: User,
      value: formData.firstName,
      placeholder: "Ingresa tu nombre",
    },
    {
      id: "lastName",
      label: "Apellido",
      icon: User,
      value: formData.lastName,
      placeholder: "Ingresa tu apellido",
    },
    {
      id: "email",
      label: "Correo Electrónico",
      icon: Mail,
      value: formData.email,
      type: "email",
      placeholder: "tu@email.com",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FFFFFF" }}
    >
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
          <h1 className="text-white">Información Personal</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 pb-8 overflow-y-auto">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {inputFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Label
                htmlFor={field.id}
                className="mb-2 block"
                style={{ color: "#1D1D1F" }}
              >
                {field.label}
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <field.icon size={20} style={{ color: "#8E8E93" }} />
                </div>
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  value={field.value}
                  disabled
                  placeholder={field.placeholder}
                  className="pl-12 py-6 border-0"
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
