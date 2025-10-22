"use client";
import { useRouter } from "next/navigation";
import { Register } from "@/components/Register";

export default function RegisterPage() {
    const router = useRouter();
    const handleRegister = () => {
        router.push("/home");
    };

    const handleNavigateToLogin = () => {
        router.push("/login");
    };
    return (
        <Register
            onNavigateToLogin={handleNavigateToLogin}
            onRegister={handleRegister}
        />
    );
}