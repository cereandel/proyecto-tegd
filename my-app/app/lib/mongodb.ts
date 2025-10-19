import mongoose from "mongoose";
import User from "./models/user.model";
import Hotel from "./models/hotel.model";
import Booking from "./models/booking.model";
import { getRecommendations } from "./services/recommendation.service";
const MONGO_URI: string = "mongodb://localhost:27017/staywise";

export async function connectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error("Error disconnecting MongoDB:", error);
  }
}

/**
 * Seeds the database with initial data if collections are empty.
 */
async function seedDatabase(): Promise<void> {
  try {
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount > 0) {
      console.log("Database already seeded. Skipping.");
      return;
    }

    console.log("Seeding database...");

    const hotels = await Hotel.create([
      {
        name: "The Grand Resort",
        description: "A luxurious stay.",
        location: "Miami",
        amenities: ["pool", "spa", "gym", "free-wifi"],
        hotelType: "Resort",
        pricePerNight: 450,
      },
      {
        name: "City Center Boutique",
        description: "Chic and modern.",
        location: "New York",
        amenities: ["free-wifi", "bar", "room-service"],
        hotelType: "Boutique",
        pricePerNight: 300,
      },
      {
        name: "Budget Stay Inn",
        description: "Affordable and clean.",
        location: "Chicago",
        amenities: ["free-wifi", "parking"],
        hotelType: "Budget",
        pricePerNight: 90,
      },
      {
        name: "Oceanview Getaway",
        description: "Beachfront paradise.",
        location: "Malibu",
        amenities: ["pool", "beach-access", "spa"],
        hotelType: "Resort",
        pricePerNight: 500,
      },
      {
        name: "The Business Hub",
        description: "For the modern professional.",
        location: "New York",
        amenities: ["gym", "free-wifi", "conference-room"],
        hotelType: "Business",
        pricePerNight: 250,
      },
    ]);

    
    /*
    const user = await User.create({
      username: "john_doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    const booking1 = await Booking.create({
      user: user._id,
      hotel: hotels[0]._id,
      checkInDate: new Date(),
      checkOutDate: new Date(),
    });
    const booking2 = await Booking.create({
      user: user._id,
      hotel: hotels[3]._id,
      checkInDate: new Date(),
      checkOutDate: new Date(),
    });

    // @ts-ignore
    user.bookings.push(booking1._id, booking2._id);
    await user.save();

    console.log("Database seeded successfully!");
    */
    console.log("Database seeded successfully (hotels only)!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

/**
 * Main function to run the application logic.
 */
export async function processRecommendations() {
  await connectDB();
  await seedDatabase();

  // No sample user available by default; just disconnect after seeding.
  await mongoose.disconnect();
  return null;
}
