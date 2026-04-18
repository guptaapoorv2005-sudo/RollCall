import axios from "axios";
import { COOKIE_SESSION_TOKEN, DEFAULT_API_BASE_URL } from "../utils/constants";
import { clearAuthSession, getStoredToken } from "../utils/storage";
import { extractApiErrorMessage } from "../utils/http";

const REFRESH_TOKEN_PATH = "/users/refresh-token";
const AUTH_BYPASS_PATHS = ["/users/login", "/users/register", REFRESH_TOKEN_PATH];

let isRefreshingToken = false;
let refreshSubscribers = [];

const isBypassedAuthPath = (url = "") =>
  AUTH_BYPASS_PATHS.some((path) => String(url).includes(path));

const subscribeTokenRefresh = () =>
  new Promise((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject });
  });

const flushRefreshSubscribers = (error = null) => {
  const subscribers = refreshSubscribers;
  refreshSubscribers = [];

  subscribers.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    resolve();
  });
};

const refreshAccessToken = async () => {
  await axios.post(
    `${apiClient.defaults.baseURL}${REFRESH_TOKEN_PATH}`,
    {},
    {
      withCredentials: true,
      timeout: apiClient.defaults.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token && token !== COOKIE_SESSION_TOKEN) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    error.userMessage = extractApiErrorMessage(error);

    const statusCode = error?.response?.status;
    const originalRequest = error?.config;

    if (statusCode === 401 && originalRequest && !originalRequest._retry && !isBypassedAuthPath(originalRequest.url)) {
      if (isRefreshingToken) {
        try {
          await subscribeTokenRefresh();
          return apiClient(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      originalRequest._retry = true;
      isRefreshingToken = true;

      try {
        await refreshAccessToken();
        flushRefreshSubscribers();
        return apiClient(originalRequest);
      } catch (refreshError) {
        flushRefreshSubscribers(refreshError);
        clearAuthSession();

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("attendify:unauthorized"));
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshingToken = false;
      }
    }

    if (statusCode === 401) {
      clearAuthSession();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("attendify:unauthorized"));
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
