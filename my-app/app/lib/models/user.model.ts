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
  };
  recommendations:{
      hotelType: Map<string,number>;
      priceRange: Map<string,number>;
      groupSize: Map<string,number>;
      amenities: Map<string,number>;
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
      hotelType: {
        type: [String],
        enum: ["Resort", "Boutique", "Business", "Family"],
        default: ["Resort"],
      },
      priceRange: {
        type: [String],
        enum: ["Low", "Medium", "Expensive"],
        default: ["Medium"],
      },
      groupSize: {
        type: [String],
        enum: ["Solo", "Couple", "Family", "Group"],
        default: ["Couple"],
      },
      amenities: {
        type: [String],
        enum: [
          "wifi",
          "breakfast",
          "gym",
          "pool",
          "parking",
          "free-wifi",
          "conference-room",
          "beach-access",
          "spa",
          "bar",
          "room-service",
        ],
        default: ["wifi", "breakfast"],
      },
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
