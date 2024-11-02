import axios from 'axios';

type Event = {
  id: number;
  name: number;
};

export const getAll = (): Promise<Event[]> => {
  return axios.get('http://localhost:3000/api/events').then((res) => res.data);
};
export const findById = (id: number) => {
  return axios
    .get('http://localhost:3000/api/events/' + id)
    .then((res) => res.data);
};
export const getPlans = (id: number) => {
  return axios
    .get('http://localhost:3000/api/eventPlans/' + id)
    .then((res) => res.data);
};
export const getNoPlans = (id: number) => {
  return axios
    .get('http://localhost:3000/api/eventNoPlans/' + id)
    .then((res) => res.data);
};
export const addPlan = (eventId: number, planId: number) => {
  return axios
    .post('http://localhost:3000/api/events/addPlan', {
      eventId: eventId,
      planId: planId,
    })
    .then((res) => res.data);
};
export const deletePlan = (eventId: number, planId: number) => {
  return axios
    .post('http://localhost:3000/api/events/deletePlan', {
      eventId: eventId,
      planId: planId,
    })
    .then((res) => res.data);
};
export const generate = (data: any) => {
  return axios
    .post('http://localhost:3000/api/events/generate', data)
    .then((res) => res.data);
};
export const create = (data: any) => {
  return axios
    .post('http://localhost:3000/api/events/create', data)
    .then((res) => res.data);
};
export const update = (data: any) => {
  return axios
    .post('http://localhost:3000/api/events/update', data)
    .then((res) => res.data);
};
export const deleteEvent = (id: number) => {
  return axios
    .delete('http://localhost:3000/api/events/delete', { data: { id: id } })
    .then((res) => res.data);
};
