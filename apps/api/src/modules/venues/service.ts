import { Venue } from '@prisma/client';
import * as repository from './repository';
import { VenueRequirements, VenueMatchResult } from './types';

interface ScoredVenue {
  venue: Venue;
  score: number;
  reasons: string[];
}

const TAG_HINTS: Record<string, (venue: Venue) => boolean> = {
  rooftop: (venue) => venue.name.toLowerCase().includes('roof') || venue.address.toLowerCase().includes('roof'),
  bowling: (venue) => venue.name.toLowerCase().includes('bowl'),
  arcade: (venue) => venue.name.toLowerCase().includes('arcade') || venue.website?.toLowerCase().includes('arcade') || false,
  games: (venue) => venue.name.toLowerCase().includes('game') || venue.address.toLowerCase().includes('game'),
  italian: (venue) => venue.name.toLowerCase().includes('trattoria') || venue.name.toLowerCase().includes('ristor') || venue.name.toLowerCase().includes('ital'),
  steak: (venue) => venue.name.toLowerCase().includes('steak'),
  brunch: (venue) => venue.name.toLowerCase().includes('brunch') || venue.website?.toLowerCase().includes('brunch') || false,
  club: (venue) => venue.name.toLowerCase().includes('club') || venue.dressCodeSummary?.toLowerCase().includes('club') || false,
};

export function scoreVenueAgainstRequirements(venue: Venue, requirements?: VenueRequirements): ScoredVenue {
  const reasons: string[] = [];
  let score = 0;

  if (!requirements) {
    return { venue, score: 0, reasons };
  }

  if (requirements.groupFriendly !== undefined) {
    if (venue.groupFriendly === requirements.groupFriendly) {
      score += 2;
      reasons.push('group friendly match');
    } else {
      score -= 1;
    }
  }

  if (requirements.priceLevel && venue.priceLevel) {
    if (venue.priceLevel === requirements.priceLevel) {
      score += 2;
      reasons.push('price level match');
    } else {
      score -= 1;
    }
  }

  if (requirements.dressCode && venue.dressCodeSummary) {
    if (venue.dressCodeSummary.toLowerCase().includes(requirements.dressCode.toLowerCase())) {
      score += 1;
      reasons.push('dress code match');
    }
  }

  if (requirements.area) {
    if (venue.address.toLowerCase().includes(requirements.area.toLowerCase())) {
      score += 1;
      reasons.push('area proximity');
    }
  }

  if (requirements.tags?.length) {
    for (const tag of requirements.tags) {
      const normalizedTag = tag.toLowerCase();
      const hintMatcher = TAG_HINTS[normalizedTag];
      const matchesHint = hintMatcher ? hintMatcher(venue) : false;
      const matchesGeneric = venue.name.toLowerCase().includes(normalizedTag) || venue.address.toLowerCase().includes(normalizedTag);

      if (matchesHint || matchesGeneric) {
        score += 1;
        reasons.push(`tag:${normalizedTag}`);
      }
    }
  }

  return { venue, score, reasons };
}

export async function findBestMatches(
  city: string,
  requirements?: VenueRequirements,
  backupRequirements?: VenueRequirements[],
  backupTarget: number = 2
): Promise<VenueMatchResult<Venue>> {
  const venues = await repository.findVenuesByCity(city);

  if (!venues.length) {
    return { primary: null, backups: [], reason: 'no venues for city' };
  }

  const scored = venues.map((venue) => scoreVenueAgainstRequirements(venue, requirements));
  const sorted = scored.sort((a, b) => b.score - a.score);

  const best = sorted[0];
  const primary = best?.score >= 0 ? best.venue : null;

  const remainingVenues = sorted.slice(primary ? 1 : 0).map((item) => item.venue);
  const backups: Venue[] = [];

  if (backupRequirements?.length) {
    for (const backupReq of backupRequirements) {
      const scoredBackups = remainingVenues
        .filter((venue) => !backups.find((b) => b.id === venue.id))
        .map((venue) => scoreVenueAgainstRequirements(venue, backupReq))
        .sort((a, b) => b.score - a.score);

      if (scoredBackups.length && scoredBackups[0].score >= 0) {
        backups.push(scoredBackups[0].venue);
      }

      if (backups.length >= backupTarget) {
        break;
      }
    }
  }

  while (backups.length < backupTarget && remainingVenues.length) {
    const candidate = remainingVenues.shift();
    if (!candidate) break;
    if (primary && candidate.id === primary.id) continue;
    backups.push(candidate);
  }

  return { primary, backups };
}
