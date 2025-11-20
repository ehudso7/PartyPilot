/**
 * API Client for PartyPilot Backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'An error occurred',
      }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, name: string) {
    const response = await this.request<{ token: string; user: any }>(
      '/api/v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async getMe() {
    return this.request<any>('/api/v1/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // Trips
  async planTrip(prompt: string) {
    return this.request<any>('/api/v1/trips/plan', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async getTrip(tripId: string) {
    return this.request<any>(`/api/v1/trips/${tripId}`);
  }

  async updateTrip(tripId: string, updates: any) {
    return this.request<any>(`/api/v1/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getTripEvents(tripId: string) {
    return this.request<any[]>(`/api/v1/trips/${tripId}/events`);
  }

  async getShareLink(tripId: string) {
    return this.request<{ url: string }>(`/api/v1/trips/${tripId}/share-link`);
  }

  async bootstrapNotifications(tripId: string) {
    return this.request<any>(
      `/api/v1/trips/${tripId}/notifications/bootstrap`,
      { method: 'POST' }
    );
  }

  // Exports
  getIcsUrl(tripId: string): string {
    const token = this.getToken();
    return `${this.baseUrl}/api/v1/trips/${tripId}/export/ics?token=${token}`;
  }

  getPdfUrl(tripId: string): string {
    const token = this.getToken();
    return `${this.baseUrl}/api/v1/trips/${tripId}/export/pdf?token=${token}`;
  }
}

export const api = new ApiClient(API_URL);
export default api;
