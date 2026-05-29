import apiClient from "./api";

export type HeaderBoard = {
  id?: number | string;
  name?: string;
  title?: string;
};

export type HeaderBoardResponse = HeaderBoard | string;

export type HeaderProfile = {
  avatarUrl?: string;
  name?: string;
};

export async function fetchHeaderBoards(): Promise<HeaderBoardResponse[]> {
  const { data } = await apiClient.get<HeaderBoardResponse[]>("/boards");
  return data;
}

export async function fetchRecentBoards(): Promise<HeaderBoardResponse[]> {
  const { data } = await apiClient.get<HeaderBoardResponse[]>("/boards/recent");
  return data;
}

export async function fetchHeaderProfile(): Promise<HeaderProfile> {
  const { data } = await apiClient.get<HeaderProfile>("/me/profile");
  return data;
}

export async function searchBoards(query: string): Promise<unknown> {
  const { data } = await apiClient.get("/boards/search", {
    params: { q: query },
  });

  return data;
}
