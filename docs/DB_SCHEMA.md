# DB_SCHEMA – PartyPilot

Prisma + PostgreSQL.

## users

- id: string (cuid)
- email: string (unique)
- name: string
- phone: string | null
- createdAt: DateTime
- updatedAt: DateTime

## trips

- id: string (cuid)
- userId: string (fk -> users.id)
- title: string
- city: string
- dateStart: DateTime
- dateEnd: DateTime
- groupSizeMin: int
- groupSizeMax: int
- occasion: string   // "bachelor" | "birthday" | etc. (no enum in v1)
- budgetLevel: string   // "low" | "medium" | "high"
- status: string   // "draft" | "planned" | "confirmed" | "completed"
- createdAt: DateTime
- updatedAt: DateTime

## venues

- id: string (cuid)
- name: string
- address: string
- city: string
- lat: float | null
- lng: float | null
- bookingType: string   // "none" | "api" | "deeplink" | "webview_form" | "manual"
- bookingProvider: string | null   // "opentable" | "resy" | "sevenrooms" | "custom" | null
- bookingUrl: string | null
- phone: string | null
- website: string | null
- rating: float | null
- priceLevel: string | null   // "$" | "$$" | "$$$" | "$$$$"
- dressCodeSummary: string | null
- groupFriendly: boolean
- createdAt: DateTime
- updatedAt: DateTime

## events

Each stop in the itinerary.

- id: string (cuid)
- tripId: string (fk -> trips.id)
- venueId: string | null (fk -> venues.id)
- orderIndex: int
- type: string   // "meetup" | "meal" | "bar" | "club" | "transit" | "other"
- title: string
- description: string | null
- startTime: DateTime
- endTime: DateTime
- isPrimary: boolean   // true for main plan, false for backup
- createdAt: DateTime
- updatedAt: DateTime

## reservations

- id: string (cuid)
- tripId: string (fk -> trips.id)
- eventId: string (fk -> events.id)
- venueId: string (fk -> venues.id)
- method: string   // "api" | "deeplink" | "webview_form" | "manual"
- bookingProvider: string | null
- providerReservationId: string | null
- nameOnReservation: string
- partySize: int
- reservedTime: DateTime
- status: string   // "pending" | "link_ready" | "requested" | "confirmed" | "cancelled" | "failed"
- rawPayload: Json | null
- createdAt: DateTime
- updatedAt: DateTime

## notifications

- id: string (cuid)
- tripId: string (fk -> trips.id)
- type: string   // "weather_check" | "headcount" | "leave_now" | "dress_code" | "generic"
- scheduledFor: DateTime
- status: string   // "scheduled" | "sent" | "cancelled"
- channel: string   // "push" | "email" | "sms"
- payload: Json
- createdAt: DateTime
- updatedAt: DateTime

## shareLinks

- id: string (cuid)
- tripId: string (fk -> trips.id)
- slug: string (unique)
- expiresAt: DateTime | null
- createdAt: DateTime