import apiClient from "./api";

export type BoardStatus = "todo" | "doing" | "review" | "done";

export type ProjectMember = {
  id: number;
  phone?: string | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  avatar?: string | null;
  image?: string | null;
  profile_image?: string | null;
};

export type Project = {
  id: number;
  name: string;
  description?: string;
  owner: number;
  members: ProjectMember[];
  background_color_input: string;
  background_color: string;
  created_at: string;
  updated_at: string;
};

export type BoardList = {
  id: number;
  board: number;
  title: BoardStatus;
  order: number;
  is_archived: boolean;
};

export type ProjectCard = {
  id: number;
  status?: BoardStatus;
  title: string;
  description?: string;
  due_date?: string | null;
  labels?: string;
  order?: number;
  assigned_to?: number[];
  available_members?: string;
  is_completed?: boolean;
  is_archived?: boolean;
  is_overdue?: boolean;
};

export type CardPayload = {
  status?: BoardStatus;
  title: string;
  description?: string;
  due_date?: string | null;
  labels?: string;
  assigned_to?: number[];
  is_completed?: boolean;
  is_archived?: boolean;
};

export type ListPayload = {
  title: BoardStatus;
  is_archived?: boolean;
};

export type InviteMemberPayload = {
  phone: string;
};

export type PublicProfile = {
  id: number;
  phone: string;
  full_name: string;
  avatar: string | null;
  bio: string;
  job_title: string;
};

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<Project[]>("/projects/");
  return data;
}

export async function createProject(payload: Pick<Project, "name" | "background_color_input"> & Partial<Pick<Project, "description">>): Promise<Project> {
  const { data } = await apiClient.post<Project>("/projects/", payload);
  return data;
}

export async function fetchProject(id: number | string): Promise<Project> {
  const { data } = await apiClient.get<Project>(`/projects/${id}/`);
  return data;
}

export async function deleteProject(id: number | string): Promise<void> {
  await apiClient.delete(`/projects/${id}/`);
}

export async function fetchBoardLists(boardId: number | string): Promise<BoardList[]> {
  const { data } = await apiClient.get<BoardList[]>(`/projects/boards/${boardId}/lists/`);
  return data;
}

export async function createBoardList(boardId: number | string, payload: ListPayload): Promise<BoardList> {
  const { data } = await apiClient.post<BoardList>(`/projects/boards/${boardId}/lists/`, payload);
  return data;
}

export async function reorderBoardLists(boardId: number | string, payload: unknown = {}): Promise<unknown> {
  const { data } = await apiClient.patch(`/projects/boards/${boardId}/lists/reorder/`, payload);
  return data;
}

export async function fetchBoardList(id: number | string): Promise<BoardList> {
  const { data } = await apiClient.get<BoardList>(`/projects/lists/${id}/`);
  return data;
}

export async function updateBoardList(id: number | string, payload: Partial<ListPayload>): Promise<BoardList> {
  const { data } = await apiClient.patch<BoardList>(`/projects/lists/${id}/`, payload);
  return data;
}

export async function deleteBoardList(id: number | string): Promise<void> {
  await apiClient.delete(`/projects/lists/${id}/`);
}

export async function fetchListCards(listId: number | string): Promise<ProjectCard[]> {
  const { data } = await apiClient.get<ProjectCard[]>(`/projects/lists/${listId}/cards/`);
  return data;
}

export async function createListCard(listId: number | string, payload: CardPayload): Promise<ProjectCard> {
  const { data } = await apiClient.post<ProjectCard>(`/projects/lists/${listId}/cards/`, payload);
  return data;
}

export async function reorderListCards(listId: number | string, payload: unknown = {}): Promise<unknown> {
  const { data } = await apiClient.patch(`/projects/lists/${listId}/cards/reorder/`, payload);
  return data;
}

export async function fetchProjectCard(id: number | string): Promise<ProjectCard> {
  const { data } = await apiClient.get<ProjectCard>(`/projects/cards/${id}/`);
  return data;
}

export async function updateProjectCard(id: number | string, payload: Partial<CardPayload>): Promise<ProjectCard> {
  const { data } = await apiClient.patch<ProjectCard>(`/projects/cards/${id}/`, payload);
  return data;
}

export async function deleteProjectCard(id: number | string): Promise<void> {
  await apiClient.delete(`/projects/cards/${id}/`);
}

export async function archiveProjectCard(id: number | string): Promise<unknown> {
  const { data } = await apiClient.patch(`/projects/cards/${id}/archive/`);
  return data;
}

export async function fetchProjectMembers(projectId: number | string): Promise<ProjectMember[]> {
  const { data } = await apiClient.get<ProjectMember[]>(`/projects/${projectId}/members/`);
  return data;
}

export async function inviteProjectMember(projectId: number | string, payload: InviteMemberPayload): Promise<InviteMemberPayload> {
  const { data } = await apiClient.post<InviteMemberPayload>(`/projects/${projectId}/invite/`, payload);
  return data;
}

export async function leaveProject(projectId: number | string): Promise<void> {
  await apiClient.post(`/projects/${projectId}/leave/`, {});
}

export async function removeProjectMember(projectId: number | string, userId: number | string): Promise<void> {
  await apiClient.delete(`/projects/${projectId}/members/${userId}/`);
}

export async function fetchProjectMemberProfile(projectId: number | string, userId: number | string): Promise<PublicProfile> {
  const { data } = await apiClient.get<PublicProfile>(`/projects/${projectId}/members/${userId}/profile/`);
  return data;
}
