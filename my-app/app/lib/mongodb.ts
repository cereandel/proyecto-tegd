import mongoose from "mongoose";
import User, { IUser } from "./models/user.model";
import Hotel, { IHotel } from "./models/hotel.model";
import Booking from "./models/booking.model";

const MONGO_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/staywise";

/**
 * a cached connection so the app doesn't open/close connections on every request.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var _mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cached = global._mongooseCache || { conn: null, promise: null };

export async function connectDB(): Promise<void> {
  try {
    if (cached.conn) {
      return;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGO_URI).then(() => {
        cached.conn = mongoose;
        console.log("MongoDB connected successfully.");
        return mongoose;
      });
      global._mongooseCache = cached;
    }

    await cached.promise;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    if (
      process.env.MONGODB_FORCE_DISCONNECT === "1" ||
      process.env.NODE_ENV === "test"
    ) {
      await mongoose.disconnect();
      global._mongooseCache = { conn: null, promise: null };
    } else {
      return;
    }
  } catch (error) {
    console.error("Error disconnecting MongoDB:", error);
  }
}

function checkRecommendationsMap(
  type: keyof IUser["recommendations"],
  key: string,
  user: IUser
) {
  return user.recommendations[type].get(key);
}

export async function getHoteles() {
  return await Hotel.find().exec();
}

export async function fillRecommendations(user: IUser, hotel: IHotel) {
  try {
    if (checkRecommendationsMap("hotelType", hotel.hotelType, user)) {
      // @ts-ignore
      user.recommendations.hotelType.set(hotel.hotelType, user.recommendations.hotelType.get(hotel.hotelType) + 1);
    } else {
      user.recommendations.hotelType.set(hotel.hotelType, 1);
    }
    if (checkRecommendationsMap("priceRange", hotel.priceRange, user)) {
      // @ts-ignore
      user.recommendations.priceRange.set(hotel.priceRange, user.recommendations.priceRange.get(hotel.priceRange) + 1);
    } else {
      user.recommendations.priceRange.set(hotel.priceRange, 1);
    }

    if (checkRecommendationsMap("groupSize", hotel.groupSize, user)) {
      // @ts-ignore
      user.recommendations.groupSize.set(hotel.groupSize, user.recommendations.groupSize.get(hotel.groupSize) + 1
      );
    } else {
      user.recommendations.groupSize.set(hotel.groupSize, 1);
    }

    hotel.amenities.forEach((amenitie: string) => {
      if (checkRecommendationsMap("amenities", amenitie, user)) {
        // @ts-ignore
        user.recommendations.amenities.set(amenitie, user.recommendations.amenities.get(amenitie) + 1
        );
      } else {
        user.recommendations.amenities.set(amenitie, 1);
      }
    });
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

    const hotelsToCreate = [
      {
        name: "Grand Luxury Resort",
        description: "Resort frente a la playa con piscina infinita y spa.",
        location: { city: "Cancún", country: "México" },
        amenities: ["wifi", "desayuno", "gimnasio", "piscina"],
        hotelType: "Resort",
        priceRange: "Expensive",
        groupSize: "Family",
        averageRating: 4.8,
        pricePerNight: 250,
        images: {
          main: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1080&q=80",
          others: [
            "https://images.unsplash.com/photo-1759303690206-1dc66e9ef8ed?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1543539571-2d88da875d21?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1757889693295-27cf12654c4b?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?auto=format&fit=crop&w=1080&q=80",
          ],
        },

      },
      {
        name: "Ocean View Paradise",
        description: "Habitaciones con vistas al mar y desayuno incluido.",
        location: { city: "Miami Beach", country: "USA" },
        amenities: ["wifi", "desayuno", "piscina"],
        hotelType: "Resort, Playa",
        priceRange: "Expensive",
        groupSize: "Couple",
        averageRating: 4.9,
        pricePerNight: 320,
        images: {
          main: "https://images.unsplash.com/photo-1729605412184-8d796f9c6f66?auto=format&fit=crop&w=1080&q=80",
          others: [
            "https://images.unsplash.com/photo-1697216563517-e48622ba218c?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1641150557653-e4c409426e59?auto=format&fit=crop&w=1080&q=80",
          ],
        },
      },
      {
        name: "Metropolitan Hotel",
        description: "Céntrico y moderno, ideal para viajeros de negocios.",
        location: { city: "Ciudad de México", country: "México" },
        amenities: ["wifi", "gimnasio"],
        hotelType: "Business, Modern",
        priceRange: "Medium",
        groupSize: "Business",
        averageRating: 4.7,
        pricePerNight: 180,
        images: {
          main: "https://images.unsplash.com/photo-1695706807850-8c66b24b3413?auto=format&fit=crop&w=1080&q=80",
          others: [
            "https://images.unsplash.com/photo-1731336478850-6bce7235e320?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1757506417384-76c0439c97ee?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1641150557653-e4c409426e59?auto=format&fit=crop&w=1080&q=80",
          ],
        },
      },
      {
        name: "Boutique Casa Blanca",
        description: "Encantador hotel boutique en el centro de la ciudad.",
        location: { city: "Barcelona", country: "España" },
        amenities: ["wifi", "desayuno"],
        hotelType: "Boutique, Luxury",
        priceRange: "Expensive",
        groupSize: "Couple",
        averageRating: 4.9,
        pricePerNight: 280,
        images: {
          main: "https://images.unsplash.com/photo-1649731000184-7ced04998f44?auto=format&fit=crop&w=1080&q=80",
          others: [
            "https://images.unsplash.com/photo-1641150557653-e4c409426e59?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1716084380738-ea83a1c17716?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1757506417384-76c0439c97ee?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?auto=format&fit=crop&w=1080&q=80",
          ],
        },
      },
      {
        name: "Infinity Pool Sanctuary",
        description: "Vistas panorámicas y piscina privada en algunas suites.",
        location: { city: "Santorini", country: "Grecia" },
        amenities: ["wifi", "piscina", "desayuno"],
        hotelType: "Resort, Luxury",
        priceRange: "Expensive",
        groupSize: "Couple",
        averageRating: 4.9,
        pricePerNight: 420,
        images: {
          main: "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?auto=format&fit=crop&w=1080&q=80",
          others: [
            "https://images.unsplash.com/photo-1709744873177-714d7ab0fe02?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1697216563517-e48622ba218c?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1757506417384-76c0439c97ee?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1744352030314-a48c8feeee2b?auto=format&fit=crop&w=1080&q=80",
          ],
        },
      },
    ];

    const hotels = await Hotel.create(hotelsToCreate);

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

    await fillRecommendations(user, hotels[0]);
    await fillRecommendations(user, hotels[3]);

    await user.save();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function processRecommendations() {
  await seedDatabase();
  return null;
}

processRecommendations();
