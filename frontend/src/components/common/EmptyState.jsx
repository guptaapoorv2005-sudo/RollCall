import { Inbox } from "lucide-react";

function EmptyState({
  title = "Nothing here yet",
  description = "Data will appear once it is created.",
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <Inbox className="mx-auto h-8 w-8 text-slate-400" />
      <h4 className="mt-3 text-sm font-semibold text-slate-700">{title}</h4>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyState;
