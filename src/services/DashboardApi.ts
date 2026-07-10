import api from './api';

export interface TaskCard {
  id: number;
  title: string; 
  project_title: string;
  due_date: string | null;
}

export interface ProfileData {
  id: number;
  phone: string;
  full_name: string;
  student_id: string | null;
  avatar: string | null;
  bio: string;
  job_title: string;
  skills: string;
}

export interface DashboardResponse {
  profile: ProfileData;
  todo_cards: TaskCard[];
  doing_cards: TaskCard[];
}

export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  try {
    const response = await api.get<DashboardResponse>('/auth/dashboard/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const logoutUser = async (refreshToken: string): Promise<void> => {
  try {
    await api.post('/auth/logout/', {
      refresh: refreshToken,
    });
    console.log("successful logout")
  } catch (error) {
    console.error("خطا در درخواست خروج:", error);
    throw error;
  }
};