export interface PlannerVenueInput {
  name: string;
  address: string;
  city: string;
  lat?: number | null;
  lng?: number | null;
  bookingType: 'api' | 'deeplink' | 'webview_form' | 'manual' | 'none';
  bookingProvider?: string | null;
  bookingUrl?: string | null;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  priceLevel?: string | null;
  dressCodeSummary?: string | null;
  groupFriendly: boolean;
}

export interface PlannerEventPlan {
  title: string;
  type: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isPrimary: boolean;
  venue?: PlannerVenueInput;
}

export interface PlannerTripPlan {
  title: string;
  city: string;
  dateStart: Date;
  dateEnd: Date;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
}

export interface PlannerPlan {
  trip: PlannerTripPlan;
  events: PlannerEventPlan[];
}

export type PlannerOverrides = Partial<{
  city: string;
  dateStart: Date;
  dateEnd: Date;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
}>;
