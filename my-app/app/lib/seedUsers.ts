import User from "./models/user.model";
import Booking from "./models/booking.model";
import Hotel from "./models/hotel.model";
import fs from "fs/promises";
import path from "path";

function randomFrom<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

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
            { name: 'alice garcia', email: 'alice@example.com', password: 'password1', city: '', country: '', },
            { name: 'bob rodriguez', email: 'bob@example.com', password: 'password2', city: '', country: '' },
            { name: 'carla martinez', email: 'carla@example.com', password: 'password3', city: '', country: '' },
            { name: 'diego lopez', email: 'diego@example.com', password: 'password4', city: '', country: '' },
            { name: 'elena hernandez', email: 'elena@example.com', password: 'password5', city: '', country: '' },
            { name: 'frank perez', email: 'frank@example.com', password: 'password6', city: '', country: '' },
            { name: 'gina gonzalez', email: 'gina@example.com', password: 'password7', city: '', country: '' },
            { name: 'hugo sanchez', email: 'hugo@example.com', password: 'password8', city: '', country: '' },
            { name: 'irene rivera', email: 'irene@example.com', password: 'password9', city: '', country: '' },
            { name: 'juan torres', email: 'juan@example.com', password: 'password10', city: '', country: '' }
        ];


        let hotelLocations: { city?: string; country?: string }[] = [];
        try {
            const hotelsPath = path.resolve(process.cwd(), "scripts/seed/hotels.json");
            const content = await fs.readFile(hotelsPath, "utf-8");
            const hotelsJson = JSON.parse(content);
            if (Array.isArray(hotelsJson)) {
                hotelLocations = hotelsJson
                    .map((h: any) => ({ city: h?.location?.city, country: h?.location?.country }))
                    .filter((lc: any) => lc.city && lc.country);
                const seen = new Set();
                hotelLocations = hotelLocations.filter((l) => {
                    const key = `${l.city}||${l.country}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
            }
        } catch (e) {
            console.warn('Could not read hotels.json for locations; falling back to configured user cities.', e);
        }

        console.log('Creating users...');
        const createdUsers: any[] = [];
        for (const u of usersToCreate) {
            const fullName = u.name;
            const preferences = u.hasOwnProperty('preferences') ? u.preferences : undefined;
            const loc = hotelLocations.length > 0 ? randomFrom(hotelLocations) : { city: u.city, country: u.country };
            const createPayload: any = { name: fullName, email: u.email, password: u.password, city: loc.city || u.city, country: loc.country || u.country };
            if (typeof preferences !== 'undefined') {
                createPayload.preferences = preferences;
            }
            const doc = await User.create(createPayload);
            createdUsers.push(doc);
        }

        console.log('Creating bookings for users...');
        const allHotels = await Hotel.find();
        const today = new Date();

        const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);

        // Helper: fill recommendation counters on a user from a hotel
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

        // Helper: create a booking for a user and immediately update recommendations
        const createBookingForUser = async (usr: any, htl: any, checkIn: Date, nights: number, tag?: string) => {
            const checkOut = new Date(checkIn.getTime() + nights * 24 * 60 * 60 * 1000);
            const confirmationNumber = `CONF-${Date.now()}-${Math.floor(Math.random() * 100000)}${tag ? `-${tag}` : ''}`;
            try {
                await Booking.create({
                    userId: usr._id,
                    hotelId: htl._id,
                    checkInDate: checkIn,
                    checkOutDate: checkOut,
                    nights,
                    price: (htl.pricePerNight || 0) * nights,
                    confirmationNumber,
                    guestName: usr.name,
                    guestEmail: usr.email,
                    services: Array.isArray(htl.amenities) ? htl.amenities.slice(0, Math.min(2, htl.amenities.length)) : [],
                });
                await fillRecommendations(usr, htl);
            } catch (e) {
                console.error('Error creating booking for user:', e);
            }
        };

        for (let i = 0; i < createdUsers.length; i++) {
            const user = createdUsers[i];
            // current booking: today -> +3 days
            const checkIn = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const hotel = allHotels[i % allHotels.length];
            await createBookingForUser(user, hotel, checkIn, 3, `i${i}`);

            // past bookings: 30 and 60 days ago
            const past1In = daysAgo(30);
            const pastHotel1 = allHotels[(i + 1) % allHotels.length];
            await createBookingForUser(user, pastHotel1, past1In, 4, `past1-${i}`);

            const past2In = daysAgo(60);
            const pastHotel2 = allHotels[(i + 2) % allHotels.length];
            await createBookingForUser(user, pastHotel2, past2In, 2, `past2-${i}`);

            // Create additional past bookings so each user has at least 10 bookings total
            const extraCount = 7; // 3 existing + 7 extra = 10
            for (let j = 0; j < extraCount; j++) {
                const days = 90 + j * 7; // spread extra bookings further in the past
                const extraIn = daysAgo(days);
                const extraNights = 1 + (j % 4);
                const extraHotel = allHotels[(i + 3 + j) % allHotels.length];
                await createBookingForUser(user, extraHotel, extraIn, extraNights, `extra-${i}-${j}`);
            }
        }

        console.log('User seeding complete.');
    } catch (err) {
        console.error('Error seeding users:', err);
        throw err;
    }
}

export default seedUsers;
