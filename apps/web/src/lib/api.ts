// API client with authentication support

const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
  }
  return apiUrl;
};

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const api = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getToken();
    const apiUrl = getApiUrl();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};

// Auth API methods
export const authApi = {
  register: (email: string, password: string, name: string, phone?: string) =>
    api.post<{ user: any; token: string }>('/api/v1/auth/register', {
      email,
      password,
      name,
      phone,
    }),

  login: (email: string, password: string) =>
    api.post<{ user: any; token: string }>('/api/v1/auth/login', {
      email,
      password,
    }),

  getMe: () => api.get<{ user: any }>('/api/v1/auth/me'),
};

// Trips API methods
export const tripsApi = {
  plan: (prompt: string) =>
    api.post<{ trip: any; events: any[]; venues: any[] }>('/api/v1/trips/plan', {
      prompt,
    }),

  get: (tripId: string) =>
    api.get<{ trip: any; events: any[] }>(`/api/v1/trips/${tripId}`),

  update: (tripId: string, updates: any) =>
    api.put(`/api/v1/trips/${tripId}`, updates),

  getEvents: (tripId: string) =>
    api.get<{ events: any[] }>(`/api/v1/trips/${tripId}/events`),

  exportIcs: async (tripId: string): Promise<Blob> => {
    const token = getToken();
    const apiUrl = getApiUrl();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${apiUrl}/api/v1/trips/${tripId}/export/ics`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to export ICS');
    return response.blob();
  },

  exportPdf: async (tripId: string): Promise<Blob> => {
    const token = getToken();
    const apiUrl = getApiUrl();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${apiUrl}/api/v1/trips/${tripId}/export/pdf`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to export PDF');
    return response.blob();
  },

  getShareLink: (tripId: string) =>
    api.get<{ url: string }>(`/api/v1/trips/${tripId}/share-link`),
};
