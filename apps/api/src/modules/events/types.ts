export interface CreateEventInput {
  tripId: string;
  venueId?: string;
  orderIndex: number;
  type: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isPrimary?: boolean;
}

export interface UpdateEventInput {
  venueId?: string;
  orderIndex?: number;
  type?: string;
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  isPrimary?: boolean;
}

export interface EventResponse {
  id: string;
  tripId: string;
  venueId: string | null;
  orderIndex: number;
  type: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
