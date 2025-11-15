export interface CreateVenueInput {
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  bookingType: string;
  bookingProvider?: string;
  bookingUrl?: string;
  phone?: string;
  website?: string;
  rating?: number;
  priceLevel?: string;
  dressCodeSummary?: string;
  groupFriendly?: boolean;
}

export interface UpdateVenueInput {
  name?: string;
  address?: string;
  city?: string;
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
}

export interface VenueResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number | null;
  lng: number | null;
  bookingType: string;
  bookingProvider: string | null;
  bookingUrl: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  priceLevel: string | null;
  dressCodeSummary: string | null;
  groupFriendly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VenueSearchCriteria {
  city?: string;
  tags?: string[];
  groupFriendly?: boolean;
  priceLevel?: string;
  dressCode?: string;
}
