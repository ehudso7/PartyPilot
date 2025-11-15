export interface PlanTripInput {
  prompt: string;
  userId: string;
}

export interface PlanTripOutput {
  trip: {
    title: string;
    city: string;
    dateStart: string;
    dateEnd: string;
    groupSizeMin: number;
    groupSizeMax: number;
    occasion: string;
    budgetLevel: string;
  };
  events: Array<{
    orderIndex: number;
    type: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    isPrimary: boolean;
  }>;
}
