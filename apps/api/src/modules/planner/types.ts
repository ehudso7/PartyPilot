export type VenueRequirements = {
  tags?: string[];
  area?: string;
  groupFriendly?: boolean;
  dressCode?: string;
  priceLevel?: string;
};

export type PlannedEvent = {
  orderIndex: number;
  type: string;
  label: string;
  description?: string;
  timeWindow: {
    start: string;
    end: string;
  };
  primaryVenueRequirements: VenueRequirements;
  backupVenueRequirements?: VenueRequirements[];
  venueId?: string; // Will be populated after venue matching
};

export type TripPlan = {
  title: string;
  city: string;
  dateStart: string;
  dateEnd: string;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  events: PlannedEvent[];
};
