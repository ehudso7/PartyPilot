export interface CreateTripInput {
  userId: string;
  title: string;
  city: string;
  dateStart: Date | string;
  dateEnd: Date | string;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  status?: string;
}

export interface UpdateTripInput {
  title?: string;
  city?: string;
  dateStart?: Date | string;
  dateEnd?: Date | string;
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

export interface TripWithRelationsResponse extends TripResponse {
  events?: any[];
  venues?: any[];
  reservations?: any[];
  notifications?: any[];
}
