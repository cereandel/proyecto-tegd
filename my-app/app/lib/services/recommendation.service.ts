import mongoose, { Document } from 'mongoose';
import User from '../models/user.model';
import Hotel from '../models/hotel.model';

interface IHotel extends Document {
    name: string;
    description: string;
    location: string;
    amenities: string[];
    hotelType: string;
    pricePerNight: number;
    imageUrl?: string;
}

interface IBooking extends Document {
    user: IUser['_id'];
    hotel: IHotel; // Represents a populated hotel field
    checkInDate: Date;
    checkOutDate: Date;
}

interface IUser extends Document {
    username: string;
    email: string;
    bookings: IBooking[]; // Represents a populated bookings array
}

// Defines the shape of the user's preference data
interface PreferenceProfile {
    amenities: Map<string, number>;
    hotelTypes: Map<string, number>;
}

// Extends the Hotel type to include our calculated score
interface ScoredHotel extends IHotel {
    score: number;
}


/**
 * Analyzes a user's booking history to build a preference profile.
 * @param {IBooking[]} bookings - A list of populated booking documents for a user.
 * @returns {PreferenceProfile} An object containing frequency maps of preferred amenities and hotel types.
 */
function buildPreferenceProfile(bookings: IBooking[]): PreferenceProfile {
    const profile: PreferenceProfile = {
        amenities: new Map<string, number>(),
        hotelTypes: new Map<string, number>(),
    };

    if (!bookings || bookings.length === 0) {
        return profile;
    }

    // Iterate through each booking to count amenities and hotel types
    bookings.forEach(booking => {
        // The 'hotel' field must be populated for this to work
        if (booking.hotel) {
            // Count amenities
            booking.hotel.amenities.forEach(amenity => {
                profile.amenities.set(amenity, (profile.amenities.get(amenity) || 0) + 1);
            });
            // Count hotel types
            const type = booking.hotel.hotelType;
            profile.hotelTypes.set(type, (profile.hotelTypes.get(type) || 0) + 1);
        }
    });

    return profile;
}

/**
 * Calculates a recommendation score for a hotel based on user preferences.
 * @param {IHotel} hotel - The hotel document to score.
 * @param {PreferenceProfile} profile - The user's preference profile.
 * @returns {number} The calculated score for the hotel.
 */
function calculateMatchScore(hotel: IHotel, profile: PreferenceProfile): number {
    let score = 0;

    // Add points for each matching amenity found in the user's profile
    hotel.amenities.forEach(amenity => {
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

    return score;
}


/**
 * Generates hotel recommendations for a given user.
 * @param {string} userId - The ID of the user to generate recommendations for.
 * @returns {Promise<Array<ScoredHotel | IHotel>>} A promise that resolves to a sorted list of recommended hotels.
 */
async function getRecommendations(userId: string): Promise<Array<ScoredHotel | IHotel>> {
    try {
        // 1. Fetch user and their complete booking history with populated hotels
        const user: IUser | null = await User.findById(userId).populate<{ bookings: IBooking[] }>({
            path: 'bookings',
            populate: {
                path: 'hotel',
                model: 'Hotel'
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // 2. Build the preference profile from booking history
        const preferenceProfile = buildPreferenceProfile(user.bookings);

        // Handle case for new users with no bookings
        if (preferenceProfile.amenities.size === 0 && preferenceProfile.hotelTypes.size === 0) {
            console.log("No booking history. Returning popular hotels.");
            // @ts-ignore
            return await Hotel.find({}).limit(10).lean();
        }

        // 3. Get a list of hotels the user has already booked to exclude them
        const bookedHotelIds = user.bookings.map(b => b.hotel._id);

        // 4. Find potential hotels to recommend (i.e., ones the user hasn't booked)
        // @ts-ignore
        const potentialHotels: IHotel[] = await Hotel.find({
            _id: { $nin: bookedHotelIds }
        }).lean();

        // 5. Score each potential hotel against the user's profile
        // @ts-ignore
        const scoredHotels: ScoredHotel[] = potentialHotels.map(hotel => ({
            ...hotel,
            score: calculateMatchScore(hotel, preferenceProfile),
        }));

        // 6. Sort hotels by score in descending order
        scoredHotels.sort((a, b) => b.score - a.score);

        console.log(`Recommendations for ${user.username}:`);
        scoredHotels.slice(0, 5).forEach(h => console.log(`- ${h.name} (Score: ${h.score})`));

        return scoredHotels;

    } catch (error) {
        console.error("Error generating recommendations:", error);
        return []; // Return an empty array on error
    }
}

export { getRecommendations };
