import {NextRequest, NextResponse} from "next/server";
import {
    connectDB,
    disconnectDB,
    getHoteles, getRecommendedHoteles, getRecommendedHotelesAmenities,
    getRecommendedHotelesPreferencias,
    getRecommendedHotelesTipo
} from "@/app/lib/mongodb";
import {cookies} from "next/headers";
import {getSession} from "@/app/lib/auth/auth";
import User from "@/app/lib/models/user.model";

export async function GET(request: NextRequest) {
    try {
        await connectDB()
       const data = await getHoteles()
        const payload = await getSession();
        // @ts-ignore
        const userId = payload?.safeUser?.id;
        const user = await User.findById(userId).exec();
       const recommended = await getRecommendedHoteles(user);
        return NextResponse.json({ data: data, recommended: recommended }, { status: 200 });
    } catch (err) {
        console.error("Error de hoteles:", err);
        return {
            body: JSON.stringify({ error: "Internal Server Error" }),
            status: 500,
        } as any;
    }
}