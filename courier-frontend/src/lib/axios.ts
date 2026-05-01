import axios from "axios";

const base = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const api = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token on every request (production uses token, local falls back to cookie)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ba_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => Promise.reject(new Error(e.response?.data?.message ?? e.message))
);

export default api;