import { logger } from '../../config/logger';

interface PlannerOutput {
  title: string;
  city: string;
  dateStart: string;
  dateEnd: string;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  events: Array<{
    type: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
  }>;
}

export async function parsePlannerPrompt(prompt: string): Promise<PlannerOutput> {
  logger.info('Parsing prompt:', prompt);
  
  // For MVP, return a structured stub response
  // In production, this would call an LLM with PLANNER_LOGIC.json schema
  
  const now = new Date();
  const dateStart = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  const dateEnd = new Date(dateStart);
  
  return {
    title: 'Your Awesome Event',
    city: 'NYC',
    dateStart: dateStart.toISOString(),
    dateEnd: dateEnd.toISOString(),
    groupSizeMin: 10,
    groupSizeMax: 15,
    occasion: 'bachelor',
    budgetLevel: 'medium',
    events: [
      {
        type: 'meetup',
        title: 'Kickoff Meetup',
        description: 'Starting point for the evening',
        startTime: new Date(dateStart.setHours(17, 0, 0, 0)).toISOString(),
        endTime: new Date(dateStart.setHours(18, 0, 0, 0)).toISOString(),
      },
      {
        type: 'meal',
        title: 'Dinner',
        description: 'Italian restaurant',
        startTime: new Date(dateStart.setHours(18, 30, 0, 0)).toISOString(),
        endTime: new Date(dateStart.setHours(20, 30, 0, 0)).toISOString(),
      },
      {
        type: 'bar',
        title: 'Games Bar',
        description: 'Bar with games and activities',
        startTime: new Date(dateStart.setHours(21, 0, 0, 0)).toISOString(),
        endTime: new Date(dateStart.setHours(23, 0, 0, 0)).toISOString(),
      },
    ],
  };
}
