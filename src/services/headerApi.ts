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

export type BoardSearchResult = {
  type?: string;
  id?: number | string;
  project_id?: number | string;
  board_id?: number | string;
  project_name?: string;
  board_title?: string;
  match_type?: string;
  match_excerpt?: string;
};

export type CardSearchResult = {
  type?: string;
  id?: number | string;
  title?: string;
  project_id?: number | string;
  board_id?: number | string;
  project_name?: string;
  board_list_id?: number | string;
  board_list_title?: string;
  match_type?: string;
  match_excerpt?: string;
};

export type ProjectSearchResponse = {
  query?: string;
  boards?: BoardSearchResult[];
  cards?: CardSearchResult[];
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

export async function searchProjects(query: string): Promise<ProjectSearchResponse> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return { query: "", boards: [], cards: [] };
  }

  const { data } = await apiClient.get<ProjectSearchResponse>("/projects/search/", {
    params: { q: trimmedQuery },
  });

  return {
    query: data?.query ?? trimmedQuery,
    boards: Array.isArray(data?.boards) ? data.boards : [],
    cards: Array.isArray(data?.cards) ? data.cards : [],
  };
}
