import mongoose from "mongoose";
import User from "./models/user.model";
import Hotel from "./models/hotel.model";
import Booking from "./models/booking.model";
import { getRecommendations } from "./services/recommendation.service";
import HotelModel from "./models/hotel.model";
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
          location:{
              city: 'Miami',
              country: 'USA',
          },
        amenities: ["pool", "spa", "gym", "free-wifi"],
        hotelType: "Resort",
        priceRange: "Expensive",
        groupSize: "Family",
        pricePerNight: 450,
      },
      {
        name: "City Center Boutique",
        description: "Chic and modern.",
          location:{
              city: 'New York',
              country: 'USA',
          },
        amenities: ["free-wifi", "bar", "room-service"],
        hotelType: "Boutique",
        priceRange: "Medium",
        groupSize: "Couple",
        pricePerNight: 300,
      },
      {
        name: "Budget Stay Inn",
        description: "Affordable and clean.",
          location:{
              city: 'Chicago',
              country: 'USA',
          },
        amenities: ["free-wifi", "parking"],
        hotelType: "Budget",
        priceRange: "Low",
        groupSize: "Solo",
        pricePerNight: 90,
      },
      {
        name: "Oceanview Getaway",
        description: "Beachfront paradise.",
          location:{
              city: 'Malibu',
              country: 'USA',
          },
        amenities: ["pool", "beach-access", "spa"],
        hotelType: "Resort",
        priceRange: "Medium",
        groupSize: "Couple",
        pricePerNight: 500,
      },
      {
        name: "The Business Hub",
        description: "For the modern professional.",
          location:{
              city: 'New York',
              country: 'USA',
          },
        amenities: ["gym", "free-wifi", "conference-room"],
        hotelType: "Business",
        groupSize: "Group",
        priceRange: "Expensive",
        pricePerNight: 250,
      },
    ]);

    

    const user = await User.create({
      name: "john_doe",
      email: "john.doe@example.com",
      password: "password123",
    });


    const booking1 = await Booking.create({
      userId: user._id,
      hotelId: hotels[0]._id,
      checkInDate: new Date(),
      checkOutDate: new Date(),
    });
    const booking2 = await Booking.create({
      userId: user._id,
      hotelId: hotels[3]._id,
      checkInDate: new Date(),
      checkOutDate: new Date(),
    });

          // @ts-ignore
      if (user.recommendations.hotelType.get(hotels[0].hotelType)){
          user.recommendations.hotelType.set(hotels[0].hotelType,user.recommendations.hotelType.get(hotels[0].hotelType)+1)
      }
      else{
          user.recommendations.hotelType.set(hotels[0].hotelType,1)
      }

      if (user.recommendations.priceRange.get(hotels[0].priceRange)){
          user.recommendations.priceRange.set(hotels[0].priceRange,user.recommendations.priceRange.get(hotels[0].priceRange)+1)
      }
      else{
          user.recommendations.priceRange.set(hotels[0].priceRange,1)
      }

      if (user.recommendations.groupSize.get(hotels[0].groupSize)){
          user.recommendations.groupSize.set(hotels[0].groupSize,user.recommendations.groupSize.get(hotels[0].groupSize)+1)
      }
      else{
          user.recommendations.groupSize.set(hotels[0].groupSize,1)
      }

      hotels[0].amenities.forEach((amenitie:string)=>{
          if (user.recommendations.amenities.get(amenitie)){
              user.recommendations.amenities.set(amenitie,user.recommendations.amenities.get(amenitie)+1)
          }
          else{
              user.recommendations.amenities.set(amenitie,1)
          }
      })

      if (user.recommendations.hotelType.get(hotels[3].hotelType)){
          user.recommendations.hotelType.set(hotels[3].hotelType,user.recommendations.hotelType.get(hotels[3].hotelType)+1)
      }
      else{
          user.recommendations.hotelType.set(hotels[3].hotelType,1)
      }

      if (user.recommendations.priceRange.get(hotels[3].priceRange)){
          user.recommendations.priceRange.set(hotels[3].priceRange,user.recommendations.priceRange.get(hotels[3].priceRange)+1)
      }
      else{
          user.recommendations.priceRange.set(hotels[3].priceRange,1)
      }

      if (user.recommendations.groupSize.get(hotels[3].groupSize)){
          user.recommendations.groupSize.set(hotels[3].groupSize,user.recommendations.groupSize.get(hotels[3].groupSize)+1)
      }
      else{
          user.recommendations.groupSize.set(hotels[3].groupSize,1)
      }

      hotels[3].amenities.forEach((amenitie:string)=>{
          if (user.recommendations.amenities.get(amenitie)){
              user.recommendations.amenities.set(amenitie,user.recommendations.amenities.get(amenitie)+1)
          }
          else{
              user.recommendations.amenities.set(amenitie,1)
          }
      })



          await user.save();

          console.log("Database seeded successfully!");

      //console.log("Database seeded successfully (hotels and one user only)!");
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

processRecommendations()