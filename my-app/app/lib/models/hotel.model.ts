import mongoose, { Schema, Document } from "mongoose";

export interface IHotel extends Document {
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
  },
  amenities: string[];
  hotelType: string;
  priceRange: string;
  groupSize: string;
  pricePerNight: number;
  images: { main?: string; others?: string[] };
  reviews: {
    stars: number;
    comment: string;
    date: Date;
  }[];
  averageRating: number;
}

const hotelSchema: Schema<IHotel> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    amenities: { type: [String], required: true, index: true },
    hotelType: { type: String, required: true, index: true },
    priceRange: { type: String, required: true, index: true },
    groupSize: { type: String, required: true, index: true },
    pricePerNight: { type: Number, required: true },
    averageRating: { type: Number, default: 0 },
    images: {
      main: {
        type: String,
        default: ""
      },
      others: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Hotel =
  mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", hotelSchema);

export default Hotel;
