import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Hotel from "@/app/lib/models/hotel.model";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    try {
        await connectDB();
        // filtro para buscar por ciudad, tipo, nombre, descripción, amenities, hotelType, priceRange, groupSize
        const regex = new RegExp(query, "i");
        const hotels = await Hotel.find({
            $or: [
                { name: regex },
                { "location.city": query },
                { "location.country": query },
                { amenities: query }, 
                { hotelType: query }, 
                { priceRange: query }, 
                { groupSize: query } 
            ]
        }).lean();
        return NextResponse.json(hotels);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching hotels" }, { status: 500 });
    }
}
