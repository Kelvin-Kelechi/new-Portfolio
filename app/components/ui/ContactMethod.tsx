import SocialIcon from "@/app/components/ui/SocialIcon";
import Icon from "@/app/components/ui/Icon";
import type { Social } from "@/app/lib/content";

/**
 * One channel, as a card.
 *
 * A whole-card anchor rather than a card containing a link: the target is then
 * the full 72px-tall block instead of a line of text, which matters most on
 * the device where this is hardest to hit. It stays a single tab stop and its
 * accessible name is still just the label and handle.
 *
 * Server component — the entire hover choreography is CSS.
 */
export default function ContactMethod({
  social,
  tone,
}: {
  social: Social;
  /** The card's own accent, used by the icon tile and the hover glow. */
  tone: string;
}) {
  /* mailto: must not open in a new tab — the browser hands off to the mail
     client and the blank tab it leaves behind never closes. */
  const external = !social.href?.startsWith("mailto:");

  return (
    <a
      href={social.href ?? undefined}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="method-card group"
      style={{ "--tone": tone } as React.CSSProperties}
    >
      <span aria-hidden="true" className="method-glow" />

      <span className="method-tile" aria-hidden="true">
        <SocialIcon kind={social.kind} size={19} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="label block text-ink-faint">{social.label}</span>
        <span className="mt-1 block truncate font-medium text-ink">
          {social.handle}
        </span>
      </span>

      <Icon
        name="arrow-up-right"
        size={16}
        className="method-arrow shrink-0 text-ink-faint"
      />
    </a>
  );
}
