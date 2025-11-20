export interface VenueRequirements {
  tags?: string[];
  area?: string;
  groupFriendly?: boolean;
  dressCode?: string;
  priceLevel?: string;
}

export interface VenueMatchResult<TVenue = any> {
  primary?: TVenue | null;
  backups: TVenue[];
  reason?: string;
}
