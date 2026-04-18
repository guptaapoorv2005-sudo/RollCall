import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

function LoadingState({ label = "Loading", fullScreen = false, className }) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-10",
        fullScreen && "min-h-screen rounded-none border-none bg-transparent",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-slate-600">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

export default LoadingState;
