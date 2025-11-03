import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  city: string;
  country: string;
  preferences?: {
    hotelType: string;
    priceRange: string;
    groupSize: string;
    amenities: string[];
  } | null;
  recommendations: {
    hotelType: Map<string, number>;
    priceRange: Map<string, number>;
    groupSize: Map<string, number>;
    amenities: Map<string, number>;
  }
  sessionToken?: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    lastName: { type: String, required: false, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    city: { type: String, required: true, default: 'Miami' },
    country: { type: String, required: true, default: 'USA' },
    sessionToken: { type: String },
    preferences: {
      type: new Schema(
        {
          hotelType: {
            type: String,
            enum: ["Resort","", "Boutique", "Business", "Family", "Hostel", "Apartment"],
          },
          priceRange: {
            type: String,
            enum: ["economic","", "medium", "luxury"],
          },
          groupSize: {
            type: String,
            enum: ["Solo","", "Couple", "Family", "Group"],
          },
          amenities: {
            type: [String],
            enum: [
              "wifi",
              "breakfast",
              "gym",
              "pool",
            ],
          },
        },
        { _id: false }
      ),
      default: null,
    },

    recommendations: {
      hotelType: {
        type: Map,
        of: Number,
        default: new Map()
      },
      priceRange: {
        type: Map,
        of: Number,
        default: new Map()
      },
      groupSize: {
        type: Map,
        of: Number,
        default: new Map()
      },
      amenities: {
        type: Map,
        of: Number,
        default: new Map()
      },
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
