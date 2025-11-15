import { z } from 'zod';

export const planTripSchema = z.object({
  body: z.object({
    prompt: z.string().min(5),
    userId: z.string().cuid()
  })
});

export type PlanTripInput = z.infer<typeof planTripSchema>['body'];

export type StubVenuePlan = {
  name: string;
  address: string;
  city: string;
  bookingType: 'deeplink' | 'api' | 'webview_form' | 'manual' | 'none';
  bookingProvider?: string | null;
  bookingUrl?: string | null;
  phone?: string | null;
  website?: string | null;
  priceLevel?: '$' | '$$' | '$$$' | '$$$$';
  rating?: number;
  dressCodeSummary?: string | null;
};

export type StubEventPlan = {
  orderIndex: number;
  type: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  venue: StubVenuePlan;
};

export type StubTripPlan = {
  title: string;
  city: string;
  occasion: string;
  budgetLevel: string;
  groupSizeMin: number;
  groupSizeMax: number;
  dateStart: Date;
  dateEnd: Date;
  events: StubEventPlan[];
};
