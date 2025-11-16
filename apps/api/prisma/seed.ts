import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed NYC venues
  const venues = [
    {
      name: 'Carbone',
      address: '181 Thompson St, New York, NY 10012',
      city: 'NYC',
      lat: 40.7276,
      lng: -74.0024,
      bookingType: 'api',
      bookingProvider: 'resy',
      bookingUrl: 'https://resy.com/cities/ny/carbone',
      phone: '(212) 254-3000',
      website: 'https://carbonenewyork.com',
      rating: 4.7,
      priceLevel: '$$$$',
      dressCodeSummary: 'Smart casual',
      groupFriendly: true,
    },
    {
      name: 'The Meatball Shop',
      address: '84 Stanton St, New York, NY 10002',
      city: 'NYC',
      lat: 40.7219,
      lng: -73.9877,
      bookingType: 'manual',
      bookingProvider: null,
      phone: '(212) 982-8895',
      website: 'https://themeatballshop.com',
      rating: 4.4,
      priceLevel: '$$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    },
    {
      name: 'Barcade',
      address: '388 Union Ave, Brooklyn, NY 11211',
      city: 'NYC',
      lat: 40.7065,
      lng: -73.9515,
      bookingType: 'manual',
      bookingProvider: null,
      phone: '(718) 302-6464',
      website: 'https://barcadebrooklyn.com',
      rating: 4.5,
      priceLevel: '$$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    },
    {
      name: 'The Roof at PUBLIC Hotel',
      address: '215 Chrystie St, New York, NY 10002',
      city: 'NYC',
      lat: 40.7227,
      lng: -73.9925,
      bookingType: 'deeplink',
      bookingProvider: 'opentable',
      bookingUrl: 'https://www.opentable.com/public-rooftop',
      phone: '(212) 735-6000',
      website: 'https://publichotels.com',
      rating: 4.6,
      priceLevel: '$$$',
      dressCodeSummary: 'Smart casual',
      groupFriendly: true,
    },
    {
      name: 'Brooklyn Bowl',
      address: '61 Wythe Ave, Brooklyn, NY 11249',
      city: 'NYC',
      lat: 40.7221,
      lng: -73.9576,
      bookingType: 'webview_form',
      bookingProvider: 'custom',
      bookingUrl: 'https://www.brooklynbowl.com/brooklyn/reservations',
      phone: '(718) 963-3369',
      website: 'https://www.brooklynbowl.com',
      rating: 4.5,
      priceLevel: '$$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    },
    {
      name: 'The Dead Rabbit',
      address: '30 Water St, New York, NY 10004',
      city: 'NYC',
      lat: 40.7034,
      lng: -74.0112,
      bookingType: 'manual',
      bookingProvider: null,
      phone: '(646) 422-7906',
      website: 'https://www.deadrabbitnyc.com',
      rating: 4.6,
      priceLevel: '$$$',
      dressCodeSummary: 'Smart casual',
      groupFriendly: true,
    },
    {
      name: 'Roberta\'s Pizza',
      address: '261 Moore St, Brooklyn, NY 11206',
      city: 'NYC',
      lat: 40.7051,
      lng: -73.9338,
      bookingType: 'api',
      bookingProvider: 'resy',
      bookingUrl: 'https://resy.com/cities/ny/robertas',
      phone: '(718) 417-1118',
      website: 'https://www.robertaspizza.com',
      rating: 4.5,
      priceLevel: '$$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    },
    {
      name: 'House of Yes',
      address: '2 Wyckoff Ave, Brooklyn, NY 11237',
      city: 'NYC',
      lat: 40.7043,
      lng: -73.9193,
      bookingType: 'webview_form',
      bookingProvider: 'custom',
      bookingUrl: 'https://houseofyes.org/events',
      phone: '(646) 838-4937',
      website: 'https://houseofyes.org',
      rating: 4.7,
      priceLevel: '$$',
      dressCodeSummary: 'Creative/festive',
      groupFriendly: true,
    },
  ];

  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { id: `seed-${venue.name.toLowerCase().replace(/\s/g, '-')}` },
      update: venue,
      create: {
        id: `seed-${venue.name.toLowerCase().replace(/\s/g, '-')}`,
        ...venue,
      },
    });
  }

  console.log(`Seeded ${venues.length} venues`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
