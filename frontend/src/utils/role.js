import { ROLES } from "./constants";

const ROLE_HOME_MAP = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.TEACHER]: "/teacher",
  [ROLES.STUDENT]: "/student",
};

const ROLE_PATH_PREFIX_MAP = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.TEACHER]: "/teacher",
  [ROLES.STUDENT]: "/student",
};

const ROLE_LABEL_MAP = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.TEACHER]: "Teacher",
  [ROLES.STUDENT]: "Student",
};

export const getRoleHomePath = (role) => ROLE_HOME_MAP[role] || "/login";

export const getRoleLabel = (role) => ROLE_LABEL_MAP[role] || "User";

export const isRoleAllowed = (role, allowedRoles = []) => {
  if (!allowedRoles.length) {
    return true;
  }

  return allowedRoles.includes(role);
};

const getPathRole = (path = "") => {
  const pathname = String(path || "");

  const matchedEntry = Object.entries(ROLE_PATH_PREFIX_MAP).find(([, prefix]) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  return matchedEntry?.[0] || null;
};

export const canRoleAccessPath = (role, path) => {
  const pathRole = getPathRole(path);

  if (!pathRole) {
    return true;
  }

  return pathRole === role;
};

export const resolvePostAuthPath = (role, requestedPath) => {
  const fallbackPath = getRoleHomePath(role);

  if (!requestedPath) {
    return fallbackPath;
  }

  if (["/login", "/signup", "/unauthorized"].includes(requestedPath)) {
    return fallbackPath;
  }

  return canRoleAccessPath(role, requestedPath) ? requestedPath : fallbackPath;
};
