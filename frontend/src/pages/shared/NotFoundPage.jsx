import { MapPinOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/common/PageTransition";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-4">
      <PageTransition>
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <MapPinOff className="mx-auto h-10 w-10 text-slate-400" />
          <h1 className="font-display mt-4 text-3xl text-slate-900">Page not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            The page you are trying to open does not exist.
          </p>

          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate("/", { replace: true })}>Return home</Button>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}

export default NotFoundPage;
