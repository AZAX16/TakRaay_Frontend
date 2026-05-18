import axios from "axios";

const TEMP_ACCESS_TOKEN = "";

const apiClient = axios.create({
  baseURL: "https://karboard.chbk.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${TEMP_ACCESS_TOKEN}`;


  return config;
});

export default apiClient;