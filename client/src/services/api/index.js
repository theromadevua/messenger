import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;
export const RESOURCE_URL = process.env.REACT_APP_RESOURCE_URL;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log(process.env.REACT_APP_API_URL)

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
