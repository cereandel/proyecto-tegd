"use client";

import { Login } from "../../components/Login";

export default function LoginPage() {
  return (
    <Login
      onNavigateToRegister={() => console.log("Navigate to Register")}
      onLogin={() => console.log("Login successful")}
    />
  );
}
