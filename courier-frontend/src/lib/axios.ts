import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[Axios] ➡️  ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params || '');
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Axios] ✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    console.error(`[Axios] ❌ ${status || 'NETWORK'} ${url} — ${message}`);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
