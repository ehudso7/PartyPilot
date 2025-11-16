import type { Event } from '../types/trip';
import { formatTimeRange } from '../lib/datetime';

type Props = {
  events: Event[];
};

export const ItineraryTimeline = ({ events }: Props) => {
  if (!events.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
        No events yet. Submit a prompt to generate your plan.
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <ol className="space-y-4">
      {sortedEvents.map((event) => (
        <li key={event.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-black/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{event.type}</p>
              <h3 className="text-xl font-semibold text-white">{event.title}</h3>
            </div>
            <span className="text-sm font-medium text-slate-200">{formatTimeRange(event.startTime, event.endTime)}</span>
          </div>
          {event.description && <p className="mt-2 text-sm text-slate-300">{event.description}</p>}
          {event.venue && (
            <div className="mt-4 rounded-lg bg-slate-950/40 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white">{event.venue.name}</p>
              <p>{event.venue.address}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                <span>Booking: {event.venue.bookingType}</span>
                {event.venue.priceLevel && <span>Budget: {event.venue.priceLevel}</span>}
                {event.venue.dressCodeSummary && <span>Dress: {event.venue.dressCodeSummary}</span>}
              </div>
              {event.venue.bookingUrl && (
                <a
                  className="mt-3 inline-flex items-center text-primary"
                  target="_blank"
                  rel="noreferrer"
                  href={event.venue.bookingUrl}
                >
                  View booking options →
                </a>
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
};
