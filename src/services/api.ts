import axios from "axios";

const TEMP_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc5OTExNjU2LCJpYXQiOjE3Nzk5MDk4NTYsImp0aSI6IjdkY2MwNzMxOGNjMTQwZGY4M2QxMmJkMDUyMDQ5YmQ3IiwidXNlcl9pZCI6IjIifQ.ApcGP1428gVeJ-4NtLImX7HnHafTIsoHYdO--5cL5Hc";

const apiClient = axios.create({
  baseURL: "https://karboard.chbkn.run/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${TEMP_ACCESS_TOKEN}`;


  return config;
});

export default apiClient;