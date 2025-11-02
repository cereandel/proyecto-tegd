import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  nights?: number;
  price?: number;
  confirmationNumber?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  services?: string[];
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    nights: { type: Number },
    price: { type: Number },
    confirmationNumber: { type: String },
    guestName: { type: String },
    guestPhone: { type: String },
    guestEmail: { type: String },
    services: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
