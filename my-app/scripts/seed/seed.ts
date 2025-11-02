import path from 'path';
import fs from 'fs';
import { connectDB } from '../../app/lib/mongodb';
import Hotel from '../../app/lib/models/hotel.model';
import User from '../../app/lib/models/user.model';
import seedUsers from '../../app/lib/seedUsers';

async function main() {
    const args = process.argv.slice(2);
    const force = args.includes('--force');

    const jsonPath = path.join(__dirname, 'hotels.json');
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const hotels = JSON.parse(raw) as any[];

    console.log('Connecting to DB...');
    await connectDB();

    if (force) {
        console.log('Removing existing hotels (force)...');
        await Hotel.deleteMany({});
    }

    const existing = await Hotel.countDocuments();
    if (existing > 0 && !force) {
        console.log('Hotels collection already populated. Run with --force to replace.');
        return;
    }

    console.log(`Inserting ${hotels.length} hotels...`);
    const schemaHotelTypes = (User.schema.path('preferences.hotelType') as any)?.enumValues || [];
    const schemaPriceRanges = (User.schema.path('preferences.priceRange') as any)?.enumValues || [];
    const schemaGroupSizes = (User.schema.path('preferences.groupSize') as any)?.enumValues || [];
    const schemaAmenities = (User.schema.path('preferences.amenities') as any)?.caster?.enumValues || [];

    const priceMap: Record<string, string> = {
        expensive: 'luxury',
        expensivee: 'luxury',
        medium: 'medium',
        mediume: 'medium',
        low: 'economic',
        cheap: 'economic',
        expensive_cap: 'luxury'
    };

    const hotelTypeMap: Record<string, string> = {
        resort: 'Resort',
        boutique: 'Boutique',
        business: 'Business',
        family: 'Family',
        hostel: 'Hostel',
        apartment: 'Apartment',
        bungalow: 'Boutique',
        guesthouse: 'Boutique',
        lodge: 'Boutique',
        eco: 'Boutique',
        modern: 'Apartment',
        budget: 'Apartment'
    };

    const groupSizeMap: Record<string, string> = {
        solo: 'Solo',
        couple: 'Couple',
        family: 'Family',
        group: 'Group',
        business: 'Solo'
    };

    const amenityMap: Record<string, string> = {
        wifi: 'wifi',
        'free-wifi': 'free-wifi',
        desayuno: 'breakfast',
        breakfast: 'breakfast',
        gimnasio: 'gym',
        gym: 'gym',
        piscina: 'pool',
        pool: 'pool',
        parking: 'parking',
        'conference-room': 'conference-room',
        'beach-access': 'beach-access',
        spa: 'spa',
        bar: 'bar',
        'room-service': 'room-service'
    };

    const normalizePrice = (val: any) => {
        if (!val) return undefined;
        const s = String(val).trim().toLowerCase();
        const direct = schemaPriceRanges.find((p: string) => p.toLowerCase() === s);
        if (direct) return direct;
        if (priceMap[s]) return priceMap[s];
        return schemaPriceRanges[0] || val;
    };

    const normalizeHotelType = (val: any) => {
        if (!val) return undefined;
        const s = String(val).trim();
        const direct = schemaHotelTypes.find((p: string) => p.toLowerCase() === s.toLowerCase());
        if (direct) return direct;
        const mapped = hotelTypeMap[s.toLowerCase()];
        if (mapped && schemaHotelTypes.includes(mapped)) return mapped;
        // fallback to first allowed type
        return schemaHotelTypes[0] || s;
    };

    const normalizeGroupSize = (val: any) => {
        if (!val) return undefined;
        const s = String(val).trim();
        const direct = schemaGroupSizes.find((p: string) => p.toLowerCase() === s.toLowerCase());
        if (direct) return direct;
        const mapped = groupSizeMap[s.toLowerCase()];
        if (mapped && schemaGroupSizes.includes(mapped)) return mapped;
        return schemaGroupSizes[0] || s;
    };

    const normalizeAmenities = (arr: any[]) => {
        if (!Array.isArray(arr)) return [];
        const out: string[] = [];
        for (const a of arr) {
            const s = String(a).trim().toLowerCase();
            const mapped = amenityMap[s] || amenityMap[s.replace(/\s+/g, '-')];
            if (mapped) {
                if (schemaAmenities && schemaAmenities.length > 0) {
                    if (schemaAmenities.includes(mapped)) out.push(mapped);
                } else {
                    out.push(mapped);
                }
            }
        }
        return Array.from(new Set(out));
    };

    const normalizedHotels = hotels.map((h) => {
        const nh: any = { ...h };
        nh.priceRange = normalizePrice(h.priceRange) || nh.priceRange;
        nh.hotelType = normalizeHotelType(h.hotelType) || nh.hotelType;
        nh.groupSize = normalizeGroupSize(h.groupSize) || nh.groupSize;
        nh.amenities = normalizeAmenities(h.amenities || []);
        return nh;
    });

    await Hotel.create(normalizedHotels);
    console.log('Hotels inserted.');

    console.log('Seeding users and bookings...');
    await seedUsers(force);
    console.log('Seeding complete.');
}

main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
