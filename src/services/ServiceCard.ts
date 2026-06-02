import api from "./api";

export const getCardById = async (id: number) => {
  const response = await api.get(`/projects/cards/${id}/`);
  return response.data;
};

export const updateCard = async (
  id: number,
  data: {
    title?: string;
    labels?: string;
    description?: string;
    status?: string;
    assigned_to?: number[];
    date?: string;
  }
) => {
  const response = await api.patch(
    `/projects/cards/${id}/`,
    data
  );

  return response.data;
};

export const deleteCard = async (id: number) => {
  await api.delete(`/projects/cards/${id}/`);
};