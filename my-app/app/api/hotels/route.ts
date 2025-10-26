import {NextRequest, NextResponse} from "next/server";
import {connectDB, disconnectDB, getHoteles} from "@/app/lib/mongodb";

export async function GET(request: NextRequest) {
    try {
        await connectDB()
       const data = await getHoteles()
        await disconnectDB()
        return NextResponse.json({ data: data }, { status: 200 });
    } catch (err) {
        console.error("Error de hoteles:", err);
        return {
            body: JSON.stringify({ error: "Internal Server Error" }),
            status: 500,
        } as any;
    }
}