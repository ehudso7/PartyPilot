'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<any>(null);
  const [error, setError] = useState('');

  const handlePlanTrip = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/trips/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          userId: 'demo-user-001', // For MVP
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to plan trip');
      }

      const data = await response.json();
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>🎉 PartyPilot</h1>
        <p className={styles.subtitle}>
          AI-powered event planning from a single prompt
        </p>

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
              <button className={styles.actionButton}>
                📅 Download Calendar (.ics)
              </button>
              <button className={styles.actionButton}>
                📄 Download PDF
              </button>
              <button className={styles.actionButton}>
                🔗 Get Share Link
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
