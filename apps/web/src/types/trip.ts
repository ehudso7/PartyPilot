export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: number | null;
  lng?: number | null;
  bookingType: string;
  bookingProvider?: string | null;
  bookingUrl?: string | null;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  priceLevel?: string | null;
  dressCodeSummary?: string | null;
  groupFriendly: boolean;
}

export interface Event {
  id: string;
  tripId: string;
  venueId?: string | null;
  orderIndex: number;
  type: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  isPrimary: boolean;
  venue?: Venue | null;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  city: string;
  dateStart: string;
  dateEnd: string;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanTripResponse {
  trip: Trip;
  events: Event[];
  venues: Venue[];
}
