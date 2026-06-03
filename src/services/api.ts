import axios from "axios";

const api = axios.create({
  baseURL: "https://karboard.chbkn.run/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const publicUrls = [
    "/auth/login/",
    "/auth/register/",
    "/auth/send-otp/",
    "/auth/forgot-password/",
    "/auth/reset-password/",
  ];

  const isPublicRequest = publicUrls.some((url) =>
    config.url?.includes(url),
  );

  if (!isPublicRequest) {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;