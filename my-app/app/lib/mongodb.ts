import mongoose, { FilterQuery } from "mongoose";
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

const getHighestScore = (map: Map<string, number>): number => {
  if (map.size === 0) {
    return 0;
  }
  return Math.max(...Array.from(map.values()));
};


export async function getRecommendedHoteles(user: IUser) {
  const noValuesGreaterThan5 = Object.values(user.recommendations).every(map =>
    Array.from(map.values()).every(score => score < 5)
  );

  const hasPreferences = user.preferences.hotelType ||
    user.preferences.priceRange ||
    user.preferences.groupSize ||
    (user.preferences.amenities && user.preferences.amenities.length > 0)

  if (hasPreferences) {
    return await getRecommendedHotelesPreferencias(user)
  }

  if (!noValuesGreaterThan5) {
    const maxTypesScore = Math.max(
      getHighestScore(user.recommendations.hotelType),
      getHighestScore(user.recommendations.priceRange),
      getHighestScore(user.recommendations.groupSize)
    );
    const maxAmenitiesScore = getHighestScore(user.recommendations.amenities);

    if (maxAmenitiesScore >= maxTypesScore) {
      return await getRecommendedHotelesAmenities(user);
    }
    else {
      return await getRecommendedHotelesTipo(user);
    }
  }

  if (noValuesGreaterThan5 && !hasPreferences) {
    return await getRecommendedHotelesLocation(user)
  }

}

export async function getRecommendedHotelesLocation(user: IUser) {
  return await Hotel.find({ 'location.city': user.city }).sort({ averageRating: -1 }).exec();
}

export async function getRecommendedHotelesPreferencias(user: IUser) {
  const query: FilterQuery<IHotel> = {};

  if (user.preferences.hotelType) {
    query.hotelType = user.preferences.hotelType;
  }
  if (user.preferences.priceRange) {
    query.priceRange = user.preferences.priceRange;
  }
  if (user.preferences.groupSize) {
    query.groupSize = user.preferences.groupSize;
  }
  if (user.preferences.amenities && user.preferences.amenities.length > 0) {
    query.amenities = { $all: user.preferences.amenities };
  }
  return await Hotel.find(query).sort({ averageRating: -1 }).exec()
}


export async function getRecommendedHotelesTipo(user: IUser) {
  const query: FilterQuery<IHotel> = {};

  const typeEntries = Array.from(user.recommendations.hotelType.entries());
  const priceEntries = Array.from(user.recommendations.priceRange.entries());
  const groupEntries = Array.from(user.recommendations.groupSize.entries());
  const sortedRecommendedTypes = typeEntries
    .filter(([type, score]) => score >= 5)
    .sort((a, b) => b[1] - a[1]);
  const sortedRecommendedGroups = groupEntries
    .filter(([type, score]) => score >= 5)
    .sort((a, b) => b[1] - a[1]);
  const sortedRecommendedPrices = priceEntries
    .filter(([type, score]) => score >= 5)
    .sort((a, b) => b[1] - a[1]);
  const typesToQuery = sortedRecommendedTypes.slice(0, 3).map(([type, score]) => type);
  const groupsToQuery = sortedRecommendedGroups.slice(0, 3).map(([type, score]) => type);
  const pricesToQuery = sortedRecommendedPrices.slice(0, 3).map(([type, score]) => type);

  if (typesToQuery.length > 0) {
    query.hotelType = typesToQuery;
  }
  if (groupsToQuery.length > 0) {
    query.groupSize = groupsToQuery;
  }
  if (pricesToQuery.length > 0) {
    query.priceRange = pricesToQuery;
  }

  return await Hotel.find(query).sort({ averageRating: -1 }).exec();
}


export async function getRecommendedHotelesAmenities(user: IUser) {
  const amenitiesEntries = Array.from(user.recommendations.amenities.entries());
  const sortedRecommendedAmenities = amenitiesEntries
    .filter(([type, score]) => score >= 5)
    .sort((a, b) => b[1] - a[1]);
  const amenitiesToQuery = sortedRecommendedAmenities.slice(0, 3).map(([type, score]) => type);
  const query = { amenities: { $in: amenitiesToQuery } }
  return await Hotel.find(query).sort({ averageRating: -1 }).exec();
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
    await user.save()
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

    const today = new Date();
    const fiveDaysFromNow = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    const booking1 = await Booking.create({
      userId: user._id,
      hotelId: hotels[0]._id,
      checkInDate: today,
      checkOutDate: fiveDaysFromNow,
    });

    const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);

    const pastBooking1 = await Booking.create({
      userId: user._id,
      hotelId: hotels[1]._id,
      checkInDate: daysAgo(30),
      checkOutDate: daysAgo(25),
    });

    const pastBooking2 = await Booking.create({
      userId: user._id,
      hotelId: hotels[2]._id,
      checkInDate: daysAgo(60),
      checkOutDate: daysAgo(55),
    });

    const pastBooking3 = await Booking.create({
      userId: user._id,
      hotelId: hotels[4]._id,
      checkInDate: daysAgo(90),
      checkOutDate: daysAgo(85),
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
  await connectDB();
  await seedDatabase();
  await disconnectDB();
  return null;
}
//seedDatabase();
//processRecommendations();
