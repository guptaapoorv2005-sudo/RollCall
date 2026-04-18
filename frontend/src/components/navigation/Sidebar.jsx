import clsx from "clsx";
import { GraduationCap } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { navigationByRole } from "../../utils/navigation";

function Sidebar({ className, onNavigate }) {
  const { user } = useAuth();
  const navigationItems = navigationByRole[user?.role] || [];

  return (
    <aside
      className={clsx(
        "w-64 border-r border-slate-200 bg-white px-4 py-5",
        className,
      )}
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-lg leading-tight text-slate-900">Attendify</p>
          <p className="text-xs text-slate-500">Attendance management</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
