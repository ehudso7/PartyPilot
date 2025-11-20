'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.planTrip(prompt);
      router.push(`/trips/${result.trip.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to plan trip');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎉 PartyPilot</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h2>Plan Your Perfect Event with AI</h2>
          <p>
            Describe your event in natural language and let AI create the perfect
            itinerary
          </p>
        </div>

        <form onSubmit={handlePlanTrip} className={styles.plannerForm}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.promptContainer}>
            <label htmlFor="prompt">Describe Your Event</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Plan my bachelor party in NYC on January 15, 2026, 15 people, mid-budget. Start with Italian dinner, then games bar, then rooftop lounge. No strip clubs."
              rows={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.planButton}
          >
            {loading ? '✨ Planning Your Trip...' : '✨ Plan My Trip'}
          </button>
        </form>

        <div className={styles.examples}>
          <h3>Example Prompts</h3>
          <div className={styles.exampleGrid}>
            <button
              onClick={() =>
                setPrompt(
                  'Plan a birthday party in NYC on December 20, 2025, 12 people, budget-friendly, dinner and karaoke'
                )
              }
              className={styles.exampleCard}
            >
              <span className={styles.emoji}>🎂</span>
              <span>Birthday Party</span>
            </button>
            <button
              onClick={() =>
                setPrompt(
                  'Bachelor party in Miami, February 10, 2026, 10 people, high budget, beach club, steakhouse, nightclub'
                )
              }
              className={styles.exampleCard}
            >
              <span className={styles.emoji}>🤵</span>
              <span>Bachelor Party</span>
            </button>
            <button
              onClick={() =>
                setPrompt(
                  'Bar crawl in NYC on New Years Eve, 8 people, mid-budget, start at 8pm, hit 3-4 bars'
                )
              }
              className={styles.exampleCard}
            >
              <span className={styles.emoji}>🍻</span>
              <span>Bar Crawl</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
