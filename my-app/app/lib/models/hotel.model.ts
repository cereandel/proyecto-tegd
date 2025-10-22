import mongoose, { Schema, Document } from "mongoose";

export interface IHotel extends Document {
  name: string;
  description: string;
  location: string;
  amenities: string[];
  hotelType: string;
  pricePerNight: number;
  imageUrl?: string;
}

const hotelSchema: Schema<IHotel> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    amenities: { type: [String], required: true, index: true },
    hotelType: { type: String, required: true, index: true },
    pricePerNight: { type: Number, required: true },
    imageUrl: {
      type: String,
      default: "https://placehold.co/600x400/EEE/31343C?text=Hotel",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Hotel =
  mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", hotelSchema);

export default Hotel;
