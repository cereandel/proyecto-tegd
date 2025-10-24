import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  preferences: {
    hotelType: string[];
    priceRange: string[];
    groupSize: string[];
    amenities: string[];
  }
  //bookings: mongoose.Types.ObjectId[];
  sessionToken?: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    sessionToken: { type: String },
    preferences: {
      hotelType: { type: [String], enum: ["resort", "boutique", "business", "family"] },
      priceRange: { type: [String], enum: ["economic", "midrange", "luxury"] },
      groupSize: { type: [String], enum: ["solo", "couple", "family", "group"] },
      amenities: { type: [String], enum: ["wifi", "breakfast", "gym", "pool", "parking"] }
    },

    /* bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],*/
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
