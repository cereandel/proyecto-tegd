import { NextRequest, NextResponse } from "next/server";
import {
    connectDB,
    getHoteles, getRecommendedHoteles,
} from "@/app/lib/mongodb";
import { getSession } from "@/app/lib/auth/auth";
import User from "@/app/lib/models/user.model";

export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const data = await getHoteles()
        const payload = await getSession(request);
        // @ts-ignore
        const userId = payload?.safeUser?.id;
        let recommended: any[] = [];
        if (userId) {
            const user = await User.findById(userId).exec();
            if (user) {
                try {
                    recommended = await getRecommendedHoteles(user);
                } catch (recErr) {
                    console.error('Error computing recommendations for user:', recErr);
                    recommended = [];
                }
            }
        }

        return NextResponse.json({ data: data, recommended: recommended }, { status: 200 });
    } catch (err) {
        console.error("Error de hoteles:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}