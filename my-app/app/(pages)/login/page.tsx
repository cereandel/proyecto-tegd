"use client";

import { useRouter } from "next/navigation";
import { Login } from "@/components/Login";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/home");
  };

  const handleNavigateToRegister = () => {
    router.push("/register");
  };

  return (
    <Login
      onNavigateToRegister={handleNavigateToRegister}
      onLogin={handleLogin}
    />
  );
}
