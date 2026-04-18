import clsx from "clsx";

function Card({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}) {
  return (
    <section
      className={clsx(
        "rounded-xl border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      {title || description || action ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            {title ? (
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          {action}
        </header>
      ) : null}

      <div className={clsx("px-5 py-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export default Card;
