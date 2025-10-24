import mongoose, { Document, Types } from "mongoose";
import User from "../models/user.model";
import Hotel from "../models/hotel.model";
import Booking from "../models/booking.model";

interface IHotel extends Document {
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
  };
  amenities: string[];
  hotelType: string;
  pricePerNight: number;
  images: string[];
  reviews?: {
    stars: number;
    comment: string;
    date: Date;
  }[];
  averageRating: number;
}

interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  preferences: {
    hotelType: string[];
    priceRange: string[];
    groupSize: string[];
    amenities: string[];
  };
  sessionToken?: string;
}

interface PreferenceProfile {
  amenities: Map<string, number>;
  hotelTypes: Map<string, number>;
}

interface ScoredHotel extends IHotel {
  score: number;
}

function isHotelPopulated(hotelId: Types.ObjectId | IHotel): hotelId is IHotel {
  return (hotelId as IHotel).name !== undefined;
}

function buildPreferenceProfile(bookings: IBooking[]): PreferenceProfile {
  const profile: PreferenceProfile = {
    amenities: new Map<string, number>(),
    hotelTypes: new Map<string, number>(),
  };

  if (!bookings || bookings.length === 0) {
    return profile;
  }

  bookings.forEach((booking) => {
    if (!isHotelPopulated(booking.hotelId)) {
      console.warn("Hotel details are not populated. Skipping this booking.");
      return;
    }

    const hotel = booking.hotelId as IHotel;

    hotel.amenities.forEach((amenity) => {
      profile.amenities.set(amenity, (profile.amenities.get(amenity) || 0) + 1);
    });

    const type = hotel.hotelType;
    profile.hotelTypes.set(type, (profile.hotelTypes.get(type) || 0) + 1);
  });

  return profile;
}

function getPriceRangeBoundaries(priceRanges: string[]): {
  min: number;
  max: number;
} {
  let min = 0;
  let max = Number.MAX_SAFE_INTEGER;

  priceRanges.forEach((range) => {
    switch (range) {
      case "economic":
        min = Math.min(min, 0);
        max = Math.min(max, 100);
        break;
      case "medium":
        min = Math.max(min, 100);
        max = Math.min(max, 250);
        break;
      case "luxury":
        min = Math.max(min, 250);
        break;
    }
  });

  return { min, max };
}

/**
 * Calculates a recommendation score for a hotel based on user preferences.
 * @param {IHotel} hotel - The hotel document to score.
 * @param {PreferenceProfile} profile - The user's preference profile.
 * @returns {number} The calculated score for the hotel.
 */
function calculateMatchScore(
  hotel: IHotel,
  profile: PreferenceProfile,
  userPreferences: IUser["preferences"]
): number {
  let score = 0;

  // Add points for each matching amenity found in the user's profile
  hotel.amenities.forEach((amenity) => {
    if (profile.amenities.has(amenity)) {
      // The more a user likes an amenity, the higher the score
      score += profile.amenities.get(amenity) as number;
    }
  });

  // Add points if the hotel type matches a preferred type
  if (profile.hotelTypes.has(hotel.hotelType)) {
    // Give a significant boost for matching the hotel type
    score += (profile.hotelTypes.get(hotel.hotelType) as number) * 2; // Weight type matches more heavily
  }

  // Score based on explicit preferences
  hotel.amenities.forEach((amenity) => {
    if (userPreferences.amenities.includes(amenity)) {
      score += 3; // Bonus for explicit preference match
    }
  });

  // Score based on explicit hotel type preference
  if (userPreferences.hotelType.includes(hotel.hotelType)) {
    score += 6; // Higher bonus for explicit hotel type match
  }

  // Price range matching
  const priceRange = getPriceRangeBoundaries(userPreferences.priceRange);
  if (
    hotel.pricePerNight >= priceRange.min &&
    hotel.pricePerNight <= priceRange.max
  ) {
    score += 5;
  }

  // Consider average rating
  score += hotel.averageRating * 2;

  return score;
}

/**
 * Generates hotel recommendations for a given user.
 * @param {string} userId - The ID of the user to generate recommendations for.
 * @returns {Promise<Array<ScoredHotel | IHotel>>} A promise that resolves to a sorted list of recommended hotels.
 */
async function getRecommendations(
  userId: string
): Promise<Array<ScoredHotel | IHotel>> {
  try {
    // 1. Fetch user and their complete booking history with populated hotels
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const bookings = await Booking.find({ userId: userId })
      .populate("hotelId")
      .exec();

    // 2. Build the preference profile from booking history
    const preferenceProfile = buildPreferenceProfile(bookings);

    // Handle case for new users with no bookings
    if (
      preferenceProfile.amenities.size === 0 &&
      preferenceProfile.hotelTypes.size === 0
    ) {
      const priceRange = getPriceRangeBoundaries(user.preferences.priceRange);

      const preferenceHotels = (await Hotel.find({
        hotelType: { $in: user.preferences.hotel_type },
        amenities: { $in: user.preferences.amenities },
        pricePerNight: { $gte: priceRange.min, $lte: priceRange.max },
      })
        .limit(10)
        .lean()) as Array<Partial<IHotel> & { _id: Types.ObjectId }>;

      const transformedHotels = preferenceHotels.map((hotel) => ({
        name: hotel.name || "Unknown",
        description: hotel.description || "No description",
        location: hotel.location || { city: "Unknown", country: "Unknown" },
        amenities: hotel.amenities || [],
        hotelType: hotel.hotelType || "Unknown",
        pricePerNight: hotel.pricePerNight || 0,
        images: hotel.images || [],
        averageRating: hotel.averageRating || 0,
        _id: hotel._id.toString(),
        score: 0,
      }));

      return transformedHotels as (IHotel | ScoredHotel)[];
    }

    // 3. Get a list of hotels the user has already booked to exclude them
    const bookedHotelIds = bookings.map((b) => b.hotel._id);

    // 4. Find potential hotels to recommend (i.e., ones the user hasn't booked)
    // @ts-ignore
    const potentialHotels: IHotel[] = await Hotel.find({
      _id: { $nin: bookedHotelIds },
    }).lean();

    // 5. Score each potential hotel against the user's profile
    // @ts-ignore
    const scoredHotels: ScoredHotel[] = potentialHotels.map((hotel) => ({
      ...hotel,
      score: calculateMatchScore(hotel, preferenceProfile, user.preferences),
    }));

    // 6. Sort hotels by score in descending order
    scoredHotels.sort((a, b) => b.score - a.score);

    console.log(`Recommendations for ${user.username}:`);
    scoredHotels
      .slice(0, 5)
      .forEach((h) => console.log(`- ${h.name} (Score: ${h.score})`));

    return scoredHotels;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return []; // Return an empty array on error
  }
}

export { getRecommendations };
