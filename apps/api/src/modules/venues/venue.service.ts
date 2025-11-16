import { Prisma, PrismaClient, Venue } from '@prisma/client';
import { prisma } from '../../db/client';

export interface VenueSeed extends Omit<Prisma.VenueCreateInput, 'events' | 'reservations'> {
  orderIndex: number;
}

const VENUE_SEEDS: VenueSeed[] = [
  {
    orderIndex: 1,
    name: 'The Garret West',
    address: '296 Bleecker St, New York, NY 10014',
    city: 'New York City',
    lat: 40.7318,
    lng: -74.0031,
    bookingType: 'manual',
    bookingProvider: null,
    bookingUrl: 'https://www.thegarretnyc.com/',
    phone: '+1-212-929-4519',
    website: 'https://www.thegarretnyc.com/',
    rating: 4.5,
    priceLevel: '$$',
    dressCodeSummary: 'Smart casual',
    groupFriendly: true
  },
  {
    orderIndex: 2,
    name: 'Da Andrea',
    address: '35 W 13th St, New York, NY 10011',
    city: 'New York City',
    lat: 40.7357,
    lng: -73.9964,
    bookingType: 'deeplink',
    bookingProvider: 'opentable',
    bookingUrl: 'https://www.opentable.com/r/da-andrea-new-york',
    phone: '+1-212-367-1979',
    website: 'https://daandreanyc.com/',
    rating: 4.7,
    priceLevel: '$$',
    dressCodeSummary: 'Smart casual',
    groupFriendly: true
  },
  {
    orderIndex: 3,
    name: 'Barcade Williamsburg',
    address: '388 Union Ave, Brooklyn, NY 11211',
    city: 'New York City',
    lat: 40.7113,
    lng: -73.9515,
    bookingType: 'manual',
    bookingProvider: null,
    bookingUrl: 'https://barcade.com/williamsburg/',
    phone: '+1-718-302-6464',
    website: 'https://barcade.com/williamsburg/',
    rating: 4.6,
    priceLevel: '$$',
    dressCodeSummary: 'Casual',
    groupFriendly: true
  },
  {
    orderIndex: 4,
    name: '230 Fifth Rooftop Bar',
    address: '1150 Broadway, New York, NY 10001',
    city: 'New York City',
    lat: 40.7440,
    lng: -73.9887,
    bookingType: 'webview_form',
    bookingProvider: 'custom',
    bookingUrl: 'https://www.230-fifth.com/reservations',
    phone: '+1-212-725-4300',
    website: 'https://www.230-fifth.com/',
    rating: 4.4,
    priceLevel: '$$',
    dressCodeSummary: 'Smart casual',
    groupFriendly: true
  }
];

export class VenueService {
  async ensureSeedVenues(tx?: Prisma.TransactionClient): Promise<Record<number, Venue>> {
    const client: Prisma.TransactionClient | PrismaClient = tx ?? prisma;
    const records: Record<number, Venue> = {};

    for (const seed of VENUE_SEEDS) {
      const existing = await client.venue.findFirst({
        where: { name: seed.name }
      });

      if (existing) {
        records[seed.orderIndex] = existing;
        continue;
      }

      const created = await client.venue.create({
        data: {
          name: seed.name,
          address: seed.address,
          city: seed.city,
          lat: seed.lat,
          lng: seed.lng,
          bookingType: seed.bookingType,
          bookingProvider: seed.bookingProvider,
          bookingUrl: seed.bookingUrl,
          phone: seed.phone,
          website: seed.website,
          rating: seed.rating,
          priceLevel: seed.priceLevel,
          dressCodeSummary: seed.dressCodeSummary,
          groupFriendly: seed.groupFriendly ?? true
        }
      });

      records[seed.orderIndex] = created;
    }

    return records;
  }
}

export const venueService = new VenueService();
