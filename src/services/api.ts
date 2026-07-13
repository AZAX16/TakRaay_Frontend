import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL = "https://karboard.chbkn.dev/api";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type RefreshTokenResponse = {
  access?: string;
  access_token?: string;
  token?: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const publicUrls = [
  "/auth/login/",
  "/auth/register/",
  "/auth/send-otp/",
  "/auth/forgot-password/",
  "/auth/reset-password/",
  "/auth/password/forgot/",
  "/auth/password/verify-otp/",
  "/auth/password/reset/",
  "/auth/token/refresh/",
];

const getAccessTokenFromResponse = (data: RefreshTokenResponse): string | undefined =>
  data.access || data.access_token || data.token;

const clearAuthAndRedirect = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

let refreshTokenRequest: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!refreshTokenRequest) {
    refreshTokenRequest = authApi
      .post<RefreshTokenResponse>("/auth/token/refresh/", {
        refresh: refreshToken,
      })
      .then((response) => {
        const newAccessToken = getAccessTokenFromResponse(response.data);

        if (!newAccessToken) {
          throw new Error("Refresh response does not include an access token");
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        refreshTokenRequest = null;
      });
  }

  return refreshTokenRequest;
};

api.interceptors.request.use((config) => {
  const requestUrl = config.url || "";
  const isPublicRequest = publicUrls.some((url) => requestUrl.includes(url));

  if (!isPublicRequest) {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";
    const isRefreshRequest = requestUrl.includes("/auth/token/refresh/");
    const isPublicRequest = publicUrls.some((url) => requestUrl.includes(url));

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest ||
      isPublicRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest as AxiosRequestConfig);
    } catch (refreshError) {
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
