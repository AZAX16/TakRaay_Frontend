import api from "./api";

export const getCardById = async (id: number) => {
  const response = await api.get(`/projects/cards/${id}/`);
  return response.data;
};