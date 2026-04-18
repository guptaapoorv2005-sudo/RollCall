import clsx from "clsx";

const toneStyles = {
  blue: "bg-sky-50 border-sky-100 text-sky-700",
  green: "bg-emerald-50 border-emerald-100 text-emerald-700",
  red: "bg-rose-50 border-rose-100 text-rose-700",
  gray: "bg-slate-50 border-slate-200 text-slate-700",
};

function StatCard({ label, value, helper, icon: Icon, tone = "blue" }) {
  return (
    <article className={clsx("rounded-xl border px-4 py-4", toneStyles[tone])}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium opacity-80">{label}</p>
        {Icon ? <Icon className="h-4 w-4" /> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {helper ? <p className="mt-1 text-xs opacity-75">{helper}</p> : null}
    </article>
  );
}

export default StatCard;
