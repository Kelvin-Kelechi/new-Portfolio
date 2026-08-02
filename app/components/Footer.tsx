import { site } from "@/app/lib/content";
import Icon from "@/app/components/ui/Icon";

/* Year is a constant in content.ts, not new Date() — a static build would
   freeze the render date and quietly go stale, which is worse than a value
   you update deliberately. */
export default function Footer() {
  return (
    <footer className="shell rule-t py-band">
      <div className="flex flex-col gap-3 md:grid md:grid-cols-12 md:items-baseline md:gap-x-gutter">
        <p className="label md:col-span-4">
          © {site.year} {site.name}
        </p>

        <p className="label text-ink-faint md:col-span-4">
          Built with Next.js · No tracking
        </p>

        <a
          href="#top"
          className="label underline-grow group flex items-center gap-2 md:col-span-4 md:justify-self-end"
        >
          Back to top
          <Icon
            name="arrow-up"
            size={13}
            className="transition-transform duration-500 ease-spring group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </footer>
  );
}
