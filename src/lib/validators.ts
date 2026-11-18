export type UserRole = "student" | "tutor";

export interface SignUpValues {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignInValues {
  email: string;
  password: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignUp = (
  values: SignUpValues,
): FieldErrors<SignUpValues> => {
  const errors: FieldErrors<SignUpValues> = {};

  if (values.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters";
  }
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  if (values.role !== "student" && values.role !== "tutor") {
    errors.role = "Please choose a role";
  }

  return errors;
};

export const validateSignIn = (
  values: SignInValues,
): FieldErrors<SignInValues> => {
  const errors: FieldErrors<SignInValues> = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};
