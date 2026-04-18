import { AUTH_STORAGE_KEY } from "./constants";

const parseSession = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getStoredSession = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const parsed = parseSession(localStorage.getItem(AUTH_STORAGE_KEY));
  return {
    token: parsed?.token ?? null,
    user: parsed?.user ?? null,
  };
};

export const getStoredToken = () => getStoredSession().token;

export const getStoredUser = () => getStoredSession().user;

export const persistAuthSession = ({ token, user }) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token,
      user,
    }),
  );
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
};
