import axios from 'axios';

type Group = {
  id: number;
  name: string;
  number: number;
};

export const getAll = (): Promise<Group[]> => {
  return axios.get('http://localhost:3000/api/groups').then((res) => res.data);
};
export const findById = (id: number) => {
  return axios
    .get('http://localhost:3000/api/groups/' + id)
    .then((res) => res.data);
};
export const getByEventPlanId = (eventPlanId: number): Promise<Group[]> => {
  return axios
    .post('http://localhost:3000/api/groups/getByEventPlanId', {
      eventPlanId: eventPlanId,
    })
    .then((res) => res.data);
};
export const countGroupByEvent = () => {
  return axios
    .get('http://localhost:3000/api/countGroupByEvent')
    .then((res) => res.data);
};
export const create = (data: any) => {
  return axios
    .post('http://localhost:3000/api/groups/create', data)
    .then((res) => res.data);
};
export const update = (data: any) => {
  return axios
    .post('http://localhost:3000/api/groups/update', data)
    .then((res) => res.data);
};
export const deleteIt = (id: number) => {
  return axios
    .delete('http://localhost:3000/api/groups/delete', { data: { id: id } })
    .then((res) => res.data);
};
