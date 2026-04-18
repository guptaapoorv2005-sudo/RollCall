import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { getRoleHomePath } from "../../utils/role";

const MotionSection = motion.section;

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!formData.className.trim()) {
      setError("Class name is required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        name: formData.name.trim(),
        className: formData.className.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate(getRoleHomePath(user?.role), { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-16 h-56 w-56 rounded-full bg-sky-100/80 blur-2xl" />
        <div className="absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-slate-200/80 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
        <MotionSection
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="hidden rounded-2xl border border-slate-200 bg-white p-10 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:block"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Student Attendance Management
          </span>
          <h1 className="font-display mt-6 text-4xl leading-tight text-slate-900">
            Create your Attendify account in a minute.
          </h1>
          <p className="mt-4 text-slate-500">
            New students can sign up here and start tracking attendance right away.
          </p>
        </MotionSection>

        <MotionSection
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-8"
        >
          <h2 className="font-display text-3xl text-slate-900">Create account</h2>
          <p className="mt-1 text-sm text-slate-500">Set up your student account</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input
              id="name"
              label="Full name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              required
            />

            <Input
              id="email"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@school.edu"
              autoComplete="email"
              required
            />

            <Input
              id="className"
              label="Class name"
              name="className"
              type="text"
              value={formData.className}
              onChange={handleChange}
              placeholder="B.Tech CSE - A"
              autoComplete="organization-title"
              required
            />

            <Input
              id="password"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
            />

            <Input
              id="confirmPassword"
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />

            {error ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {error}
              </p>
            ) : null}

            <Button className="w-full" size="lg" type="submit" loading={isSubmitting}>
              Create account
            </Button>

            <p className="text-center text-sm text-slate-500">
              Already have an account? {" "}
              <Link to="/login" className="font-semibold text-sky-700 hover:text-sky-800">
                Sign in
              </Link>
            </p>
          </form>
        </MotionSection>
      </div>
    </div>
  );
}

export default SignupPage;
