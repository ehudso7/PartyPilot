'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import styles from './trip.module.css';

export default function TripPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params?.tripId as string;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const loadTrip = async () => {
    try {
      const data = await api.getTrip(tripId);
      setTrip(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const handleGetShareLink = async () => {
    try {
      const result = await api.getShareLink(tripId);
      setShareUrl(result.url);
      navigator.clipboard.writeText(result.url);
      alert('Share link copied to clipboard!');
    } catch (err: any) {
      alert('Failed to generate share link');
    }
  };

  const handleBootstrapNotifications = async () => {
    try {
      await api.bootstrapNotifications(tripId);
      alert('Notifications scheduled successfully!');
    } catch (err: any) {
      alert('Failed to schedule notifications');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading trip...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Trip not found'}</div>
        <button onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
          ← Back
        </button>
        <h1>🎉 {trip.title}</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.tripInfo}>
          <div className={styles.infoCard}>
            <h3>📍 Location</h3>
            <p>{trip.city}</p>
          </div>
          <div className={styles.infoCard}>
            <h3>📅 Date</h3>
            <p>{new Date(trip.dateStart).toLocaleDateString()}</p>
          </div>
          <div className={styles.infoCard}>
            <h3>👥 Group Size</h3>
            <p>{trip.groupSizeMin}-{trip.groupSizeMax} people</p>
          </div>
          <div className={styles.infoCard}>
            <h3>🎊 Occasion</h3>
            <p>{trip.occasion}</p>
          </div>
        </div>

        <div className={styles.section}>
          <h2>📋 Itinerary</h2>
          <div className={styles.events}>
            {trip.events && trip.events.length > 0 ? (
              trip.events.map((event: any, index: number) => (
                <div key={event.id} className={styles.event}>
                  <div className={styles.eventNumber}>{index + 1}</div>
                  <div className={styles.eventContent}>
                    <h3>{event.title}</h3>
                    <p className={styles.eventTime}>
                      {new Date(event.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(event.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {event.description && (
                      <p className={styles.eventDescription}>{event.description}</p>
                    )}
                    {event.venue && (
                      <div className={styles.venue}>
                        <strong>📍 {event.venue.name}</strong>
                        <p>{event.venue.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No events scheduled yet</p>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <h2>🛠️ Actions</h2>
          <div className={styles.actionGrid}>
            <a
              href={api.getIcsUrl(tripId)}
              download
              className={styles.actionButton}
            >
              📅 Download Calendar
            </a>
            <a
              href={api.getPdfUrl(tripId)}
              download
              className={styles.actionButton}
            >
              📄 Download PDF
            </a>
            <button onClick={handleGetShareLink} className={styles.actionButton}>
              🔗 Get Share Link
            </button>
            <button
              onClick={handleBootstrapNotifications}
              className={styles.actionButton}
            >
              🔔 Schedule Notifications
            </button>
          </div>
          {shareUrl && (
            <div className={styles.shareUrl}>
              <p>Share this link with your group:</p>
              <input type="text" value={shareUrl} readOnly />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
