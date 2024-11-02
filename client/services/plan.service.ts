import axios from 'axios';

type Plan = {
  id: number;
  name: string;
};

export const getAll = (): Promise<Plan[]> => {
  return axios.get('http://localhost:3000/api/plans').then((res) => res.data);
};
export const findById = (id: number) => {
  return axios
    .get('http://localhost:3000/api/plans/' + id)
    .then((res) => res.data);
};
export const countSeats = () => {
  return axios
    .get('http://localhost:3000/api/countSeats')
    .then((res) => res.data);
};
export const create = (data: any) => {
  return axios
    .post('http://localhost:3000/api/plans/create', data)
    .then((res) => res.data);
};
export const update = (data: any) => {
  return axios
    .post('http://localhost:3000/api/plans/update', data)
    .then((res) => res.data);
};
export const deletePlan = (id: number) => {
  return axios
    .delete('http://localhost:3000/api/plans/delete', { data: { id: id } })
    .then((res) => res.data);
};
