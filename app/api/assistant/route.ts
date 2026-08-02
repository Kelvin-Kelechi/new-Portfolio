import Anthropic from "@anthropic-ai/sdk";
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
 * Requires ANTHROPIC_API_KEY. Without it the endpoint reports 503 and the UI
 * degrades to a message pointing at the contact section — it never pretends
 * to be configured.
 */
export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "The assistant is not configured. Set ANTHROPIC_API_KEY to enable it.",
      },
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

  const client = new Anthropic({ apiKey });

  try {
    const stream = client.beta.messages.stream({
      model: "claude-opus-5",
      max_tokens: 1400,
      /* Low effort: this is grounded retrieval and paraphrase, not reasoning.
         Thinking stays on (the Opus 5 default) because disabling it can leak
         internal tags into a user-visible answer. */
      output_config: { effort: "low" },
      /* Server-side refusal fallback. A portfolio Q&A will effectively never
         trip a safety classifier, but a declined request would otherwise
         surface as an empty reply with no explanation. */
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          /* The grounding block is identical on every request, so caching it
             makes each follow-up question cost a fraction of the first. */
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          /* Check stop_reason before finishing. A refusal that survived the
             fallback chain arrives as a successful response with empty
             content — silently closing the stream would look like a bug. */
          const final = await stream.finalMessage();
          if (final.stop_reason === "refusal") {
            controller.enqueue(
              encoder.encode(
                "I can't answer that one. Try asking about the projects, the stack, or how I work.",
              ),
            );
          }
        } catch (error) {
          console.error("[assistant] stream failed:", error);
          controller.enqueue(
            encoder.encode(
              "\n\nSomething broke on my end. The contact section has a direct line.",
            ),
          );
        } finally {
          controller.close();
        }
      },
      cancel() {
        /* The visitor closed the panel or navigated away — stop generating
           rather than paying for tokens nobody will read. */
        stream.abort();
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
    if (error instanceof Anthropic.RateLimitError) {
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

/** Validates and trims the client payload. Never trust it — it is public. */
function normalise(
  body: unknown,
): { role: "user" | "assistant"; content: string }[] | null {
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
      role: entry.role as "user" | "assistant",
      content: entry.content.slice(0, MAX_QUESTION),
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
- When a project is relevant, name it so the visitor can go read the case study.

## Reference material

${buildGrounding()}`;
