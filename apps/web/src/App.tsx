import { useState } from 'react';

import { PlannerForm } from './components/PlannerForm';
import { TripSummary } from './components/TripSummary';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import type { PlanTripResponse } from './types/trip';

function App() {
  const [planResult, setPlanResult] = useState<PlanTripResponse | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">PartyPilot</h1>
          <p className="text-sm text-slate-300">AI-powered itineraries, reservations, and reminders</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/20 to-indigo-600/10 p-6">
            <h2 className="text-3xl font-semibold">Tell us the vibe. We’ll handle the rest.</h2>
            <p className="mt-2 text-lg text-slate-100">
              PartyPilot transforms your prompt into a timed itinerary with real NYC venues, booking guidance,
              and reminders.
            </p>
          </div>
          <PlannerForm
            onPlanned={(result) => {
              setPlanResult(result);
            }}
          />
        </section>

        <aside className="space-y-6">
          <TripSummary trip={planResult?.trip} />
          <ItineraryTimeline events={planResult?.events ?? []} />
        </aside>
      </main>
    </div>
  );
}

export default App;
