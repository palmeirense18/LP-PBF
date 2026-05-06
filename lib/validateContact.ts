export interface ContactFormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  file: File | null;
}

export type ContactFormErrors = Record<keyof ContactFormState, string | null>;

export const ALLOWED_FILE_EXTENSIONS = [
  ".pdf",
  ".step",
  ".stp",
  ".iges",
  ".igs",
  ".dwg",
  ".dxf",
  ".zip",
] as const;

export const MAX_FILE_BYTES = 25 * 1024 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(state: ContactFormState): ContactFormErrors {
  const errors: ContactFormErrors = {
    name: null,
    company: null,
    email: null,
    phone: null,
    message: null,
    file: null,
  };

  if (state.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }

  const email = state.email.trim();
  if (email.length === 0) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (state.message.trim().length < 10) {
    errors.message = "Please describe your inquiry (at least 10 characters).";
  }

  if (state.phone.trim().length > 0) {
    const digits = state.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      errors.phone = "Phone number should contain at least 10 digits.";
    }
  }

  if (state.file) {
    const name = state.file.name.toLowerCase();
    const okExt = ALLOWED_FILE_EXTENSIONS.some((ext) => name.endsWith(ext));
    if (!okExt) {
      errors.file = `Unsupported file type. Allowed: ${ALLOWED_FILE_EXTENSIONS.join(
        ", "
      )}.`;
    } else if (state.file.size > MAX_FILE_BYTES) {
      errors.file = "File exceeds 25 MB.";
    }
  }

  return errors;
}

export function hasErrors(errors: ContactFormErrors): boolean {
  return (Object.keys(errors) as Array<keyof ContactFormErrors>).some(
    (k) => errors[k] !== null
  );
}
