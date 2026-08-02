"use client";
import { useId } from "react";

/**
 * A labelled input or textarea with a floating label.
 *
 * The label motion is pure CSS. `placeholder=" "` — a single space, not an
 * empty string — is what makes that work: it keeps `:placeholder-shown`
 * matching while the field is empty, so the label can sit over the input at
 * rest and lift on `:focus` or as soon as anything is typed. No onChange
 * listener, no state, nothing on the main thread per keystroke.
 *
 * The visible label is a real <label>, not a placeholder pretending to be one.
 * Placeholder-as-label is the standard version of this pattern and it fails
 * twice over: the text vanishes the moment the user starts typing, taking the
 * only description of the field with it, and most screen readers do not
 * announce it at all.
 */
export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required,
  rows,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Shown under the field once it has been touched or submitted. */
  error?: string;
  required?: boolean;
  /** Present ⇒ renders a textarea. */
  rows?: number;
  autoComplete?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const multiline = rows !== undefined;

  const shared = {
    id,
    name,
    value,
    required,
    autoComplete,
    placeholder: " ",
    /* Announces the invalid state rather than relying on the red ring, which a
       screen reader cannot see and a colourblind user may not distinguish. */
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    onBlur,
    className: "field-control peer",
  };

  return (
    <div className="field" data-invalid={error ? "" : undefined}>
      {multiline ? (
        <textarea {...shared} rows={rows} />
      ) : (
        <input {...shared} type={type} />
      )}

      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>

      {/*
        `role="alert"` on a node that is always mounted, with the message
        swapped in and out. Mounting the element only when invalid is the
        common version and it is unreliable — a live region has to exist
        before the text lands in it or assistive tech may miss the change.
      */}
      <p id={errorId} role="alert" className="field-error">
        {error}
      </p>
    </div>
  );
}
