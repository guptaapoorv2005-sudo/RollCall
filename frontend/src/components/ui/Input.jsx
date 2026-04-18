import clsx from "clsx";

function Input({
  id,
  label,
  error,
  helperText,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={clsx("space-y-1.5", containerClassName)}>
      {label ? (
        <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <input
        id={id}
        className={clsx(
          "block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200",
          error ? "border-rose-300" : "border-slate-200",
          className,
        )}
        {...props}
      />

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {!error && helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;
