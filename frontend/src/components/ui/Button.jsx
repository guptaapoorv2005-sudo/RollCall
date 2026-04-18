import clsx from "clsx";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

const MotionButton = motion.button;

const variantClasses = {
  primary:
    "bg-sky-600 text-white shadow-sm hover:bg-sky-700 focus-visible:ring-sky-300",
  secondary:
    "bg-slate-100 text-slate-700 shadow-sm hover:bg-slate-200 focus-visible:ring-slate-300",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300",
  success:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-300",
  danger:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-300",
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  leftIcon: LeftIcon,
  ...props
}) {
  return (
    <MotionButton
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={clsx(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {!loading && LeftIcon ? <LeftIcon className="h-4 w-4" /> : null}
      {children}
    </MotionButton>
  );
}

export default Button;
