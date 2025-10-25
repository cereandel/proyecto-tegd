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
      hotelType: { type: [String], enum: ["Resort","Budget", "Boutique", "Business", "Family"] },
      priceRange: { type: [String], enum: ["Low", "Medium", "Expensive"] },
      groupSize: { type: [String], enum: ["Solo", "Couple", "Family", "Group"] },
      amenities: { type: [String], enum: ["wifi", "breakfast", "gym", "pool", "parking","free-wifi","conference-room",
                                          "beach-access", "spa","bar", "room-service"] }
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
