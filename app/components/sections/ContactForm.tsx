"use client";
import { useState } from "react";
import Field from "@/app/components/ui/Field";
import Icon from "@/app/components/ui/Icon";
import { contact } from "@/app/lib/content";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", message: "" };

/**
 * Validation as a pure function of the values.
 *
 * Kept outside the component and returning the whole error set at once, so
 * submit and blur run exactly the same rules — the usual bug in hand-written
 * forms is a field that passes on blur and fails on submit because the two
 * paths grew apart.
 */
function validate(values: Values): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = "Please tell me your name.";

  if (!values.email.trim()) {
    errors.email = "I need an address to reply to.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    /* Deliberately loose. Anything stricter starts rejecting addresses that
       are perfectly valid, and the real check is whether the reply lands. */
    errors.email = "That does not look like an email address.";
  }

  if (!values.message.trim()) {
    errors.message = "A sentence or two is plenty.";
  } else if (values.message.trim().length < 12) {
    errors.message = "A little more detail would help.";
  }

  return errors;
}

/**
 * The contact form.
 *
 * Submitting opens the visitor's mail client with the message prefilled,
 * because this site has no mail provider wired up. That is a deliberate
 * choice over the alternative: a form that POSTs nowhere, shows a success
 * toast, and quietly drops what someone took the trouble to write. The
 * handoff is visible, it always arrives, and it needs no API key.
 *
 * `send()` is the only place that knows how delivery happens — swapping in a
 * real endpoint later means replacing that one function.
 */
export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, true>>>(
    {},
  );
  const [sent, setSent] = useState(false);

  const set = (field: keyof Values) => (next: string) => {
    setValues((current) => ({ ...current, [field]: next }));
    /* Re-validate as they type, but only once the field has been left. Live
       errors on a field someone is still filling in is nagging; live
       corrections on one they have already failed is helpful. */
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: next }));
    }
  };

  const blur = (field: keyof Values) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  };

  const send = (payload: Values) => {
    const subject = `Portfolio enquiry from ${payload.name.trim()}`;
    const body = `${payload.message.trim()}\n\n— ${payload.name.trim()}\n${payload.email.trim()}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(found).length > 0) {
      /* Move focus to the first field that failed. Without this a keyboard or
         screen reader user is told the form is invalid and left at the submit
         button with no indication of where the problem is. */
      const first = (["name", "email", "message"] as const).find(
        (field) => found[field],
      );
      if (first) {
        document
          .querySelector<HTMLElement>(`[name="${first}"]`)
          ?.focus({ preventScroll: false });
      }
      return;
    }

    send(values);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="contact-panel contact-panel-sent" role="status">
        <span className="contact-sent-mark" aria-hidden="true">
          <Icon name="check" size={26} strokeWidth={2.5} />
        </span>
        <h3
          className="text-title mt-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your mail client is open.
        </h3>
        <p className="mt-3 max-w-measure text-ink-muted">
          The message is drafted and addressed — press send there and it is on
          its way. Nothing was submitted from this page.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setTouched({});
            setSent(false);
          }}
          className="btn btn-plain mt-8"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="contact-panel">
      <p className="label">Send a message</p>
      <h3
        className="text-title mt-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Tell me what you are building.
      </h3>

      <div className="mt-9 space-y-6">
        <Field
          label="Your name"
          name="name"
          autoComplete="name"
          required
          value={values.name}
          onChange={set("name")}
          onBlur={blur("name")}
          error={touched.name ? errors.name : undefined}
        />

        <Field
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={set("email")}
          onBlur={blur("email")}
          error={touched.email ? errors.email : undefined}
        />

        <Field
          label="What is on your mind?"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={set("message")}
          onBlur={blur("message")}
          error={touched.message ? errors.message : undefined}
        />
      </div>

      <button type="submit" className="btn btn-accent group mt-8 w-full">
        {contact.cta}
        <Icon
          name="arrow-right"
          size={16}
          className="transition-transform duration-500 ease-spring group-hover:translate-x-1"
        />
      </button>

      <p className="label mt-5 text-ink-faint">
        Opens your mail app with the message ready to send.
      </p>
    </form>
  );
}
