import type { Trip } from '../types/trip';
import { formatDateHeading } from '../lib/datetime';

type Props = {
  trip?: Trip;
};

export const TripSummary = ({ trip }: Props) => {
  if (!trip) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-slate-300">
        <p className="text-base">Your itinerary will appear here after you generate a plan.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
      <p className="text-sm uppercase tracking-wide text-slate-400">{trip.city}</p>
      <h2 className="text-2xl font-bold text-white">{trip.title}</h2>
      <p className="mt-1 text-slate-200">{formatDateHeading(trip.dateStart)}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase text-slate-500">Group Size</p>
          <p className="text-lg font-semibold text-white">
            {trip.groupSizeMin} – {trip.groupSizeMax} guests
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Occasion</p>
          <p className="text-lg font-semibold text-white">{trip.occasion}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Budget</p>
          <p className="text-lg font-semibold text-white">{trip.budgetLevel}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Status</p>
          <p className="text-lg font-semibold text-white">{trip.status}</p>
        </div>
      </div>
    </div>
  );
};
