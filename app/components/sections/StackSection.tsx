import Reveal from "@/app/components/motion/Reveal";
import SectionHeading from "@/app/components/ui/SectionHeading";
import Stack from "@/app/components/sections/Stack";
import { stack } from "@/app/lib/content";

/**
 * Server shell around the interactive radar, so the section heading, the
 * count, and the reveal wrapper never enter the client bundle — only the
 * radar itself does.
 */
export default function StackSection() {
  return (
    <Reveal
      as="section"
      id="stack"
      aria-labelledby="stack-heading"
      className="shell py-section"
    >
      <SectionHeading
        n="04"
        id="stack-heading"
        aside={`${stack.length} entries`}
      >
        Tech radar
      </SectionHeading>

      <div className="reveal-item">
        <Stack />
      </div>
    </Reveal>
  );
}
