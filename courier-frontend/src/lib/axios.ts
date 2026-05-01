import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://subak-raftar.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  console.log(`[Axios] ➡️  ${config.method?.toUpperCase()} ${config.url}`, config.params || "");
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    console.log(`[Axios] ✅ ${res.status} ${res.config.url}`, res.data);
    return res;
  },
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url;
    const message = err.response?.data?.message || err.message;
    console.log(`[Axios] ❌ ${status} ${url} — ${message}`);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;