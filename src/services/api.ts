import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: "https://karboard.chbkn.run/api",
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("%c[Axios Response Success]", "color: #4caf50; font-weight: bold;", response.config.url, {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("%c[Axios Response Error]", "color: #f44336; font-weight: bold;", error.config?.url, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default apiClient;
