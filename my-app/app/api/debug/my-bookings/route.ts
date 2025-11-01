import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Booking from "@/app/lib/models/booking.model";
import Hotel from "@/app/lib/models/hotel.model";
import { getSession } from "@/app/lib/auth/auth";

export async function GET(request: Request) {
    const debugLogs: string[] = [];
    try {
        debugLogs.push('[debug/my-bookings] called');
        console.log('[debug/my-bookings] called');
        await connectDB();
        debugLogs.push('[debug/my-bookings] connected to DB');
        console.log('[debug/my-bookings] connected to DB');
        const session: any = await getSession();
        debugLogs.push(`[debug/my-bookings] session: ${session ? 'FOUND' : 'NONE'}`);
        console.log('[debug/my-bookings] session:', session);
        if (!session || !session.safeUser || !session.safeUser.id) {
            debugLogs.push('[debug/my-bookings] unauthorized - no session');
            return NextResponse.json({ error: "Unauthorized", debugLogs }, { status: 401 });
        }
        const userId = session.safeUser.id;

        // populate hotel name for each booking
        const bookingsRaw = await Booking.find({ userId }).lean();
        debugLogs.push(`[debug/my-bookings] bookings found: ${bookingsRaw?.length ?? 0}`);
        console.log('[debug/my-bookings] bookings found:', bookingsRaw?.length ?? 0);

        const bookings = await Promise.all(
            bookingsRaw.map(async (b: any) => {
                let hotelName = "";
                let hotel: any = null;
                try {
                    hotel = await Hotel.findById(b.hotelId).lean();
                    hotelName = hotel?.name ?? "";
                } catch (e) {
                    debugLogs.push(`[debug/my-bookings] error finding hotel for id ${b.hotelId}: ${String(e)}`);
                }
                return { ...b, hotelName, hotel };
            })
        );

        return NextResponse.json({ session, bookings, debugLogs });
    } catch (error) {
        console.error("Debug bookings error:", error);
        debugLogs.push(`[debug/my-bookings] error: ${String(error)}`);
        return NextResponse.json({ error: "Internal server error", debugLogs }, { status: 500 });
    }
}
