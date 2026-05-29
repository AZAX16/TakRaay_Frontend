import axios, { type InternalAxiosRequestConfig } from "axios";

const defaultBaseURL = import.meta.env.DEV
  ? "/api"
  : "https://karboard.chbkn.run/api";
const tokenStorageKeys = ["takraay_token", "access_token", "access", "token"];

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorageKeys
    .map((key) => localStorage.getItem(key))
    .find((value): value is string => Boolean(value));

  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
