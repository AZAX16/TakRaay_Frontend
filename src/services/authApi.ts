import apiClient from "./api";

export type AuthMe = {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
};

export type AuthProfile = {
  id: number;
  phone: string;
  full_name: string;
  student_id: string | null;
  avatar: string | null;
  bio: string;
  job_title: string;
  skills?: string;
};

export async function fetchCurrentUser(): Promise<AuthMe> {
  const { data } = await apiClient.get<AuthMe>("/auth/me/");
  return data;
}

export async function fetchAuthProfiles(): Promise<AuthProfile[]> {
  const { data } = await apiClient.get<AuthProfile[] | AuthProfile>("/auth/profile/");
  return Array.isArray(data) ? data : [data];
}
