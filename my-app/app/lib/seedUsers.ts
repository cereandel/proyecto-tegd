import User from "./models/user.model";
import Booking from "./models/booking.model";
import Hotel from "./models/hotel.model";

function randomFrom<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickMany<T>(arr: T[], count: number) {
    const copy = [...arr];
    const out: T[] = [];
    for (let i = 0; i < count && copy.length > 0; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        out.push(copy.splice(idx, 1)[0]);
    }
    return out;
}

const HOTEL_TYPES = ["Resort", "Boutique", "Business", "Family", "Hostel", "Apartment"];
const PRICE_RANGES = ["economic", "medium", "luxury"];
const GROUP_SIZES = ["Solo", "Couple", "Family", "Group"];
const AMENITIES = [
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
];
const LAST_NAMES = ["García", "Rodríguez", "Martínez", "López", "Hernández", "Pérez", "González", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez", "Vargas", "Rojas"];

export async function seedUsers(force = true) {
    try {
        if (force) {
            console.log("Force: removing existing users and bookings...");
            await Booking.deleteMany({});
            await User.deleteMany({});
        }

        const existing = await User.countDocuments();
        if (existing > 0 && !force) {
            console.log("Users collection already populated. Skipping user seeding.");
            return;
        }

        const usersToCreate: Array<any> = [
            {
                name: 'alice garcia',
                email: 'alice@example.com',
                password: 'password1',
                city: 'Cancún',
                country: 'México',
                preferences: {
                    hotelType: 'Business',
                    priceRange: 'medium',
                    groupSize: 'Group',
                    amenities: ['wifi']
                }
            },
            { name: 'bob rodriguez', email: 'bob@example.com', password: 'password2', city: 'Miami Beach', country: 'USA' },
            { name: 'carla martinez', email: 'carla@example.com', password: 'password3', city: 'Barcelona', country: 'España' },
            { name: 'diego lopez', email: 'diego@example.com', password: 'password4', city: 'Lima', country: 'Perú' },
            { name: 'elena hernandez', email: 'elena@example.com', password: 'password5', city: 'Quito', country: 'Ecuador' },
            { name: 'frank perez', email: 'frank@example.com', password: 'password6', city: 'Santiago', country: 'Chile' },
            { name: 'gina gonzalez', email: 'gina@example.com', password: 'password7', city: 'Bogotá', country: 'Colombia' },
            { name: 'hugo sanchez', email: 'hugo@example.com', password: 'password8', city: 'Buenos Aires', country: 'Argentina' },
            { name: 'irene rivera', email: 'irene@example.com', password: 'password9', city: 'Madrid', country: 'España' },
            { name: 'juan torres', email: 'juan@example.com', password: 'password10', city: 'Tulum', country: 'México' }
        ];

        const schemaHotelTypes = (User.schema.path('preferences.hotelType') as any)?.enumValues;
        const schemaPriceRanges = (User.schema.path('preferences.priceRange') as any)?.enumValues;
        const schemaGroupSizes = (User.schema.path('preferences.groupSize') as any)?.enumValues;
        const schemaAmenities = (User.schema.path('preferences.amenities') as any)?.caster?.enumValues;

        const allowedHotelTypes = Array.isArray(schemaHotelTypes) && schemaHotelTypes.length > 0 ? schemaHotelTypes : HOTEL_TYPES;
        const allowedPriceRanges = Array.isArray(schemaPriceRanges) && schemaPriceRanges.length > 0 ? schemaPriceRanges : PRICE_RANGES;
        const allowedGroupSizes = Array.isArray(schemaGroupSizes) && schemaGroupSizes.length > 0 ? schemaGroupSizes : GROUP_SIZES;
        const allowedAmenities = Array.isArray(schemaAmenities) && schemaAmenities.length > 0 ? schemaAmenities : AMENITIES;

        console.log('Creating users...');
        const createdUsers: any[] = [];
        for (const u of usersToCreate) {
            const fullName = u.name;
            // allow per-user explicit preferences in seed object; otherwise pick random
            const preferences = u.preferences || {
                hotelType: randomFrom(allowedHotelTypes),
                priceRange: randomFrom(allowedPriceRanges),
                groupSize: randomFrom(allowedGroupSizes),
                amenities: pickMany(allowedAmenities, Math.max(1, Math.floor(Math.random() * Math.min(4, allowedAmenities.length))))
            };
            const doc = await User.create({ name: fullName, email: u.email, password: u.password, city: u.city, country: u.country, preferences });
            createdUsers.push(doc);
        }

        console.log('Creating bookings for users...');
        const allHotels = await Hotel.find();
        const today = new Date();

        const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);

        for (let i = 0; i < createdUsers.length; i++) {
            const user = createdUsers[i];
            // current booking: today -> +3 days
            const checkIn = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const checkOut = new Date(checkIn.getTime() + 3 * 24 * 60 * 60 * 1000);
            const hotel = allHotels[i % allHotels.length];
            await Booking.create({ userId: user._id, hotelId: hotel._id, checkInDate: checkIn, checkOutDate: checkOut, nights: 3, price: hotel.pricePerNight * 3, confirmationNumber: `CONF-${Date.now()}-${i}`, guestName: user.name, guestEmail: user.email, services: hotel.amenities.slice(0, 2) });

            // past bookings: 30 and 60 days ago
            const past1In = daysAgo(30);
            const past1Out = new Date(past1In.getTime() + 4 * 24 * 60 * 60 * 1000);
            const pastHotel1 = allHotels[(i + 1) % allHotels.length];
            await Booking.create({ userId: user._id, hotelId: pastHotel1._id, checkInDate: past1In, checkOutDate: past1Out, nights: 4, price: pastHotel1.pricePerNight * 4, confirmationNumber: `CONF-${Date.now()}-past1-${i}`, guestName: user.name, guestEmail: user.email, services: pastHotel1.amenities.slice(0, 1) });

            const past2In = daysAgo(60);
            const past2Out = new Date(past2In.getTime() + 2 * 24 * 60 * 60 * 1000);
            const pastHotel2 = allHotels[(i + 2) % allHotels.length];
            await Booking.create({ userId: user._id, hotelId: pastHotel2._id, checkInDate: past2In, checkOutDate: past2Out, nights: 2, price: pastHotel2.pricePerNight * 2, confirmationNumber: `CONF-${Date.now()}-past2-${i}`, guestName: user.name, guestEmail: user.email, services: pastHotel2.amenities.slice(0, 1) });
            try {
                const fillRecommendations = async (usr: any, htl: any) => {
                    try {
                        if (!usr.recommendations) {
                            usr.recommendations = {
                                hotelType: new Map(),
                                priceRange: new Map(),
                                groupSize: new Map(),
                                amenities: new Map(),
                            };
                        }

                        const incMap = (map: Map<string, number>, key: string) => {
                            if (!key) return;
                            const prev = map.get(key) || 0;
                            map.set(key, prev + 1);
                        };

                        // @ts-ignore
                        incMap(usr.recommendations.hotelType, htl.hotelType);
                        // @ts-ignore
                        incMap(usr.recommendations.priceRange, htl.priceRange);
                        // @ts-ignore
                        incMap(usr.recommendations.groupSize, htl.groupSize);
                        if (Array.isArray(htl.amenities)) {
                            htl.amenities.forEach((a: string) => {
                                // @ts-ignore
                                incMap(usr.recommendations.amenities, a);
                            });
                        }

                        await usr.save();
                    } catch (e) {
                        console.error('Error filling recommendations for user:', e);
                    }
                };

                await fillRecommendations(user, hotel);
                await fillRecommendations(user, pastHotel1);
                await fillRecommendations(user, pastHotel2);
            } catch (e) {
                console.error('Error updating user recommendations after bookings:', e);
            }
        }

        console.log('User seeding complete.');
    } catch (err) {
        console.error('Error seeding users:', err);
        throw err;
    }
}

export default seedUsers;
