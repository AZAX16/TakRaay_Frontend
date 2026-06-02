import api from './api';

export interface Profile {
  id: number;
  phone: string;
  full_name: string;
  student_id: string | null;
  avatar: string | null;
  bio: string;
  job_title: string;
}

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get('/auth/profile/');
  return response.data;
};

export const getMemberProfile = async (projectId: string, userId: string): Promise<Profile> => {
  const response = await api.get(`/projects/${projectId}/members/${userId}/profile/`);
  return response.data;
};