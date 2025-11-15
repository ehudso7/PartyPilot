import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const venues = [
    {
      id: 'bohemian-hall-astoria',
      name: 'Bohemian Hall & Beer Garden',
      address: '29-19 24th Ave, Astoria, NY 11102',
      city: 'New York',
      lat: 40.7703,
      lng: -73.9124,
      bookingType: 'manual',
      bookingProvider: null,
      bookingUrl: 'https://www.bohemianhall.com/',
      phone: '+1-718-274-4925',
      website: 'https://www.bohemianhall.com/',
      rating: 4.5,
      priceLevel: '$',
      dressCodeSummary: 'Casual beer garden; jeans, sneakers, hoodies all fine.',
      groupFriendly: true
    },
    {
      id: 'da-andrea-greenwich-village',
      name: 'Da Andrea',
      address: '35 W 13th St, New York, NY 10011',
      city: 'New York',
      lat: 40.7367,
      lng: -73.9967,
      bookingType: 'deeplink',
      bookingProvider: 'opentable',
      bookingUrl: 'https://www.opentable.com/r/da-andrea-new-york',
      phone: '+1-212-367-1979',
      website: 'https://www.daandreanyc.com/',
      rating: 4.6,
      priceLevel: '$$',
      dressCodeSummary: 'Casual to smart casual; date-night decent.',
      groupFriendly: true
    },
    {
      id: 'nomad-library-or-lounge',
      name: 'NoMad Library / Nearby Lounge',
      address: 'NoMad, New York, NY 10001',
      city: 'New York',
      lat: 40.7450,
      lng: -73.9880,
      bookingType: 'manual',
      bookingProvider: null,
      bookingUrl: null,
      phone: null,
      website: null,
      rating: 4.5,
      priceLevel: '$$',
      dressCodeSummary: 'Smart casual lounge; avoid athletic wear.',
      groupFriendly: true
    },
    {
      id: 'upstairs-at-66',
      name: 'Upstairs at 66',
      address: '46 Stone St, New York, NY 10004',
      city: 'New York',
      lat: 40.7046,
      lng: -74.0107,
      bookingType: 'manual',
      bookingProvider: null,
      bookingUrl: 'https://www.upstairsat66.com/',
      phone: '+1-646-751-6055',
      website: 'https://www.upstairsat66.com/',
      rating: 4.4,
      priceLevel: '$$',
      dressCodeSummary: 'Casual bar / game room.',
      groupFriendly: true
    },
    {
      id: '230-fifth-rooftop',
      name: '230 Fifth Rooftop Bar',
      address: '230 5th Ave, New York, NY 10001',
      city: 'New York',
      lat: 40.7440,
      lng: -73.9885,
      bookingType: 'deeplink',
      bookingProvider: 'custom',
      bookingUrl: 'https://www.230-fifth.com/',
      phone: '+1-212-725-4300',
      website: 'https://www.230-fifth.com/',
      rating: 4.3,
      priceLevel: '$$',
      dressCodeSummary: 'Upscale casual; no sweats or gym gear.',
      groupFriendly: true
    },
    {
      id: 'break-bar-billiards-astoria',
      name: 'Break Bar & Billiards',
      address: '32-04 Broadway, Astoria, NY 11106',
      city: 'New York',
      lat: 40.7609,
      lng: -73.9238,
      bookingType: 'manual',
      bookingProvider: null,
      bookingUrl: 'https://break-ny.com/astoria/',
      phone: '+1-718-777-5400',
      website: 'https://break-ny.com/astoria/',
      rating: 4.4,
      priceLevel: '$$',
      dressCodeSummary: 'Casual; bar + pool hall vibe.',
      groupFriendly: true
    },
    {
      id: 'stone-street-tavern',
      name: 'Stone Street Tavern',
      address: '52 Stone St, New York, NY 10004',
      city: 'New York',
      lat: 40.7047,
      lng: -74.0100,
      bookingType: 'manual',
      bookingProvider: null,
      bookingUrl: 'https://www.stonestreettavernnyc.com/',
      phone: '+1-212-785-5658',
      website: 'https://www.stonestreettavernnyc.com/',
      rating: 4.3,
      priceLevel: '$$',
      dressCodeSummary: 'Casual bar; fine for big groups.',
      groupFriendly: true
    }
  ];

  for (const v of venues) {
    await prisma.venue.upsert({
      where: { id: v.id },
      update: v,
      create: v
    });
  }

  console.log('Seeded venues:', venues.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
