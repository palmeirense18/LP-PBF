"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import FileDropzone from "@/components/ui/FileDropzone";
import {
  hasErrors,
  validateContact,
  type ContactFormErrors,
  type ContactFormState,
} from "@/lib/validateContact";

const EMPTY_STATE: ContactFormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
  file: null,
};

const EMPTY_ERRORS: ContactFormErrors = {
  name: null,
  company: null,
  email: null,
  phone: null,
  message: null,
  file: null,
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const FIELD_ORDER: Array<keyof ContactFormState> = [
  "name",
  "company",
  "email",
  "phone",
  "message",
  "file",
];

export default function ContactForm() {
  const [state, setState] = useState<ContactFormState>(EMPTY_STATE);
  const [errors, setErrors] = useState<ContactFormErrors>(EMPTY_ERRORS);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs = useMemo<Record<keyof ContactFormState, React.RefObject<HTMLElement>>>(
    () => ({
      name: nameRef as React.RefObject<HTMLElement>,
      company: companyRef as React.RefObject<HTMLElement>,
      email: emailRef as React.RefObject<HTMLElement>,
      phone: phoneRef as React.RefObject<HTMLElement>,
      message: messageRef as React.RefObject<HTMLElement>,
      file: { current: null } as React.RefObject<HTMLElement>,
    }),
    []
  );

  // Build mailto fallback url
  const mailtoHref = useMemo(() => {
    const subject = `Inquiry — ${state.name || "PBFMACHINE"}`;
    const lines = [
      state.name ? `Name: ${state.name}` : null,
      state.company ? `Company: ${state.company}` : null,
      state.email ? `Email: ${state.email}` : null,
      state.phone ? `Phone: ${state.phone}` : null,
      "",
      state.message,
    ]
      .filter((l) => l !== null)
      .join("\n");
    return `mailto:info@pbfmachine.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(lines)}`;
  }, [state]);

  const updateField = useCallback(
    <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
      setState((s) => ({ ...s, [key]: value }));
    },
    []
  );

  const validateField = useCallback(
    (key: keyof ContactFormState) => {
      const next = validateContact(state);
      setErrors((prev) => ({ ...prev, [key]: next[key] }));
    },
    [state]
  );

  const onBlurOf = useCallback(
    (key: keyof ContactFormState) => () => {
      if (!submittedOnce) return;
      validateField(key);
    },
    [submittedOnce, validateField]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    setSubmittedOnce(true);
    const next = validateContact(state);
    setErrors(next);
    if (hasErrors(next)) {
      const firstKey = FIELD_ORDER.find((k) => next[k] !== null);
      if (firstKey && firstKey !== "file") {
        const ref = fieldRefs[firstKey];
        ref.current?.focus();
      }
      return;
    }

    setStatus("submitting");
    const fd = new FormData();
    fd.append("name", state.name);
    fd.append("company", state.company);
    fd.append("email", state.email);
    fd.append("phone", state.phone);
    fd.append("message", state.message);
    if (state.file) fd.append("file", state.file);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Server returned non-OK");
      setStatus("success");
    } catch {
      window.clearTimeout(timeoutId);
      setStatus("error");
    }
  };

  // After success: hold for 4s, then reset
  useEffect(() => {
    if (status !== "success") return;
    const t = window.setTimeout(() => {
      setState(EMPTY_STATE);
      setErrors(EMPTY_ERRORS);
      setSubmittedOnce(false);
      setStatus("idle");
    }, 4000);
    return () => window.clearTimeout(t);
  }, [status]);

  const submitting = status === "submitting";
  const showSuccess = status === "success";
  const showError = status === "error";

  return (
    <div className="relative w-full" aria-live="polite">
      {showSuccess ? (
        <SuccessBlock />
      ) : (
        <form
          aria-label="Contact PBFMACHINE"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6 transition-opacity duration-200"
          style={{ opacity: submitting ? 0.85 : 1 }}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <span data-contact-field>
              <FormField
                ref={nameRef}
                id="contact-name"
                type="text"
                label="Name"
                required
                autoComplete="name"
                value={state.name}
                onChange={(v) => updateField("name", v)}
                onBlur={onBlurOf("name")}
                error={errors.name}
              />
            </span>
            <span data-contact-field>
              <FormField
                ref={companyRef}
                id="contact-company"
                type="text"
                label="Company"
                autoComplete="organization"
                value={state.company}
                onChange={(v) => updateField("company", v)}
                onBlur={onBlurOf("company")}
                error={errors.company}
              />
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <span data-contact-field>
              <FormField
                ref={emailRef}
                id="contact-email"
                type="email"
                label="Email"
                required
                autoComplete="email"
                value={state.email}
                onChange={(v) => updateField("email", v)}
                onBlur={onBlurOf("email")}
                error={errors.email}
              />
            </span>
            <span data-contact-field>
              <FormField
                ref={phoneRef}
                id="contact-phone"
                type="tel"
                label="Phone"
                autoComplete="tel"
                value={state.phone}
                onChange={(v) => updateField("phone", v)}
                onBlur={onBlurOf("phone")}
                error={errors.phone}
              />
            </span>
          </div>

          <span data-contact-field>
            <FormField
              ref={messageRef}
              id="contact-message"
              type="textarea"
              label="Message"
              required
              autoComplete="off"
              value={state.message}
              onChange={(v) => updateField("message", v)}
              onBlur={onBlurOf("message")}
              error={errors.message}
              placeholder="Tell us about your part — material, quantity, tolerances, lead time."
              rows={5}
            />
          </span>

          <span data-contact-field>
            <FileDropzone
              value={state.file}
              onChange={(f) => updateField("file", f)}
              error={errors.file}
              onValidationError={(msg) =>
                setErrors((prev) => ({ ...prev, file: msg }))
              }
            />
          </span>

          <div data-contact-field className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-end">
            <div className="relative">
              <Button type="submit" disabled={submitting} variant="primary">
                {submitting ? "Sending..." : "Send Inquiry"}
              </Button>
              {submitting ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
                >
                  <span
                    className="contact-progress-bar absolute top-0 h-px bg-royal"
                    style={{ boxShadow: "0 0 12px rgba(43,91,166,0.6)" }}
                  />
                </span>
              ) : null}
            </div>
          </div>

          {showError ? (
            <div
              role="alert"
              className="p-3 font-body text-[13px]"
              style={{
                border: "1px solid rgba(228,88,88,0.4)",
                backgroundColor: "rgba(228,88,88,0.08)",
                color: "#E45858",
              }}
            >
              We couldn&rsquo;t send your inquiry. Try again, or email us
              directly at{" "}
              <a
                href={mailtoHref}
                data-cursor="hover"
                className="underline"
                style={{ color: "#6FA0E6" }}
              >
                info@pbfmachine.com
              </a>
              .
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success block
// ---------------------------------------------------------------------------

function SuccessBlock() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [mounted, setMounted] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, [reduced]);

  return (
    <div
      className="flex flex-col items-center justify-center py-8 text-center"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: reduced
          ? "none"
          : "opacity 400ms ease-out, transform 400ms ease-out",
      }}
    >
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center bg-royal"
        aria-hidden
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M6 14 L12 20 L22 8"
            stroke="#F5F5F5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: mounted ? 0 : 40,
              transition: reduced ? "none" : "stroke-dashoffset 480ms ease-out 120ms",
            }}
          />
        </svg>
      </div>
      <h3
        className="font-display font-bold uppercase text-bone"
        style={{
          fontSize: "28px",
          letterSpacing: "-0.005em",
        }}
      >
        Inquiry received.
      </h3>
      <p className="mt-3 max-w-md font-body text-[16px] text-silver">
        We&rsquo;ll be in touch within one business day.
      </p>
    </div>
  );
}
