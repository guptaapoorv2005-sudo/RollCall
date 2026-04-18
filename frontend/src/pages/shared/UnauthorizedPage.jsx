import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/common/PageTransition";

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-4">
      <PageTransition>
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <ShieldAlert className="mx-auto h-10 w-10 text-rose-500" />
          <h1 className="font-display mt-4 text-3xl text-slate-900">Access denied</h1>
          <p className="mt-2 text-sm text-slate-500">
            You do not have permission to view this route.
          </p>

          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate("/", { replace: true })}>Go to dashboard</Button>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}

export default UnauthorizedPage;
