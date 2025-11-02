import mongoose, { FilterQuery } from "mongoose";
import User, { IUser } from "./models/user.model";
import Hotel, { IHotel } from "./models/hotel.model";
import fs from "fs/promises";
import path from "path";
import seedUsers from "./seedUsers";

const MONGO_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/staywise";
declare global {
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


export async function getRecommendedHoteles(user: IUser | null | undefined) {
  // If no user provided, return an empty array rather than throwing
  if (!user) {
    return [];
  }


  const noValuesGreaterThan5 = Object.values(user.recommendations).every(map =>
    Array.from(map.values()).every(score => score < 5)
  );

  const hasPreferences = user.preferences?.hotelType ||
    user.preferences?.priceRange ||
    user.preferences?.groupSize ||
    (user.preferences?.amenities && user.preferences.amenities.length > 0)

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

  return [];

}

export async function getRecommendedHotelesLocation(user: IUser) {
  const hotels = await Hotel.find({ 'location.city': user.city }).sort({ averageRating: -1 }).exec();

  try {
    const explanations = hotels.map(h => ({ name: h.name || h._id, reasons: [`location.city=${user.city}`] }));
    console.log(`Recommendation reasons (location) for user ${user._id}:`, explanations);
  } catch (e) {
    console.error('Error logging recommendation explanations (location):', e);
  }

  return hotels;
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

  const hotels = await Hotel.find(query).sort({ averageRating: -1 }).exec();

  // Log why each hotel matched the user's explicit preferences
  try {
    const explanations = hotels.map((h) => {
      const reasons: string[] = [];
      if (user.preferences.hotelType && h.hotelType === user.preferences.hotelType) reasons.push(`hotelType=${h.hotelType}`);
      if (user.preferences.priceRange && h.priceRange === user.preferences.priceRange) reasons.push(`priceRange=${h.priceRange}`);
      if (user.preferences.groupSize && h.groupSize === user.preferences.groupSize) reasons.push(`groupSize=${h.groupSize}`);
      if (Array.isArray(user.preferences.amenities) && user.preferences.amenities.length > 0) {
        const matched = user.preferences.amenities.filter(a => Array.isArray(h.amenities) && h.amenities.includes(a));
        if (matched.length > 0) reasons.push(`amenities=[${matched.join(',')}]`);
      }
      return { name: h.name || h._id, reasons };
    });
    console.log(`Recommendation reasons (preferences) for user ${user._id}:`, explanations);
  } catch (e) {
    // don't block recommendation on logging errors
    console.error('Error logging recommendation explanations (preferences):', e);
  }

  return hotels;
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

  const hotels = await Hotel.find(query).sort({ averageRating: -1 }).exec();

  // Log why each hotel matched by inferred type/price/group recommendations
  try {
    const explanations = hotels.map((h) => {
      const reasons: string[] = [];
      if (typesToQuery.length > 0 && typesToQuery.includes(h.hotelType)) reasons.push(`hotelType=${h.hotelType}`);
      if (groupsToQuery.length > 0 && groupsToQuery.includes(h.groupSize)) reasons.push(`groupSize=${h.groupSize}`);
      if (pricesToQuery.length > 0 && pricesToQuery.includes(h.priceRange)) reasons.push(`priceRange=${h.priceRange}`);
      return { name: h.name || h._id, reasons };
    });
    console.log(`Recommendation reasons (type/price/group) for user ${user._id}:`, explanations);
  } catch (e) {
    console.error('Error logging recommendation explanations (type):', e);
  }

  return hotels;
}


export async function getRecommendedHotelesAmenities(user: IUser) {
  const amenitiesEntries = Array.from(user.recommendations.amenities.entries());
  const sortedRecommendedAmenities = amenitiesEntries
    .filter(([type, score]) => score >= 5)
    .sort((a, b) => b[1] - a[1]);
  const amenitiesToQuery = sortedRecommendedAmenities.slice(0, 3).map(([type, score]) => type);
  const query = { amenities: { $in: amenitiesToQuery } }
  const hotels = await Hotel.find(query).sort({ averageRating: -1 }).exec();

  // Log why each hotel matched by amenities
  try {
    const explanations = hotels.map((h) => {
      const reasons: string[] = [];
      if (Array.isArray(h.amenities)) {
        const matched = amenitiesToQuery.filter(a => h.amenities.includes(a));
        if (matched.length > 0) reasons.push(`amenities=[${matched.join(',')}]`);
      }
      return { name: h.name || h._id, reasons };
    });
    console.log(`Recommendation reasons (amenities) for user ${user._id}:`, explanations);
  } catch (e) {
    console.error('Error logging recommendation explanations (amenities):', e);
  }

  return hotels;
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


async function seedDatabase(): Promise<void> {
  try {
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount > 0) {
      console.log("Database already seeded. Skipping.");
      return;
    }

    let hotelsToCreate: Partial<IHotel>[] = [];
    try {
      const jsonPath = path.resolve(process.cwd(), "scripts/seed/hotels.json");
      const content = await fs.readFile(jsonPath, "utf-8");
      hotelsToCreate = JSON.parse(content) as Partial<IHotel>[];
      if (!Array.isArray(hotelsToCreate) || hotelsToCreate.length === 0) {
        console.log(`No hotels found in ${jsonPath}. Skipping seeding.`);
        return;
      }
    } catch (err) {
      const attempted = path.resolve(process.cwd(), "scripts/seed/hotels.json");
      console.error(`Could not read hotels JSON for seeding (tried ${attempted}):`, err);
      return;
    }

    const hotels = await Hotel.create(hotelsToCreate);


    try {
      await seedUsers(true);
    } catch (err) {
      console.error('Error seeding users after hotels:', err);
    }

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

processRecommendations();
