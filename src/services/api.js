import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7130/api", // adjust if your backend runs elsewhere
});

// Automatically attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
