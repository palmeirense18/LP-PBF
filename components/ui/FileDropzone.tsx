"use client";

import { useId, useRef, useState } from "react";
import {
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_BYTES,
} from "@/lib/validateContact";

interface FileDropzoneProps {
  value: File | null;
  onChange: (f: File | null) => void;
  error?: string | null;
  onValidationError?: (msg: string | null) => void;
}

const ACCEPT_ATTR = ALLOWED_FILE_EXTENSIONS.join(",");

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  const lower = file.name.toLowerCase();
  const okExt = ALLOWED_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
  if (!okExt) {
    return `Unsupported file type. Allowed: ${ALLOWED_FILE_EXTENSIONS.join(
      ", "
    )}.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return "File exceeds 25 MB.";
  }
  return null;
}

export default function FileDropzone({
  value,
  onChange,
  error,
  onValidationError,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const errorId = useId();

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const err = validateFile(f);
    onValidationError?.(err);
    if (err) {
      onChange(null);
      return;
    }
    onChange(f);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div>
      <label
        className="block font-display uppercase text-silver/70"
        style={{
          fontSize: "10px",
          fontWeight: 400,
          letterSpacing: "0.32em",
        }}
      >
        Print or specification file (optional)
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        aria-label="Upload print or specification file"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        aria-describedby={error ? errorId : undefined}
      />

      {value ? (
        <SelectedState
          file={value}
          onClear={() => {
            onChange(null);
            onValidationError?.(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      ) : (
        <EmptyState
          dragOver={dragOver}
          onClick={openPicker}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        />
      )}

      {error ? (
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

// ---------------------------------------------------------------------------
// Empty state — drop target
// ---------------------------------------------------------------------------

interface EmptyStateProps {
  dragOver: boolean;
  onClick: () => void;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: React.DragEventHandler<HTMLDivElement>;
}

function EmptyState({
  dragOver,
  onClick,
  onDrop,
  onDragOver,
  onDragLeave,
}: EmptyStateProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload print or specification file"
      data-cursor="hover"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className="mt-2 flex h-[110px] w-full cursor-pointer items-center justify-center p-6 outline-none transition-[background-color,border-color] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] focus-visible:ring-2 focus-visible:ring-royal/60"
      style={{
        border: dragOver
          ? "1px solid rgba(43,91,166,1)"
          : "1px dashed rgba(149,165,166,0.25)",
        backgroundColor: dragOver ? "rgba(43,91,166,0.08)" : "transparent",
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <UploadIcon highlight={dragOver} />
        <span className="font-body text-[14px] text-silver">
          Drop your print here or click to browse
        </span>
        <span
          className="font-body"
          style={{ fontSize: "11px", color: "rgba(192,197,206,0.5)" }}
        >
          PDF · STEP · IGES · DWG · DXF · ZIP — up to 25 MB
        </span>
      </div>
    </div>
  );
}

function UploadIcon({ highlight }: { highlight: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={highlight ? "#F5F5F5" : "#2B5BA6"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-[stroke] duration-200"
    >
      {/* Document with corner fold */}
      <path d="M5 3 H14 L19 8 V21 H5 Z" />
      <path d="M14 3 V8 H19" />
      {/* Upload arrow inside */}
      <path d="M12 18 V12" />
      <path d="M9 14.5 L12 12 L15 14.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Selected state — chip with filename + clear
// ---------------------------------------------------------------------------

interface SelectedStateProps {
  file: File;
  onClear: () => void;
}

function SelectedState({ file, onClear }: SelectedStateProps) {
  return (
    <div
      className="mt-2 flex w-full items-center justify-between p-4"
      style={{ border: "1px solid rgba(43,91,166,0.4)" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <FileIcon />
        <span className="truncate font-body text-[14px] font-bold text-bone">
          {file.name}
        </span>
        <span
          className="shrink-0 font-body text-[12px]"
          style={{ color: "rgba(192,197,206,0.6)" }}
        >
          {formatBytes(file.size)}
        </span>
      </div>
      <button
        type="button"
        onClick={onClear}
        data-cursor="hover"
        aria-label={`Remove file ${file.name}`}
        className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center text-silver outline-none transition-[border-color,color] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:text-bone focus-visible:ring-2 focus-visible:ring-royal/60"
        style={{ border: "1px solid rgba(149,165,166,0.25)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "rgba(228,88,88,0.4)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "rgba(149,165,166,0.25)")
        }
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <line
            x1="3"
            y1="3"
            x2="11"
            y2="11"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <line
            x1="11"
            y1="3"
            x2="3"
            y2="11"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

function FileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#2B5BA6"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <path d="M4 2.5 H12 L16 6.5 V17.5 H4 Z" />
      <path d="M12 2.5 V6.5 H16" />
    </svg>
  );
}
