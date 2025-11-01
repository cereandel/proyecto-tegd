import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Booking from "@/app/lib/models/booking.model";
import Hotel from "@/app/lib/models/hotel.model";
import { getSession } from "@/app/lib/auth/auth";

export async function GET(request: Request) {
    try {
        await connectDB();

        const session: any = await getSession();
        if (!session || !session.safeUser || !session.safeUser.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.safeUser.id;

        const now = new Date();
        const bookingsRaw = await Booking.find({
            userId,
            checkOutDate: { $lt: now },
        }).lean();

        const bookings = await Promise.all(
            bookingsRaw.map(async (b: any) => {
                let hotel: any = null;
                let hotelName = "";
                try {
                    hotel = await Hotel.findById(b.hotelId).lean();
                    hotelName = hotel?.name ?? "";
                } catch (e) {
                    console.error("Error loading hotel for booking:", e);
                }
                return { ...b, hotel, hotelName };
            })
        );

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error("Error getting past bookings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
