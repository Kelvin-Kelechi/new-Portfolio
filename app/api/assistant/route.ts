import {
  GoogleGenAI,
  ApiError,
  FinishReason,
  ThinkingLevel,
} from "@google/genai";
import { buildGrounding } from "@/app/lib/grounding";

export const runtime = "nodejs";
/* The grounding is built from static content, but the handler itself must not
   be prerendered — it streams per request. */
export const dynamic = "force-dynamic";

const MAX_QUESTION = 1000;
const MAX_TURNS = 12;

/**
 * The portfolio assistant.
 *
 * Grounded strictly in app/lib/content.ts — the same file every component
 * reads — so the assistant cannot describe a project that is not on the site
 * or invent a metric that is not in the data. That constraint is the entire
 * design: an assistant that embellishes a CV is worse than no assistant.
 *
 * Runs on Gemini's free tier rather than a paid API. At this site's traffic the
 * whole feature costs single-digit dollars a year on any paid provider, which
 * is not a saving worth having if the alternative is the button being switched
 * off — and a portfolio assistant that is *live* beats a better one that isn't.
 *
 * Requires GEMINI_API_KEY. Without it the endpoint reports 503 AND the Ask
 * button is never rendered (see `assistantEnabled` in layout.tsx), so a visitor
 * is never offered a feature that cannot answer.
 */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    /* Visitor-facing copy, deliberately. Every string that leaves this route
       is read by a recruiter, not by me — naming the environment variable here
       published an internal detail and made a missing config read as a broken
       feature. The UI hides the Ask button entirely when the key is absent, so
       this is the last line of defence for a request that reaches the endpoint
       anyway. */
    return Response.json(
      { error: "The assistant is resting right now." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request body." }, { status: 400 });
  }

  const messages = normalise(body);
  if (!messages) {
    return Response.json(
      { error: "Expected a non-empty list of messages." },
      { status: 400 },
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const stream = await ai.models.generateContentStream({
      /*
       * Flash, not Pro. This is grounded retrieval and paraphrase over a fixed
       * 5k-token reference block — the task is bounded by reading accurately,
       * not by reasoning, and Flash carries the free tier's real quota.
       *
       * Pinned to a version rather than the `gemini-flash-latest` alias. The
       * alias never 404s when a version retires, which is tempting given that
       * is exactly how this route broke once — but it also lets the model
       * change under a prompt whose whole job is refusing to embellish, with no
       * deploy to notice it. A pin that fails loudly beats a silent swap; the
       * cost is remembering to bump it, which the model list will force anyway.
       *
       * Bumped off gemini-3.7-flash: verified directly against the live API
       * (REST and this SDK call, both) that it was returning a consistent 503
       * UNAVAILABLE, and the SDK's own retry against that 503 hangs rather than
       * surfacing an error — from the panel that read as the assistant doing
       * nothing forever, not as a failure. gemini-3.6-flash, checked against
       * the same key with the same request shape, answers in well under a
       * second.
       */
      model: "gemini-3.6-flash",
      contents: messages,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 1400,
        /* Thinking as low as this model allows. There is nothing here to reason
           about — the answer is either in the reference block or the model
           should say it isn't — and thinking tokens come out of the same
           free-tier budget while delaying the first word.

           `thinkingLevel`, not `thinkingBudget`: the budget knob is the 2.5-era
           API and is rejected outright by some current models. MINIMAL is the
           floor gemini-3.6-flash accepts — verified against the live API
           rather than assumed. */
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        /* Low, not zero. Zero makes repeated questions produce near-identical
           sentences, which reads as a canned FAQ rather than an answer; this is
           enough variation to sound written without loosening the grounding. */
        temperature: 0.3,
        /* Stops generating when the visitor closes the panel — see `cancel`. */
        abortSignal: request.signal,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          let sawText = false;

          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              sawText = true;
              controller.enqueue(encoder.encode(text));
            }

            /* A safety stop arrives as a successful stream that simply ends —
               no error, no text. Silently closing would look like a bug, so the
               reason is checked and answered in the assistant's own voice.
               Vanishingly unlikely on portfolio Q&A, which is exactly why it
               would be baffling if it ever happened unannounced. */
            const reason = chunk.candidates?.[0]?.finishReason;
            if (
              reason &&
              reason !== FinishReason.STOP &&
              reason !== FinishReason.MAX_TOKENS &&
              !sawText
            ) {
              controller.enqueue(
                encoder.encode(
                  "I can't answer that one. Try asking about the projects, the stack, or how I work.",
                ),
              );
            }
          }
        } catch (error) {
          /* An abort is the visitor closing the panel, not a failure — saying
             "something broke" over their own deliberate action is a lie, and
             the stream is already going nowhere. */
          if (!isAbort(error)) {
            console.error("[assistant] stream failed:", error);
            controller.enqueue(
              encoder.encode(
                "\n\nSomething broke on my end. The contact section has a direct line.",
              ),
            );
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[assistant] request failed:", error);
    /* The free tier is metered per minute and per day, so this is a state the
       site can genuinely reach on a good day rather than a theoretical branch —
       it says so plainly instead of reporting a fault. */
    if (error instanceof ApiError && error.status === 429) {
      return Response.json(
        { error: "Too many questions at once. Try again in a moment." },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "The assistant is unavailable right now." },
      { status: 502 },
    );
  }
}

/** True for the AbortError raised when the visitor closes the panel. */
function isAbort(error: unknown): boolean {
  return (
    (error as Error)?.name === "AbortError" ||
    (error as Error)?.name === "ResponseAborted"
  );
}

/**
 * Validates and trims the client payload. Never trust it — it is public.
 *
 * Also maps to Gemini's wire format, which differs from the client's in two
 * ways: the assistant role is called `model`, and content is a list of parts
 * rather than a bare string.
 */
function normalise(
  body: unknown,
): { role: "user" | "model"; parts: { text: string }[] }[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages = raw
    .filter(
      (entry): entry is { role: string; content: string } =>
        typeof entry === "object" &&
        entry !== null &&
        (entry as { role?: unknown }).role !== undefined &&
        typeof (entry as { content?: unknown }).content === "string",
    )
    .filter((entry) => entry.role === "user" || entry.role === "assistant")
    .slice(-MAX_TURNS)
    .map((entry) => ({
      role: (entry.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: entry.content.slice(0, MAX_QUESTION) }],
    }));

  /* The API requires the first message to be from the user. */
  while (messages.length && messages[0].role !== "user") messages.shift();
  return messages.length ? messages : null;
}

const SYSTEM_PROMPT = `You are the portfolio assistant for ${"Anyigor Kelvin"}'s personal site. Visitors are usually recruiters, hiring managers, founders, or potential clients evaluating whether to get in touch.

Answer questions about his experience, projects, technical approach, and availability using ONLY the reference material below.

## Hard rules

- Every factual claim must come from the reference material. Never invent a project, employer, client name, date, technology, metric, testimonial, award, or certification.
- If the material does not contain the answer, say so plainly and point to the contact section. "That isn't on the site — the contact section has a direct line" is a good answer. A guess is not.
- Where the material shows a placeholder (an empty list, or text like "Add your username"), treat that as "not published yet". Do not fill the gap.
- Never state or imply a performance number, percentage, revenue figure, or team size that is not written below.

## Voice

- Direct and concrete. Short paragraphs, no bullet-point walls, no headers for a two-sentence answer.
- Speak about him in the third person. You are the site, not the person.
- Two to four sentences for most questions. Expand only when genuinely asked for depth.
- No sales language, no exclamation marks, no "Great question!". Do not open with a preamble — answer first.
- Plain prose only — no markdown, no asterisks for emphasis, no bullet characters. The panel renders paragraphs, so anything else shows up as literal punctuation.
- When a project is relevant, name it so the visitor can go read the case study.

## Reference material

${buildGrounding()}`;
