PRD.md - Product Requirements

# PRD – PartyPilot v1

## 1. Overview

PartyPilot is a natural-language event planning app for social outings 
(bachelor parties, birthdays, bar crawls, etc.).

From a single prompt like:
> "Set up my bachelor party in NYC on Jan 17, 2026, 15 people, mid-budget, 
> chill start, Italian dinner, games bar, then rooftop. No strip clubs."

The system must:

1. Plan a multi-stop itinerary.
2. Select real venues with metadata.
3. Prepare or trigger reservations (API, deep link, or prefilled webview).
4. Generate:
   - Multi-event .ics calendar file
   - 1-page PDF itinerary
   - Group-chat-ready message
   - Public share link
5. Schedule reminders:
   - Weather check (48h)
   - Headcount check (48h)
   - Dress code & ID reminder (morning-of)
   - "Leave now" nudges for each hop
6. Provide backup options for each event block.

MVP: single city focus (NYC), but architecture must be city-agnostic.

---

## 2. Target Users

- Primary: Group organizers (bachelor/bachelorette, birthdays, trips).
- Secondary: Corporate/social organizers planning casual nights out.

Users don’t want to Google 50 places and stitch it all manually. 
They want one “do it all” agent.

---

## 3. Core Use Cases

1. **Prompt → Itinerary**
   - User inputs a natural-language description.
   - System returns a structured, timed itinerary.

2. **Itinerary → Bookings**
   - For each venue:
     - If API available → prepare/book via provider.
     - If public booking page → generate deep link or prefilled WebView.
     - Else → email/call/DM template.

3. **Itinerary → Assets**
   - Generate:
     - .ics with separate events
     - PDF one-pager
     - Group-chat message
     - Public read-only itinerary link

4. **Day-of Execution**
   - Push notifications:
     - Weather check
     - Headcount
     - Dress code
     - Leave-now alerts
   - UI showing "Next stop, travel time, maps link."
   - Simple Plan B switching when venue/weather fails.

---

## 4. Functional Requirements

### 4.1 Trip Planning

- Parse:
  - City, dates, time window
  - Group size (min/max)
  - Occasion (bachelor, birthday, etc.)
  - Budget level (low/medium/high)
  - Vibes (tags)
  - Exclusions (strip clubs, bottle service, etc.)
- Output normalized trip JSON (see PLANNER_LOGIC.json).

### 4.2 Venue Selection

- Given event requirements, find candidate venues with:
  - Name, address, coordinates
  - Price level, rating
  - Rough dress code (casual, smart casual, etc.)
  - Booking provider info if known (opentable/resy/custom URL)
  - Group-friendliness flag
- Pick one primary + up to 2 backups per block.

For MVP, venue data can be:
- Seeded JSON or
- Thin adapter over a places API (as config layer), 
  but core logic must not depend on one specific provider.

### 4.3 Reservations

For each event bound to a venue:

- **Mode: `api`**
  - Use configured booking provider’s API:
    - Inputs: user details, date, time, party_size
    - Outputs: confirmation ID, status.
  - Store in `reservations` table.

- **Mode: `deeplink`**
  - Construct booking URL with query params where documented.
  - Present link to user.
  - Optionally open in in-app WebView.

- **Mode: `webview_form`**
  - Open venue booking page in WebView.
  - Pre-fill when safely possible via:
    - Query params or allowed JS injection.
  - Show overlay with all reservation details for easy copy/paste if needed.

- **Mode: `manual`**
  - Generate:
    - Email body
    - Call script
    - DM/contact-form template

The app must NOT fake a confirmed booking when it isn’t actually confirmed.

### 4.4 Exports

- **ICS**
  - For each event:
    - DTSTART / DTEND (local, naive is fine v1)
    - SUMMARY (event + venue name)
    - LOCATION (address)
    - DESCRIPTION (core notes)
  - Single file with all events.

- **PDF**
  - One page:
    - Trip title + date
    - Events in chronological order
    - Times + venue + address
    - Key notes, Plan B summary

- **Group Chat Message**
  - Plain text version:
    - Times
    - Venues
    - Addresses
    - High-level notes

- **Public Itinerary Link**
  - Read-only web page:
    - Same itinerary as PDF, mobile-friendly.

### 4.5 Reminders & Notifications

For each trip:

- Weather check (48h before start).
- Headcount confirmation (48h).
- Dress code + ID reminder (morning-of).
- “Leave now for next stop” (configurable offset, e.g., 15–20 mins before).

Notifications stored in DB and triggered via a scheduler (cron, worker, or hosted scheduler).

---

## 5. Non-Functional Requirements

- Stack:
  - Node.js + TypeScript
  - Express
  - Prisma + PostgreSQL
- Secure env management (.env, no secrets in repo).
- TS strict mode.
- Minimal dependencies.
- LLM calls abstracted so multiple providers can be plugged in later.

---

## 6. Out-of-Scope for v1

- Real payment handling.
- In-app messaging between guests.
- Live two-way sync with reservation providers (beyond basic status).