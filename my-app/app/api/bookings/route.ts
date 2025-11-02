import { NextResponse } from "next/server";
import { connectDB, fillRecommendations } from "@/app/lib/mongodb";
import Booking from "@/app/lib/models/booking.model";
import Hotel from "@/app/lib/models/hotel.model";
import { getSession } from "@/app/lib/auth/auth";
import User from "@/app/lib/models/user.model";

export async function POST(request: Request) {
    await connectDB();
    const data = await request.json();

    const { hotelId, checkInDate, checkOutDate, services } = data;

    const session: any = await getSession();
    if (!session || !session.safeUser || !session.safeUser.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.safeUser.id;


    if (!hotelId || !checkInDate || !checkOutDate) {
        return NextResponse.json({ error: "Campos requeridos: hotelId, checkInDate, checkOutDate" }, { status: 400 });
    }

    try {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));

        const hotel = (await Hotel.findById(hotelId).lean()) as any | null;
        const pricePerNight = hotel && typeof hotel.pricePerNight === 'number' ? hotel.pricePerNight : 0;
        const price = Number((pricePerNight * nights).toFixed(2));

        const confirmationNumber = `BK-${Date.now().toString(36).toUpperCase()}`;

        // Try to populate guest info from the DB user if available
        const dbUser: any = await User.findById(userId).lean();
        const guestName = dbUser?.name ?? "";
        const guestPhone = dbUser?.phone ?? "";
        const guestEmail = dbUser?.email ?? "";

        const booking = await Booking.create({
            userId,
            hotelId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            nights,
            price,
            confirmationNumber,
            guestName,
            guestPhone,
            guestEmail,
            services: Array.isArray(services) ? services : [],
        });


        const savedBooking: any = await Booking.findById(booking._id).lean();
        const savedWithHotel = { ...savedBooking, hotel, hotelName: hotel?.name ?? "" };

        const dbUserFull = await User.findById(userId);
        if (dbUserFull && hotel) {
            await fillRecommendations(dbUserFull, hotel as any);
        }
        return NextResponse.json(savedWithHotel);
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
                // ensure guest fields and services are returned
                return { ...b, hotel, hotelName };
            })
        );

        return NextResponse.json({ bookings });
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener reservaciones" }, { status: 500 });
    }
}
