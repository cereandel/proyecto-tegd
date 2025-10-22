import { NextRequest } from "next/server";
import { logOut } from "@/app/lib/auth/auth";

export async function GET(request: NextRequest) {
    try {
        return await logOut();
    } catch (err) {
        console.error("Logout error:", err);
        return {
            body: JSON.stringify({ error: "Internal Server Error" }),
            status: 500,
        } as any;
    }
}