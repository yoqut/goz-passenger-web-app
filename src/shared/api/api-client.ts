import axios from "axios";
import { tokenService } from "./token-service";

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_BASE_API || "https://jsonplaceholder.typicode.com",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Token ${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}`,
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (token) config.headers.Authorization = `Token ${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenService.clear();
    }
    return Promise.reject(error);
  }
);
