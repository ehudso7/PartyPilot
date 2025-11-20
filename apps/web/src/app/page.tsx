'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { tripsApi } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<any>(null);
  const [error, setError] = useState('');
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handlePlanTrip = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const data = await tripsApi.plan(prompt);
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExportIcs = async () => {
    if (!trip?.trip?.id) return;
    try {
      const blob = await tripsApi.exportIcs(trip.trip.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-${trip.trip.id}.ics`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export calendar');
    }
  };

  const handleExportPdf = async () => {
    if (!trip?.trip?.id) return;
    try {
      const blob = await tripsApi.exportPdf(trip.trip.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-${trip.trip.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export PDF');
    }
  };

  const handleGetShareLink = async () => {
    if (!trip?.trip?.id) return;
    try {
      const response = await tripsApi.getShareLink(trip.trip.id);
      await navigator.clipboard.writeText(response.url);
      alert('Share link copied to clipboard!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get share link');
    }
  };

  if (authLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 className={styles.title}>🎉 PartyPilot</h1>
            <p className={styles.subtitle}>
              AI-powered event planning from a single prompt
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>

        <div className={styles.inputSection}>
          <textarea
            className={styles.textarea}
            placeholder="Describe your event... e.g., 'Bachelor party in NYC on Jan 17, 2026, 15 people, Italian dinner, games bar, rooftop. No strip clubs.'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
          <button
            className={styles.button}
            onClick={handlePlanTrip}
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Planning...' : 'Plan My Event'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            Error: {error}
          </div>
        )}

        {trip && (
          <div className={styles.results}>
            <h2>Your Trip is Ready! 🎊</h2>
            <div className={styles.tripCard}>
              <h3>{trip.trip.title}</h3>
              <p><strong>City:</strong> {trip.trip.city}</p>
              <p><strong>Date:</strong> {new Date(trip.trip.dateStart).toLocaleDateString()}</p>
              <p><strong>Group Size:</strong> {trip.trip.groupSizeMin}-{trip.trip.groupSizeMax} people</p>
              <p><strong>Occasion:</strong> {trip.trip.occasion}</p>
              <p><strong>Budget:</strong> {trip.trip.budgetLevel}</p>
            </div>

            <h3>Itinerary</h3>
            {trip.events.map((event: any, index: number) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventNumber}>{index + 1}</div>
                <div className={styles.eventDetails}>
                  <h4>{event.title}</h4>
                  <p className={styles.eventType}>{event.type}</p>
                  <p className={styles.eventTime}>
                    {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {event.description && <p className={styles.eventDesc}>{event.description}</p>}
                </div>
              </div>
            ))}

            <div className={styles.actions}>
              <button className={styles.actionButton} onClick={handleExportIcs}>
                📅 Download Calendar (.ics)
              </button>
              <button className={styles.actionButton} onClick={handleExportPdf}>
                📄 Download PDF
              </button>
              <button className={styles.actionButton} onClick={handleGetShareLink}>
                🔗 Get Share Link
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
