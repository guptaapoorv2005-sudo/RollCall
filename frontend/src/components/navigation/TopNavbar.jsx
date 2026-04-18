import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getRoleLabel } from "../../utils/role";
import Button from "../ui/Button";

function TopNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "User"} ({getRoleLabel(user?.role)})
            </p>
          </div>
        </div>

        <Button variant="secondary" size="sm" leftIcon={LogOut} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default TopNavbar;
