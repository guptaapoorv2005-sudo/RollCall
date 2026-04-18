import { AlertCircle } from "lucide-react";
import Button from "../ui/Button";

function ErrorState({
  title = "Unable to load data",
  description = "Please try again in a moment.",
  onRetry,
}) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 text-rose-500" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-700">{title}</h4>
          <p className="mt-1 text-sm text-rose-600">{description}</p>
          {onRetry ? (
            <div className="mt-3">
              <Button size="sm" variant="danger" onClick={onRetry}>
                Retry
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ErrorState;
