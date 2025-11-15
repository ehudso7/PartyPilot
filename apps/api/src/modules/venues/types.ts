import { Venue } from '@prisma/client';

export type CreateVenueDTO = {
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  bookingType?: string;
  bookingProvider?: string;
  bookingUrl?: string;
  phone?: string;
  website?: string;
  rating?: number;
  priceLevel?: string;
  dressCodeSummary?: string;
  groupFriendly?: boolean;
};

export type UpdateVenueDTO = Partial<CreateVenueDTO>;

export type VenueResponse = Venue;

export type VenueSearchCriteria = {
  city?: string;
  priceLevel?: string;
  groupFriendly?: boolean;
  tags?: string[];
  area?: string;
};
