import { PlannerOverrides, PlannerPlan, PlannerVenueInput } from './planner.types';

const sampleVenues: PlannerVenueInput[] = [
  {
    name: 'Dante West Village',
    address: '551 Hudson St, New York, NY 10014',
    city: 'New York City',
    lat: 40.734672,
    lng: -74.006264,
    bookingType: 'manual',
    bookingProvider: 'custom',
    bookingUrl: 'https://www.dante-nyc.com/',
    phone: '+1 212-982-5275',
    website: 'https://www.dante-nyc.com/',
    rating: 4.7,
    priceLevel: '$$',
    dressCodeSummary: 'Smart casual',
    groupFriendly: true
  },
  {
    name: "L'Artusi",
    address: '228 W 10th St, New York, NY 10014',
    city: 'New York City',
    lat: 40.735836,
    lng: -74.00486,
    bookingType: 'deeplink',
    bookingProvider: 'opentable',
    bookingUrl: 'https://www.opentable.com/r/lartusi-new-york',
    phone: '+1 212-255-5757',
    website: 'https://www.lartusi.com/',
    rating: 4.8,
    priceLevel: '$$$',
    dressCodeSummary: 'Upscale casual',
    groupFriendly: true
  },
  {
    name: '230 Fifth Rooftop Bar',
    address: '230 5th Ave, New York, NY 10001',
    city: 'New York City',
    lat: 40.744556,
    lng: -73.988266,
    bookingType: 'webview_form',
    bookingProvider: 'custom',
    bookingUrl: 'https://www.230-fifth.com/reservations',
    phone: '+1 212-725-4300',
    website: 'https://www.230-fifth.com/',
    rating: 4.4,
    priceLevel: '$$',
    dressCodeSummary: 'Smart casual',
    groupFriendly: true
  }
];

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

const inferCity = (prompt: string) => {
  const normalized = prompt.toLowerCase();
  if (normalized.includes('brooklyn')) return 'Brooklyn';
  if (normalized.includes('manhattan')) return 'Manhattan';
  if (normalized.includes('new york') || normalized.includes('nyc')) return 'New York City';
  if (normalized.includes('los angeles') || normalized.includes('la ')) return 'Los Angeles';
  if (normalized.includes('miami')) return 'Miami';
  return undefined;
};

const inferGroupSize = (prompt: string) => {
  const sizeMatch = prompt.match(/(\d{1,2})\s+(people|friends|guests|attendees)/i);
  return sizeMatch ? Number(sizeMatch[1]) : undefined;
};

const inferOccasion = (prompt: string) => {
  const normalized = prompt.toLowerCase();
  if (normalized.includes('bachelor')) return 'bachelor';
  if (normalized.includes('bachelorette')) return 'bachelorette';
  if (normalized.includes('birthday')) return 'birthday';
  if (normalized.includes('corporate')) return 'corporate';
  return 'night out';
};

const inferBudget = (prompt: string) => {
  const normalized = prompt.toLowerCase();
  if (normalized.includes('high') || normalized.includes('premium')) return 'high';
  if (normalized.includes('mid') || normalized.includes('medium')) return 'medium';
  if (normalized.includes('cheap') || normalized.includes('low') || normalized.includes('budget')) return 'low';
  return 'medium';
};

const inferDate = (prompt: string) => {
  const normalized = prompt.toLowerCase();
  const monthRegex = new RegExp(`(${months.join('|')})\\s+(\\d{1,2})(?:,?\\s*(\\d{4}))?`, 'i');
  const match = normalized.match(monthRegex);
  if (match) {
    const monthIndex = months.indexOf(match[1].toLowerCase());
    const day = Number(match[2]);
    const year = match[3] ? Number(match[3]) : new Date().getFullYear();
    const date = new Date(Date.UTC(year, monthIndex, day, 22, 0, 0));
    return date;
  }

  const numericMatch = normalized.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (numericMatch) {
    const month = Number(numericMatch[1]) - 1;
    const day = Number(numericMatch[2]);
    const year = Number(numericMatch[3].length === 2 ? `20${numericMatch[3]}` : numericMatch[3]);
    return new Date(Date.UTC(year, month, day, 22, 0, 0));
  }

  return undefined;
};

const getNextSaturday = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = (6 - day + 7) % 7;
  date.setDate(date.getDate() + diff || 7);
  date.setHours(22, 0, 0, 0);
  return date;
};

const addHours = (date: Date, hours: number) => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

const pickVenue = (name: string) => {
  const venue = sampleVenues.find((candidate) => candidate.name === name);
  if (!venue) {
    throw new Error(`Planner seed missing venue data for ${name}`);
  }
  return venue;
};

const buildTripTitle = (city: string, occasion: string) => {
  const capitalizedOccasion = occasion.charAt(0).toUpperCase() + occasion.slice(1);
  return `${capitalizedOccasion} in ${city}`;
};

export const plannerService = {
  generatePlan: (prompt: string, overrides?: PlannerOverrides): PlannerPlan => {
    const city = overrides?.city ?? inferCity(prompt) ?? 'New York City';
    const occasion = overrides?.occasion ?? inferOccasion(prompt);
    const budgetLevel = overrides?.budgetLevel ?? inferBudget(prompt);
    const groupSize = overrides?.groupSizeMin ?? inferGroupSize(prompt) ?? 12;
    const groupSizeMax = overrides?.groupSizeMax ?? groupSize + 4;

    const inferredDate = overrides?.dateStart ?? inferDate(prompt) ?? getNextSaturday();
    const dateStart = new Date(inferredDate);
    const eventOneStart = new Date(dateStart);
    const eventTwoStart = addHours(dateStart, 2);
    const eventThreeStart = addHours(dateStart, 4.5);

    const events = [
      {
        title: 'Kickoff Cocktails at Dante',
        type: 'bar',
        description: 'Signature negronis and spritzes to set the tone.',
        startTime: eventOneStart,
        endTime: addHours(eventOneStart, 1.5),
        isPrimary: true,
        venue: pickVenue('Dante West Village')
      },
      {
        title: "Italian Feast at L'Artusi",
        type: 'meal',
        description: 'Family-style pasta, steak, and plenty of wine.',
        startTime: eventTwoStart,
        endTime: addHours(eventTwoStart, 2),
        isPrimary: true,
        venue: pickVenue("L'Artusi")
      },
      {
        title: 'Rooftop Finale at 230 Fifth',
        type: 'club',
        description: 'Skyline views, heated igloos, and bottle service optional.',
        startTime: eventThreeStart,
        endTime: addHours(eventThreeStart, 2),
        isPrimary: true,
        venue: pickVenue('230 Fifth Rooftop Bar')
      }
    ];

    const dateEnd = overrides?.dateEnd ?? events[events.length - 1].endTime;

    return {
      trip: {
        title: buildTripTitle(city, occasion),
        city,
        dateStart,
        dateEnd,
        groupSizeMin: groupSize,
        groupSizeMax,
        occasion,
        budgetLevel
      },
      events
    };
  }
};
