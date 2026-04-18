import apiClient from "./apiClient";
import { extractApiErrorMessage, unwrapApiData } from "../utils/http";
import { COOKIE_SESSION_TOKEN } from "../utils/constants";

const resolveTokenFromResponse = (response, payload) => {
  const authHeader =
    response?.headers?.authorization || response?.headers?.Authorization;

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  return (
    payload?.accessToken ||
    payload?.token ||
    response?.data?.accessToken ||
    response?.data?.token ||
    null
  );
};

const normalizeUser = (payload) => payload?.user || payload?.currentUser || payload;

export const authService = {
  async register(payload) {
    try {
      const response = await apiClient.post("/users/register", payload);
      const responseData = unwrapApiData(response) || {};
      const user = normalizeUser(responseData);
      const token = resolveTokenFromResponse(response, responseData) || COOKIE_SESSION_TOKEN;

      if (!user?.id || !user?.role) {
        throw new Error("Sign up response is missing user details");
      }

      return { user, token };
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async login(credentials) {
    try {
      const response = await apiClient.post("/users/login", credentials);
      const payload = unwrapApiData(response) || {};

      const token = resolveTokenFromResponse(response, payload) || COOKIE_SESSION_TOKEN;
      const user = normalizeUser(payload);

      if (!user?.id || !user?.role) {
        throw new Error("Login response is missing user details");
      }

      return { token, user };
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async logout() {
    try {
      await apiClient.post("/users/logout");
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get("/users/current-user");
      const payload = unwrapApiData(response);
      const user = normalizeUser(payload);

      if (!user?.id || !user?.role) {
        throw new Error("Unable to resolve current user");
      }

      return user;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
};
