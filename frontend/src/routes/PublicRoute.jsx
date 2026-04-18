import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { resolvePostAuthPath } from "../utils/role";
import LoadingState from "../components/common/LoadingState";

function PublicRoute({ children }) {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const location = useLocation();
  const redirectTo = resolvePostAuthPath(user?.role, location.state?.from?.pathname);

  if (isBootstrapping) {
    return <LoadingState label="Preparing app" fullScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default PublicRoute;
