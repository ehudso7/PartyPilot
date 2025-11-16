import OpenAI from 'openai';
import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { readFileSync } from 'fs';
import { join } from 'path';

const openai = config.openaiApiKey ? new OpenAI({ apiKey: config.openaiApiKey }) : null;

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

    const parsed = JSON.parse(content);
    logger.info('Trip plan generated via OpenAI', { title: parsed.title });

    return parsed;
  } catch (error) {
    logger.error('OpenAI planning error, using fallback:', error);
    return getFallbackPlan(prompt);
  }
}

function getFallbackPlan(prompt: string): PlannerOutput {
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

  return {
    title: 'Your Event',
    city,
    dateStart: dateStart.toISOString(),
    dateEnd: dateEnd.toISOString(),
    groupSizeMin: Math.max(1, groupSize - 2),
    groupSizeMax: groupSize + 2,
    occasion: 'celebration',
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
        description: 'Group dinner',
        startTime: new Date(dateStart.setHours(18, 30, 0, 0)).toISOString(),
        endTime: new Date(dateStart.setHours(20, 30, 0, 0)).toISOString(),
      },
      {
        type: 'bar',
        title: 'Evening Activity',
        description: 'Bar or lounge',
        startTime: new Date(dateStart.setHours(21, 0, 0, 0)).toISOString(),
        endTime: new Date(dateStart.setHours(23, 0, 0, 0)).toISOString(),
      },
    ],
  };
}
