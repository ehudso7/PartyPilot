export interface PlannerEvent {
  orderIndex: number;
  type: string;
  label: string;
  timeWindow: {
    start: string;
    end: string;
  };
  primaryVenueRequirements: {
    tags: string[];
    area?: string;
    groupFriendly?: boolean;
    dressCode?: string;
    priceLevel?: string;
  };
  backupVenueRequirements?: Array<{
    tags?: string[];
    area?: string;
  }>;
}

export interface PlannerTrip {
  title: string;
  city: string;
  dateStart: string;
  dateEnd: string;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  events: PlannerEvent[];
}

class StubPlanner {
  async plan(_prompt: string): Promise<PlannerTrip> {
    const dateStart = new Date('2026-01-17T16:00:00-05:00');
    const plan: PlannerTrip = {
      title: 'NYC Bachelor Bash',
      city: 'New York City',
      dateStart: dateStart.toISOString(),
      dateEnd: new Date('2026-01-18T02:30:00-05:00').toISOString(),
      groupSizeMin: 12,
      groupSizeMax: 15,
      occasion: 'bachelor',
      budgetLevel: 'medium',
      events: [
        {
          orderIndex: 1,
          type: 'meetup',
          label: 'Welcome cocktails & briefing',
          timeWindow: {
            start: dateStart.toISOString(),
            end: new Date(dateStart.getTime() + 60 * 60 * 1000).toISOString()
          },
          primaryVenueRequirements: {
            tags: ['speakeasy', 'cocktails'],
            area: 'West Village',
            groupFriendly: true,
            priceLevel: '$$'
          }
        },
        {
          orderIndex: 2,
          type: 'meal',
          label: 'Italian dinner & toasts',
          timeWindow: {
            start: new Date('2026-01-17T19:00:00-05:00').toISOString(),
            end: new Date('2026-01-17T21:00:00-05:00').toISOString()
          },
          primaryVenueRequirements: {
            tags: ['italian', 'family-style'],
            area: 'Greenwich Village',
            groupFriendly: true,
            priceLevel: '$$'
          }
        },
        {
          orderIndex: 3,
          type: 'bar',
          label: 'Games bar + shots',
          timeWindow: {
            start: new Date('2026-01-17T21:30:00-05:00').toISOString(),
            end: new Date('2026-01-17T23:30:00-05:00').toISOString()
          },
          primaryVenueRequirements: {
            tags: ['arcade', 'craft beer'],
            area: 'Downtown Brooklyn',
            groupFriendly: true,
            priceLevel: '$$'
          }
        },
        {
          orderIndex: 4,
          type: 'club',
          label: 'Rooftop finale',
          timeWindow: {
            start: new Date('2026-01-17T23:45:00-05:00').toISOString(),
            end: new Date('2026-01-18T02:30:00-05:00').toISOString()
          },
          primaryVenueRequirements: {
            tags: ['rooftop', 'skyline'],
            area: 'Flatiron',
            groupFriendly: true,
            dressCode: 'smart casual',
            priceLevel: '$$'
          }
        }
      ]
    };

    return plan;
  }
}

export const stubPlanner = new StubPlanner();
