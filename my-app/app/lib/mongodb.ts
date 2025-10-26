import mongoose from "mongoose";
import User, {IUser} from "./models/user.model";
import Hotel, {IHotel} from "./models/hotel.model";
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

function checkRecommendationsMap(type: keyof IUser['recommendations'],key:string, user:IUser){
    return user.recommendations[type].get(key)
}


export async function getHoteles(){
   return await Hotel.find().exec();
}


export async function fillRecommendations(user:IUser,hotel:IHotel){
    try {
        if(checkRecommendationsMap('hotelType',hotel.hotelType,user)){
            // @ts-ignore
            user.recommendations.hotelType.set(hotel.hotelType,user.recommendations.hotelType.get(hotel.hotelType)+1)
        }
        else{
            user.recommendations.hotelType.set(hotel.hotelType,1)
        }
        if (checkRecommendationsMap('priceRange',hotel.priceRange,user)){
            // @ts-ignore
            user.recommendations.priceRange.set(hotel.priceRange,user.recommendations.priceRange.get(hotel.priceRange)+1)
        }
        else{
            user.recommendations.priceRange.set(hotel.priceRange,1)
        }

        if (checkRecommendationsMap('groupSize',hotel.groupSize,user)){
            // @ts-ignore
            user.recommendations.groupSize.set(hotel.groupSize,user.recommendations.groupSize.get(hotel.groupSize)+1)
        }
        else{
            user.recommendations.groupSize.set(hotel.groupSize,1)
        }

        hotel.amenities.forEach((amenitie:string)=>{
            if (checkRecommendationsMap('amenities',amenitie,user)){
                // @ts-ignore
                user.recommendations.amenities.set(amenitie,user.recommendations.amenities.get(amenitie)+1)
            }
            else{
                user.recommendations.amenities.set(amenitie,1)
            }
        })


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
        averageRating: 5,
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
          averageRating: 3,
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
        hotelType: "Resort",
        priceRange: "Low",
        groupSize: "Solo",
          averageRating: 1,
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
          averageRating: 2,
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
          averageRating: 4.7,
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

    await fillRecommendations(user,hotels[0]);
    await fillRecommendations(user,hotels[3]);

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

//processRecommendations()