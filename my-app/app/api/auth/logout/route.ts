import {NextRequest, NextResponse} from "next/server";
import {logOut} from "@/app/lib/auth/auth";


export async function GET(request: NextRequest) {
    try {
        await logOut();
        return NextResponse.json({result: 'Sesión Cerrada'},{status: 200});
    } catch (err) {
        console.error("Logout error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}