import axios from "axios";

const api = axios.create({
  baseURL: "https://karboard.chbk.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
