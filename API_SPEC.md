# API_SPEC – PartyPilot

All responses JSON. All endpoints prefixed with `/api`.

## Auth (v1 simple)

For MVP you can:
- Use API key per user, or
- Simple JWT sessions.

(Implementation detail; spec focuses on trip flows.)

---

## POST /api/trips/plan

Create a new trip from a natural-language prompt.

**Body**
```json
{
  "prompt": "Set up my bachelor party in NYC on Jan 17, 2026, 15 people, Italian dinner, games, rooftop. No strip clubs.",
  "userId": "USER_ID"
}

Behavior
	•	Calls planner LLM (via planner module).
	•	Produces normalized trip + events draft.
	•	Finds candidate venues and assigns primary events.
	•	Saves to DB.

Response 201

{
  "trip": { ... },
  "events": [ ... ],
  "venues": [ ... ]
}

GET /api/trips/:tripId

Returns trip with events, venues, reservations, notifications.

⸻

PUT /api/trips/:tripId

Allows user to tweak:
	•	title
	•	dates
	•	group sizes
	•	occasion
	•	status

⸻

GET /api/trips/:tripId/events

List events for a trip, primary + backups.

⸻

POST /api/reservations/prepare

Prepare reservations for a set of events.

{
  "tripId": "TRIP_ID",
  "eventIds": ["EVENT_ID_1", "EVENT_ID_2"]
}

Behavior
	•	For each event:
	•	Inspect venue.bookingType.
	•	If api: build internal request object.
	•	If deeplink: build booking URL with parameters.
	•	If webview_form: build metadata (bookingUrl, recommended fields).
	•	If manual: generate suggested message templates.

Response

{
  "reservations": [
    {
      "eventId": "EVENT_ID_1",
      "method": "deeplink",
      "bookingUrl": "https://opentable.com/...",
      "status": "link_ready",
      "provider": "opentable",
      "partySize": 15,
      "reservedTime": "2026-01-17T17:30:00.000Z"
    }
  ]
}

These reservations are persisted in DB with status link_ready or pending.

⸻

POST /api/reservations/book

For api method only.

Body

{
  "reservationId": "RES_ID"
}

Behavior
	•	Looks up reservation + venue’s provider.
	•	Calls provider-specific integration stub.
	•	Updates status to confirmed or failed.

Response

{
  "reservation": { ...updated... }
}

GET /api/reservations/:reservationId

Fetch reservation details.

⸻

GET /api/trips/:tripId/export/ics

Returns text/calendar .ics content.

Fields:
	•	One VEVENT per event.
	•	Proper DTSTART/DTEND, SUMMARY, LOCATION, DESCRIPTION.

⸻

GET /api/trips/:tripId/export/pdf

Returns application/pdf binary stream.

⸻

GET /api/trips/:tripId/share-link

Returns or creates a share link.

Response

{
  "url": "https://partypilot.app/t/my-bachelor-abc123"
}

POST /api/trips/:tripId/notifications/bootstrap

Generate standard notification set.

Behavior
	•	Creates weather_check, headcount, dress_code, and leave_now notifications.

Response

{
  "notifications": [ ... ]
}

GET /api/share/:slug (Public)

Public itinerary view (no auth).

Response

{
  "trip": { ...safe subset... },
  "events": [ ... ],
  "venues": [ ... ]
}