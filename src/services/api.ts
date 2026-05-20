import axios, { type InternalAxiosRequestConfig } from "axios";

const TEMP_ACCESS_TOKEN = "اینجا access token کامل را بدون Bearer بذار";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (TEMP_ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${TEMP_ACCESS_TOKEN}`;
  }

  return config;
});

export default apiClient;