import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexus_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nexus_access_token");
      window.dispatchEvent(new CustomEvent("nexus:logout"));
    }
    return Promise.reject(error);
  },
);

export async function login(username: string, password: string): Promise<string> {
  const body = new URLSearchParams({ username, password });
  const response = await apiClient.post<{ access_token: string }>("/auth/token", body, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  localStorage.setItem("nexus_access_token", response.data.access_token);
  return response.data.access_token;
}
