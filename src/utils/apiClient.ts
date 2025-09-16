// apiClient.ts
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.headers?.skipAuth) {
      return config;
    }

    const token = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (refreshToken) {
      config.headers["X-Refresh-Token"] = refreshToken;
    }

    return config;
  },
  error => Promise.reject(error),
);

export default apiClient;
