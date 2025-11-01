import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Booking from "@/app/lib/models/booking.model";
import { getSession } from "@/app/lib/auth/auth";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const session: any = await getSession();
        if (!session || !session.safeUser || !session.safeUser.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.safeUser.id;

        const bookingId = params.id;
        if (!bookingId) {
            return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
        }

        const booking: any = await Booking.findById(bookingId).lean();
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        if (String(booking.userId) !== String(userId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await Booking.deleteOne({ _id: bookingId });

        return NextResponse.json({ success: true, message: "Booking cancelled" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
