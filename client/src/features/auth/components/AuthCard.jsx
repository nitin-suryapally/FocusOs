import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FormField } from "../../../components/FormField";
import { markRegistrationOnboardingPending } from "../../onboarding/onboardingStorage";
import {
  useAuthRegister,
  useAuthLogin,
  useAuthIsLoading,
  useAuthError,
  useAuthClearError
} from "../store/useAuthStore";

const validateForm = (mode, values) => {
  const errors = {};

  if (mode === "register" && !values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  return errors;
};

export const AuthCard = ({ mode }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const register = useAuthRegister();
  const login = useAuthLogin();
  const isLoading = useAuthIsLoading();
  const error = useAuthError();
  const clearError = useAuthClearError();

  const isRegisterMode = mode === "register";

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((current) => ({ ...current, [name]: undefined }));
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(mode, values);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});

    try {
      if (isRegisterMode) {
        const result = await register(values);
        markRegistrationOnboardingPending(result.user?.id);
      } else {
        await login({ email: values.email, password: values.password });
      }

      navigate("/app");
    } catch {
      return;
    }
  };

  return (
    <div className="w-full rounded-[28px] border border-outline-variant/70 bg-surface/88 p-6 shadow-card backdrop-blur-xl sm:p-8">
      <div className="mb-8 space-y-3">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.24em] text-primary lg:hidden">
          Focus AI
        </span>
        <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
          {isRegisterMode ? "Create your workspace" : "Sign in to continue"}
        </h2>
        <p className="text-body-md text-on-surface-variant">
          {isRegisterMode
            ? "Create an account to keep your tasks, learning, projects, and applications together."
            : "Return to your tasks, streaks, learning resources, projects, and applications."}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {isRegisterMode ? (
          <FormField
            id="name"
            label="Full name"
            value={values.name}
            onChange={updateField}
            placeholder="Alex Carter"
            autoComplete="name"
            error={fieldErrors.name}
          />
        ) : null}

        <FormField
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={updateField}
          placeholder="alex@example.com"
          autoComplete="email"
          error={fieldErrors.email}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={updateField}
          placeholder="At least 8 characters"
          autoComplete={isRegisterMode ? "new-password" : "current-password"}
          error={fieldErrors.password}
        />

        {error ? (
          <div role="alert" className="rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-body-sm text-on-error-container">
            {error}
          </div>
        ) : (
          <div className="rounded-2xl border border-secondary-container/80 bg-secondary-container/35 px-4 py-3 text-body-sm text-on-secondary-container">
            Your workspace is private to your account.
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary shadow-card transition hover:shadow-elevated focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Working..." : isRegisterMode ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-start gap-3 border-t border-outline-variant/50 pt-5 text-body-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
        <span>{isRegisterMode ? "Already have an account?" : "Need an account?"}</span>
        <Link className="font-semibold text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20" to={isRegisterMode ? "/login" : "/register"}>
          {isRegisterMode ? "Sign in" : "Create one"}
        </Link>
      </div>
    </div>
  );
};
