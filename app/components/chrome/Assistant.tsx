"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/app/lib/content";
import Icon from "@/app/components/ui/Icon";
import { RiRobot2Line } from "react-icons/ri";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What kind of work is he best at?",
  "Has he worked on anything with payments?",
  "How does he approach performance?",
  "Is he available right now?",
];

/**
 * Chat panel for the grounded assistant.
 *
 * Streams the response token by token so the first words appear in a few
 * hundred milliseconds rather than after the full generation — on a panel
 * this small, that is the difference between "instant" and "broken".
 *
 * Every failure state is explicit. An unconfigured key, a rate limit, and a
 * network drop each say what happened and point at the contact section; none
 * of them leave a spinner running.
 */
export default function Assistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    field.current?.focus();
    return () => abort.current?.abort();
  }, []);

  /* Pin to the bottom as tokens arrive. */
  useEffect(() => {
    const element = scroller.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages, pending]);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || pending) return;

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setPending(true);

    const controller = new AbortController();
    abort.current = controller;

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const detail = await response
          .json()
          .then((data) => data?.error as string | undefined)
          .catch(() => undefined);
        setError(detail ?? "The assistant is unavailable right now.");
        setPending(false);
        return;
      }

      /* Open the assistant turn before reading, so the reply renders
         incrementally instead of appearing whole at the end. */
      setMessages((current) => [...current, { role: "assistant", content: "" }]);
      setPending(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) => {
          const copy = [...current];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch (caught) {
      if ((caught as Error)?.name === "AbortError") return;
      setError("Connection lost. The contact section has a direct line.");
      setPending(false);
      /* Drop a turn that never received any text, or the caret pulses under
         the error message forever. A partial answer is kept — it is still
         worth reading. */
      setMessages((current) =>
        current.length &&
        current[current.length - 1].role === "assistant" &&
        !current[current.length - 1].content
          ? current.slice(0, -1)
          : current,
      );
    } finally {
      abort.current = null;
    }
  }

  const empty = messages.length === 0;

  return (
    <div
      className="overlay-backdrop fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-heading"
        className="overlay-panel glass flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl sm:h-[70vh] sm:rounded-2xl"
      >
        <div className="rule-b flex items-center justify-between gap-4 px-5 py-4">
          {/* The same live mark the header button carries. Tapping a glowing
              green robot and landing on a coral spark reads as two different
              features; repeating the mark is what makes the overlay feel like
              the thing you just opened. */}
          <h2 id="assistant-heading" className="label flex items-center gap-2.5">
            <span className="ai-mark size-4 shrink-0">
              <RiRobot2Line size={16} aria-hidden="true" className="size-full" />
            </span>
            Ask about {site.firstName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors duration-300 hover:text-accent"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {empty && (
            <div className="flex h-full flex-col justify-center">
              <p
                className="text-title max-w-measure-sm"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ask anything about the work, the stack, or how {site.firstName}{" "}
                builds.
              </p>
              <p className="mt-3 text-[0.8125rem] text-ink-faint">
                Answers come only from what&rsquo;s published on this site. If
                something isn&rsquo;t here, it&rsquo;ll say so rather than
                guess.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => send(suggestion)}
                      className="surface rounded-full px-3.5 py-2 text-left text-[0.8125rem] text-ink-muted transition-colors duration-300 hover:text-accent"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ul className="space-y-5">
            {messages.map((message, index) => (
              <li
                key={index}
                className={
                  message.role === "user" ? "flex justify-end" : "flex"
                }
              >
                {message.role === "user" ? (
                  <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent-soft px-4 py-2.5 text-ink">
                    {message.content}
                  </p>
                ) : (
                  <div className="max-w-[92%] space-y-3 text-ink-muted">
                    {message.content
                      .split("\n")
                      .filter(Boolean)
                      .map((paragraph, line) => (
                        <p key={line}>{paragraph}</p>
                      ))}
                    {/* A caret while the last turn is still streaming. */}
                    {index === messages.length - 1 && !message.content && (
                      <span className="inline-block h-4 w-2 animate-pulse bg-accent align-middle" />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {pending && (
            <div className="mt-5 flex items-center gap-2" aria-live="polite">
              <span className="skeleton h-3 w-3 rounded-full" />
              <span className="label">Thinking</span>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-rule bg-paper-sunk px-4 py-3 text-[0.8125rem] text-ink-muted"
            >
              {error}{" "}
              <a href="#contact" onClick={onClose} className="underline-grow text-ink">
                Go to contact
              </a>
            </p>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
          className="rule-t flex items-end gap-3 px-5 py-4"
        >
          <textarea
            ref={field}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              /* Enter sends, Shift+Enter breaks the line — the convention
                 every chat interface has trained people to expect. */
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={1000}
            placeholder="Ask a question…"
            aria-label="Ask a question"
            className="max-h-32 min-h-[2.5rem] w-full resize-none bg-transparent py-2 outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            disabled={!input.trim() || pending}
            aria-label="Send"
            className="surface group flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 enabled:hover:text-accent disabled:opacity-40"
          >
            <Icon
              name="send"
              size={16}
              className="transition-transform duration-500 ease-spring group-enabled:group-hover:-translate-y-px group-enabled:group-hover:translate-x-px"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
