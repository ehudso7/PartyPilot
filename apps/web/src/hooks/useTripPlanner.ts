import { useMutation } from '@tanstack/react-query';

import { http } from '../lib/http';
import type { PlanTripResponse } from '../types/trip';

type PlannerFormValues = {
  prompt: string;
  name: string;
  email: string;
  phone?: string;
};

const createUser = async (input: PlannerFormValues) => {
  const response = await http.post<{ user: { id: string } }>('/users', {
    name: input.name,
    email: input.email,
    phone: input.phone
  });
  return response.data.user;
};

const requestPlan = async (payload: PlannerFormValues) => {
  const user = await createUser(payload);
  const response = await http.post<PlanTripResponse>('/trips/plan', {
    prompt: payload.prompt,
    userId: user.id
  });
  return response.data;
};

export const useTripPlanner = () => {
  return useMutation({
    mutationFn: requestPlan
  });
};
