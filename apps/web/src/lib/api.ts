const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000/api';

export interface PlanTripPayload {
  prompt: string;
  user: {
    email: string;
    name?: string;
    phone?: string;
  };
}

export interface ApiVenue {
  id: string;
  name: string;
  address: string;
  city: string;
  bookingType: string;
  bookingProvider: string | null;
  bookingUrl: string | null;
  phone: string | null;
  website: string | null;
  priceLevel: string | null;
  dressCodeSummary: string | null;
  groupFriendly: boolean;
}

export interface ApiEvent {
  id: string;
  tripId: string;
  venueId: string | null;
  orderIndex: number;
  type: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  isPrimary: boolean;
  venue: ApiVenue | null;
}

export interface ApiTrip {
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
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
  };
  events: ApiEvent[];
}

interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: unknown;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.ok || !payload.data) {
    const message =
      typeof payload.error === 'string'
        ? payload.error
        : 'PartyPilot is not ready to plan trips yet. Please try again.';
    throw new Error(message);
  }

  return payload.data;
};

export const planTrip = async (payload: PlanTripPayload): Promise<ApiTrip> => {
  const response = await fetch(`${API_BASE_URL}/trips/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store',
    body: JSON.stringify(payload)
  });

  return handleResponse<ApiTrip>(response);
};

export interface HealthResponse {
  ok: boolean;
  status: string;
  uptime: number;
  timestamp: string;
}

export const fetchHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('API is unreachable');
  }

  return (await response.json()) as HealthResponse;
};
