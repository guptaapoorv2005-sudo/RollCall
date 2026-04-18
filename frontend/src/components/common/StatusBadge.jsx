import clsx from "clsx";

const styleMap = {
  PRESENT: "bg-emerald-100 text-emerald-700",
  ABSENT: "bg-rose-100 text-rose-700",
};

function StatusBadge({ value }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        styleMap[value] || "bg-slate-100 text-slate-600",
      )}
    >
      {value || "-"}
    </span>
  );
}

export default StatusBadge;
