import axios from 'axios';

type Plan = {
  width: number;
  height: number;
};

type EventPlan = {
  id: number;
  plan: Plan;
};

export const getAll = () => {
  return axios
    .get('http://localhost:3000/api/eventPlans')
    .then((res) => res.data);
};
export const findById = (id: number) => {
  return axios
    .get('http://localhost:3000/api/eventPlans/' + id)
    .then((res) => res.data);
};
export const getByEventId = (id: number) => {
  return axios
    .get('http://localhost:3000/api/eventPlansByEventId/' + id)
    .then((res) => res.data);
};
export const getByEventIdPlanId = (
  eventId: number,
  planId: number
): Promise<EventPlan> => {
  return axios
    .get(`http://localhost:3000/api/eventPlans/event/${eventId}/plan/${planId}`)
    .then((res) => res.data);
};
