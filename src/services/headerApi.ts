import apiClient from "./api";

export type HeaderBoard = {
  id?: number | string;
  name?: string;
  title?: string;
  description?: string;
  background_color?: string;
  created_at?: string;
  updated_at?: string;
};

export type HeaderBoardResponse = HeaderBoard | string;

export type HeaderProfile = {
  id?: number | string;
  avatarUrl?: string;
  name?: string;
};

export async function fetchHeaderBoards(): Promise<HeaderBoardResponse[]> {
  const { data } = await apiClient.get<HeaderBoardResponse[]>("/projects/");
  return Array.isArray(data) ? data : [];
}

export async function fetchHeaderProfile(): Promise<HeaderProfile | null> {
  const { data } = await apiClient.get<
    | {
        id?: number | string;
        avatar?: string | null;
        avatarUrl?: string | null;
        full_name?: string;
        name?: string;
      }
    | Array<{
        id?: number | string;
        avatar?: string | null;
        avatarUrl?: string | null;
        full_name?: string;
        name?: string;
      }>
  >("/auth/profile/");
  const profile = Array.isArray(data) ? data[0] : data;

  if (!profile) return null;

  return {
    id: profile.id,
    avatarUrl: profile.avatarUrl || profile.avatar || undefined,
    name: profile.name || profile.full_name,
  };
}

export async function searchBoards(query: string): Promise<HeaderBoardResponse[]> {
  const { data } = await apiClient.get<HeaderBoardResponse[]>("/projects/", {
    params: query ? { search: query } : undefined,
  });

  return Array.isArray(data) ? data : [];
}
