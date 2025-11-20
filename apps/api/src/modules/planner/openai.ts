import OpenAI from 'openai';
import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PlannerPlan, PlannerEvent } from './types';

const openai = config.openaiApiKey ? new OpenAI({ apiKey: config.openaiApiKey }) : null;

export async function parsePlannerPrompt(prompt: string): Promise<PlannerPlan> {
  if (!openai) {
    logger.warn('OpenAI API key not configured, using fallback planning');
    return getFallbackPlan(prompt);
  }

  try {
    // Load PLANNER_LOGIC.json for schema
    const plannerLogic = JSON.parse(
      readFileSync(join(__dirname, '../../../../../PLANNER_LOGIC.json'), 'utf-8')
    );

    const systemPrompt = `You are a professional event planner. Parse the user's request and return a structured JSON plan following this exact schema:

${JSON.stringify(plannerLogic, null, 2)}

Important:
- Infer missing details reasonably
- Default to current date + 30 days if no date mentioned
- Events should be chronological and realistic
- Return ONLY valid JSON, no markdown or explanations`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

      const parsed = JSON.parse(content) as PlannerPlan;
      logger.info('Trip plan generated via OpenAI', { title: parsed.title, city: parsed.city });

    return parsed;
  } catch (error) {
    logger.error('OpenAI planning error, using fallback:', error);
    return getFallbackPlan(prompt);
  }
}

function buildTimeWindow(baseDate: Date, startHour: number, endHour: number) {
  const start = new Date(baseDate);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(baseDate);
  end.setHours(endHour, 0, 0, 0);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function getFallbackPlan(prompt: string): PlannerPlan {
  const now = new Date();
  const dateStart = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const dateEnd = new Date(dateStart);

  // Extract city if mentioned (simple pattern matching)
  let city = 'NYC';
  const cityPatterns = /in (New York|NYC|Los Angeles|LA|Chicago|Miami|Boston|San Francisco)/i;
  const cityMatch = prompt.match(cityPatterns);
  if (cityMatch) {
    city = cityMatch[1];
  }

  // Extract group size
  let groupSize = 10;
  const groupPattern = /(\d+) people/i;
  const groupMatch = prompt.match(groupPattern);
  if (groupMatch) {
    groupSize = parseInt(groupMatch[1]);
  }

  const events: PlannerEvent[] = [
    {
      orderIndex: 0,
      type: 'meetup',
      label: 'Kickoff Meetup',
      notes: 'Meet the crew and align on the night.',
      timeWindow: buildTimeWindow(dateStart, 17, 18),
      primaryVenueRequirements: {
        tags: ['lounge'],
        groupFriendly: true,
      },
      backupVenueRequirements: [
        { tags: ['bar'], groupFriendly: true },
      ],
    },
    {
      orderIndex: 1,
      type: 'meal',
      label: 'Group Dinner',
      notes: 'Comfort food to fuel the festivities.',
      timeWindow: buildTimeWindow(dateStart, 18, 20),
      primaryVenueRequirements: {
        tags: ['italian'],
        priceLevel: 'medium',
        groupFriendly: true,
      },
      backupVenueRequirements: [
        { tags: ['family'], groupFriendly: true },
      ],
    },
    {
      orderIndex: 2,
      type: 'bar',
      label: 'Games & Drinks',
      notes: 'Arcade vibes or bowling to keep energy up.',
      timeWindow: buildTimeWindow(dateStart, 20, 22),
      primaryVenueRequirements: {
        tags: ['arcade', 'games'],
        groupFriendly: true,
      },
      backupVenueRequirements: [
        { tags: ['bowling'], groupFriendly: true },
      ],
    },
    {
      orderIndex: 3,
      type: 'club',
      label: 'Rooftop Nightcap',
      notes: 'Wrap up with skyline views and music.',
      timeWindow: buildTimeWindow(dateStart, 22, 24),
      primaryVenueRequirements: {
        tags: ['rooftop'],
        dressCode: 'smart',
      },
      backupVenueRequirements: [
        { tags: ['club'], dressCode: 'smart' },
      ],
    },
  ];

  return {
    title: 'Your Event',
    city,
    dateStart: dateStart.toISOString(),
    dateEnd: dateEnd.toISOString(),
    groupSizeMin: Math.max(1, groupSize - 2),
    groupSizeMax: groupSize + 2,
    occasion: 'celebration',
    budgetLevel: groupSize >= 12 ? 'medium' : 'low',
    events,
  };
}
