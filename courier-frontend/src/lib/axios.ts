import axios from "axios";

const base = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const api = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (r) => r,
  (e) => Promise.reject(new Error(e.response?.data?.message ?? e.message))
);

export default api;