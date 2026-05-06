"use client";

import { forwardRef } from "react";

type FieldType = "text" | "email" | "tel" | "textarea";

interface BaseProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string | null;
  placeholder?: string;
  autoComplete?: string;
}

interface InputProps extends BaseProps {
  type: Exclude<FieldType, "textarea">;
  rows?: never;
}
interface TextareaProps extends BaseProps {
  type: "textarea";
  rows?: number;
}

type Props = InputProps | TextareaProps;

const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 400,
  letterSpacing: "0.32em",
};

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  function FormField(props, ref) {
    const {
      id,
      label,
      value,
      onChange,
      onBlur,
      required,
      error,
      placeholder,
      autoComplete,
      type,
    } = props;
    const errorId = `${id}-error`;
    const hasError = !!error;

    const sharedClassName =
      "form-field-input peer block w-full bg-transparent pt-2 pb-3 font-body text-[16px] text-bone caret-royal placeholder:text-silver/40 outline-none";
    const sharedStyle: React.CSSProperties = {
      borderBottom: "1px solid rgba(149,165,166,0.25)",
      transition: "border-color 220ms cubic-bezier(0.25,1,0.5,1)",
      borderColor: hasError
        ? "rgba(228,88,88,0.7)"
        : "rgba(149,165,166,0.25)",
    };

    return (
      <div className="form-field group relative w-full">
        <label
          htmlFor={id}
          className="block font-display uppercase text-silver/70"
          style={labelStyle}
        >
          {label}
          {required ? (
            <>
              <span aria-hidden className="ml-1 text-royalLight">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
        </label>

        <div className="relative">
          {type === "textarea" ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              required={required}
              aria-required={required || undefined}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? errorId : undefined}
              placeholder={placeholder}
              autoComplete={autoComplete ?? "off"}
              rows={(props as TextareaProps).rows ?? 5}
              data-cursor="hover"
              className={`${sharedClassName} min-h-[140px] resize-y`}
              style={sharedStyle}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={id}
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              required={required}
              aria-required={required || undefined}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? errorId : undefined}
              placeholder={placeholder}
              autoComplete={autoComplete ?? "off"}
              data-cursor="hover"
              className={sharedClassName}
              style={sharedStyle}
            />
          )}
          {/* Focus glow underline */}
          <span
            aria-hidden
            className="form-field-glow pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 origin-left bg-royal opacity-0 transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              boxShadow: "0 0 12px rgba(43,91,166,0.4)",
            }}
          />
        </div>

        {hasError ? (
          <p
            id={errorId}
            role="alert"
            className="mt-2 font-body text-[12px]"
            style={{ color: "#E45858" }}
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

export default FormField;
