export interface CreateTripInput {
  userId: string;
  title: string;
  city: string;
  dateStart: Date;
  dateEnd: Date;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  status?: string;
}

export interface UpdateTripInput {
  title?: string;
  city?: string;
  dateStart?: Date;
  dateEnd?: Date;
  groupSizeMin?: number;
  groupSizeMax?: number;
  occasion?: string;
  budgetLevel?: string;
  status?: string;
}

export interface TripResponse {
  id: string;
  userId: string;
  title: string;
  city: string;
  dateStart: Date;
  dateEnd: Date;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanTripInput {
  prompt: string;
  userId: string;
}

export interface PlanTripResponse {
  trip: TripResponse;
  events: any[];
  venues: any[];
}
