import { VenueRequirements } from '../venues/types';

export interface PlannerTimeWindow {
  start: string;
  end: string;
}

export interface PlannerEvent {
  orderIndex: number;
  type: string;
  label: string;
  notes?: string;
  timeWindow: PlannerTimeWindow;
  primaryVenueRequirements?: VenueRequirements;
  backupVenueRequirements?: VenueRequirements[];
}

export interface PlannerPlan {
  title: string;
  city: string;
  dateStart: string;
  dateEnd: string;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: 'low' | 'medium' | 'high';
  events: PlannerEvent[];
}
