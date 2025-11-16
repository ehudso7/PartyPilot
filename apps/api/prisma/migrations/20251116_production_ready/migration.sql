-- Production-Ready Schema Migration
-- Add password field and deletedAt to users
-- Add indexes for performance

-- AlterTable users - add password and deletedAt
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" TEXT NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- Create indexes for improved query performance
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "trips_userId_idx" ON "trips"("userId");
CREATE INDEX IF NOT EXISTS "trips_status_idx" ON "trips"("status");
CREATE INDEX IF NOT EXISTS "trips_city_dateStart_idx" ON "trips"("city", "dateStart");
CREATE INDEX IF NOT EXISTS "events_tripId_orderIndex_idx" ON "events"("tripId", "orderIndex");
CREATE INDEX IF NOT EXISTS "events_venueId_idx" ON "events"("venueId");
CREATE INDEX IF NOT EXISTS "notifications_tripId_idx" ON "notifications"("tripId");
CREATE INDEX IF NOT EXISTS "notifications_status_scheduledFor_idx" ON "notifications"("status", "scheduledFor");
CREATE INDEX IF NOT EXISTS "shareLinks_slug_idx" ON "shareLinks"("slug");
CREATE INDEX IF NOT EXISTS "shareLinks_tripId_idx" ON "shareLinks"("tripId");
