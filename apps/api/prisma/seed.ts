import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@partypilot.com' },
    update: {},
    create: {
      email: 'test@partypilot.com',
      name: 'Test User',
      phone: '+1234567890',
    },
  });

  console.log('Created test user:', user.id);

  // Create sample NYC venues
  const venues = [
    {
      name: 'Da Andrea',
      address: '35 W 13th St, New York, NY 10011',
      city: 'NYC',
      lat: 40.7359,
      lng: -73.9967,
      bookingType: 'api',
      bookingProvider: 'resy',
      bookingUrl: 'https://resy.com/cities/ny/da-andrea',
      phone: '+1-212-367-1979',
      rating: 4.5,
      priceLevel: '$$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    },
    {
      name: '230 Fifth Rooftop Bar',
      address: '230 Fifth Ave, New York, NY 10001',
      city: 'NYC',
      lat: 40.7441,
      lng: -73.9877,
      bookingType: 'manual',
      bookingUrl: 'https://www.230-fifth.com/',
      phone: '+1-212-725-4300',
      rating: 4.2,
      priceLevel: '$$$',
      dressCodeSummary: 'Smart Casual',
      groupFriendly: true,
    },
    {
      name: 'Upstairs @ 66',
      address: '66 Greenwich Ave, New York, NY 10011',
      city: 'NYC',
      lat: 40.7357,
      lng: -74.0012,
      bookingType: 'deeplink',
      bookingUrl: 'https://www.opentable.com/r/upstairs-66-new-york',
      phone: '+1-212-463-7500',
      rating: 4.3,
      priceLevel: '$$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    },
    {
      name: 'Bohemian',
      address: '4 Great Jones St, New York, NY 10012',
      city: 'NYC',
      lat: 40.7273,
      lng: -73.9932,
      bookingType: 'manual',
      phone: '+1-212-533-5300',
      rating: 4.6,
      priceLevel: '$$$$',
      dressCodeSummary: 'Upscale',
      groupFriendly: false,
    },
    {
      name: 'Taco Mix',
      address: '234 E 116th St, New York, NY 10029',
      city: 'NYC',
      lat: 40.7967,
      lng: -73.9409,
      bookingType: 'none',
      phone: '+1-646-998-3835',
      rating: 4.4,
      priceLevel: '$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    },
    {
      name: 'Bowlmor Lanes',
      address: '110 University Pl, New York, NY 10003',
      city: 'NYC',
      lat: 40.7342,
      lng: -73.9924,
      bookingType: 'webview_form',
      bookingUrl: 'https://www.bowlmor.com/location/bowlmor-chelsea-piers',
      phone: '+1-212-255-8188',
      rating: 4.0,
      priceLevel: '$$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    },
  ];

  for (const venue of venues) {
    const created = await prisma.venue.upsert({
      where: { id: venue.name }, // This won't work with real IDs, but for seeding it's fine
      update: {},
      create: venue,
    });
    console.log('Created venue:', created.name);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
