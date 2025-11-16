import { FormEvent, useState } from 'react';

import { useTripPlanner } from '../hooks/useTripPlanner';
import type { PlanTripResponse } from '../types/trip';

type PlannerFormProps = {
  onPlanned: (result: PlanTripResponse) => void;
};

const defaultPrompt =
  'Plan a Brooklyn bar crawl for 10 friends on the first Saturday next month. We want tacos, speakeasy cocktails, and a rooftop with skyline views. Avoid clubs.';

export const PlannerForm = ({ onPlanned }: PlannerFormProps) => {
  const [name, setName] = useState('Demo Organizer');
  const [email, setEmail] = useState('demo@partypilot.local');
  const [phone, setPhone] = useState('');
  const [prompt, setPrompt] = useState(defaultPrompt);
  const plannerMutation = useTripPlanner();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await plannerMutation.mutateAsync({ prompt, name, email, phone });
    onPlanned(result);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-slate-200">
          Name
          <input
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-200">
          Email
          <input
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
            value={email}
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
      </div>
      <label className="flex flex-col text-sm font-medium text-slate-200">
        Phone (optional)
        <input
          className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-200">
        Describe your night out
        <textarea
          className="mt-1 min-h-[140px] rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          required
        />
      </label>
      {plannerMutation.error && (
        <p className="text-sm text-rose-400">{(plannerMutation.error as Error).message}</p>
      )}
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-base font-semibold text-white shadow-lg shadow-primary/40 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={plannerMutation.isPending}
      >
        {plannerMutation.isPending ? 'Planning your night…' : 'Generate itinerary'}
      </button>
    </form>
  );
};
