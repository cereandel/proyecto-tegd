import { NextResponse } from "next/server";
import {connectDB, fillRecommendations} from "@/app/lib/mongodb";
import Booking from "@/app/lib/models/booking.model";
import Hotel from "@/app/lib/models/hotel.model";
import { getSession } from "@/app/lib/auth/auth";
import User from "@/app/lib/models/user.model";

export async function POST(request: Request) {
    await connectDB();
    const data = await request.json();

    const { hotelId, checkInDate, checkOutDate } = data;

    const session: any = await getSession();
    if (!session || !session.safeUser || !session.safeUser.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.safeUser.id;
    

    if (!hotelId || !checkInDate || !checkOutDate) {
        return NextResponse.json({ error: "Campos requeridos: hotelId, checkInDate, checkOutDate" }, { status: 400 });
    }

    try {
        const booking = await Booking.create({
            userId,
            hotelId,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate)
        });

        const user= await User.findById(userId);
        const hotel = await Hotel.findById(hotelId);
        await fillRecommendations(user,hotel);
        return NextResponse.json(booking);
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: "Error al crear la reservación" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await connectDB();

    const session: any = await getSession();
    if (!session || !session.safeUser || !session.safeUser.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.safeUser.id;
    try {
        const now = new Date();
        const bookingsRaw = await Booking.find({
            userId,
            checkOutDate: { $gte: now }
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
        return NextResponse.json({ error: "Error al obtener reservaciones" }, { status: 500 });
    }
}
