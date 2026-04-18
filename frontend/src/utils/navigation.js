import {
  BookCheck,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { ROLES } from "./constants";

export const navigationByRole = {
  [ROLES.ADMIN]: [
    {
      label: "Management",
      path: "/admin",
      icon: LayoutDashboard,
    },
  ],
  [ROLES.TEACHER]: [
    {
      label: "My Classes",
      path: "/teacher",
      icon: BookCheck,
    },
  ],
  [ROLES.STUDENT]: [
    {
      label: "Attendance",
      path: "/student",
      icon: UserRound,
    },
  ],
};
