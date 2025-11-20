'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL must be defined');
}

interface ApiTrip {
  id: string;
  title: string;
  city: string;
  dateStart: string;
  dateEnd: string;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  status: string;
}

interface ApiVenue {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  priceLevel?: string | null;
  dressCodeSummary?: string | null;
}

interface ApiEvent {
  id: string;
  title: string;
  type: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  isPrimary: boolean;
  orderIndex: number;
  venue?: ApiVenue | null;
}

interface PlanResponse {
  trip: ApiTrip;
  events: ApiEvent[];
  venues: ApiVenue[];
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripResponse, setTripResponse] = useState<PlanResponse | null>(null);
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<AuthResponse['user'] | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [reservationResult, setReservationResult] = useState<{
    reservations: Array<{ id: string; status: string; method: string; bookingUrl?: string | null }>;
    skippedEventIds: string[];
  } | null>(null);

  const primaryEvents = useMemo(
    () => tripResponse?.events.filter((event) => event.isPrimary) ?? [],
    [tripResponse],
  );

  const backupEvents = useMemo(
    () => tripResponse?.events.filter((event) => !event.isPrimary) ?? [],
    [tripResponse],
  );

  const authorizedFetch = async (path: string, init?: RequestInit) => {
    const headers = new Headers(init?.headers ?? undefined);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!(init?.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed with status ${response.status}`);
    }

    return response;
  };

  const handleRegisterOrLogin = async () => {
    try {
      setError('');
      const endpoint = authMode === 'register' ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const payload =
        authMode === 'register'
          ? { email, password, name }
          : { email, password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Authentication failed');
      }

      const data: AuthResponse = await response.json();
      setToken(data.token);
      setCurrentUser(data.user);
    } catch (authError) {
      setToken('');
      setCurrentUser(null);
      setError(authError instanceof Error ? authError.message : 'Authentication failed');
    }
  };

  const handlePlanTrip = async () => {
    if (!prompt.trim()) return;
    if (!token) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');
    setReservationResult(null);
    setShareUrl('');

    try {
      const response = await authorizedFetch('/api/v1/trips/plan', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });

      const data: PlanResponse = await response.json();
      setTripResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type: 'ics' | 'pdf') => {
    if (!tripResponse || !token) return;

    const path = `/api/v1/trips/${tripResponse.trip.id}/export/${type}`;
    try {
      const response = await authorizedFetch(path, { method: 'GET' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tripResponse.trip.title}.${type}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Unable to download export');
    }
  };

  const handleShareLink = async () => {
    if (!tripResponse || !token) return;

    try {
      const response = await authorizedFetch(`/api/v1/trips/${tripResponse.trip.id}/share-link`, {
        method: 'GET',
      });
      const data = await response.json();
      setShareUrl(data.url);
    } catch (shareError) {
      setError(shareError instanceof Error ? shareError.message : 'Unable to generate share link');
    }
  };

  const handlePrepareReservations = async () => {
    if (!tripResponse || !token) return;

    const eventIds = primaryEvents.filter((event) => event.venue?.id).map((event) => event.id);
    if (!eventIds.length) {
      setReservationResult({
        reservations: [],
        skippedEventIds: primaryEvents.map((event) => event.id),
      });
      return;
    }

    try {
      const response = await authorizedFetch('/api/v1/reservations/prepare', {
        method: 'POST',
        body: JSON.stringify({
          tripId: tripResponse.trip.id,
          eventIds,
        }),
      });

      const data = await response.json();
      setReservationResult(data);
    } catch (reservationsError) {
      setError(reservationsError instanceof Error ? reservationsError.message : 'Unable to prepare reservations');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>🎉 PartyPilot</h1>
        <p className={styles.subtitle}>
          AI-powered event planning, booking, and sharing
        </p>

        <div className={styles.authCard}>
          <div className={styles.authToggle}>
            <button
              className={authMode === 'login' ? styles.authToggleActive : ''}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              className={authMode === 'register' ? styles.authToggleActive : ''}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          {authMode === 'register' && (
            <input
              className={styles.input}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.button} onClick={handleRegisterOrLogin}>
            {authMode === 'login' ? 'Login' : 'Create account'}
          </button>

          {currentUser && (
            <div className={styles.userBadge}>
              Logged in as <strong>{currentUser.name}</strong>
              <button
                className={styles.linkButton}
                onClick={() => {
                  setToken('');
                  setCurrentUser(null);
                  setTripResponse(null);
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>

        <div className={styles.inputSection}>
          <textarea
            className={styles.textarea}
            placeholder="Describe your event... e.g., 'Bachelor party in NYC on Jan 17, 2026, 15 people, Italian dinner, games bar, rooftop. No strip clubs.'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            disabled={!token}
          />
          <button
            className={styles.button}
            onClick={handlePlanTrip}
            disabled={loading || !prompt.trim() || !token}
          >
            {loading ? 'Planning...' : 'Plan My Event'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            Error: {error}
          </div>
        )}

        {tripResponse && (
          <div className={styles.results}>
            <h2>Your Trip is Ready! 🎊</h2>
            <div className={styles.tripCard}>
              <h3>{tripResponse.trip.title}</h3>
              <p><strong>City:</strong> {tripResponse.trip.city}</p>
              <p><strong>Date:</strong> {new Date(tripResponse.trip.dateStart).toLocaleDateString()}</p>
              <p><strong>Group Size:</strong> {tripResponse.trip.groupSizeMin}-{tripResponse.trip.groupSizeMax} people</p>
              <p><strong>Occasion:</strong> {tripResponse.trip.occasion}</p>
              <p><strong>Budget:</strong> {tripResponse.trip.budgetLevel}</p>
            </div>

            <h3>Primary Itinerary</h3>
            {primaryEvents.map((event, index) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventNumber}>{index + 1}</div>
                <div className={styles.eventDetails}>
                  <h4>{event.title}</h4>
                  <p className={styles.eventType}>{event.type}</p>
                  {event.venue && (
                    <p className={styles.venueLine}>
                      {event.venue.name} — {event.venue.address}
                    </p>
                  )}
                  <p className={styles.eventTime}>
                    {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {event.description && <p className={styles.eventDesc}>{event.description}</p>}
                </div>
              </div>
            ))}

            {!!backupEvents.length && (
              <>
                <h3>Plan B Options</h3>
                {backupEvents.map((event) => (
                  <div key={event.id} className={`${styles.eventCard} ${styles.backupCard}`}>
                    <div className={styles.eventNumber}>B</div>
                    <div className={styles.eventDetails}>
                      <h4>{event.title}</h4>
                      {event.venue && (
                        <p className={styles.venueLine}>
                          {event.venue.name} — {event.venue.address}
                        </p>
                      )}
                      <p className={styles.eventTime}>
                        {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className={styles.actions}>
              <button className={styles.actionButton} onClick={() => handleDownload('ics')}>
                📅 Download Calendar (.ics)
              </button>
              <button className={styles.actionButton} onClick={() => handleDownload('pdf')}>
                📄 Download PDF
              </button>
              <button className={styles.actionButton} onClick={handleShareLink}>
                🔗 Get Share Link
              </button>
              <button className={styles.actionButton} onClick={handlePrepareReservations}>
                🪄 Prepare Reservations
              </button>
            </div>

            {shareUrl && (
              <div className={styles.shareBanner}>
                Share with your crew: <a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a>
              </div>
            )}

            {reservationResult && (
              <div className={styles.reservationCard}>
                <h4>Reservation Prep</h4>
                {!reservationResult.reservations.length && (
                  <p className={styles.eventDesc}>No reservations created. Ensure venues are attached to events.</p>
                )}
                {reservationResult.reservations.map((reservation) => (
                  <div key={reservation.id} className={styles.reservationRow}>
                    <div>
                      <strong>{reservation.method.toUpperCase()}</strong> — {reservation.status}
                    </div>
                    {reservation.bookingUrl && (
                      <a href={reservation.bookingUrl} target="_blank" rel="noreferrer" className={styles.linkButton}>
                        Open link
                      </a>
                    )}
                  </div>
                ))}
                {reservationResult.skippedEventIds.length > 0 && (
                  <p className={styles.eventDesc}>
                    Skipped events (missing venues): {reservationResult.skippedEventIds.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
