import Hero from "@/app/components/sections/Hero";
import Ticker from "@/app/components/sections/Ticker";
import Ethos from "@/app/components/sections/Ethos";
import Work from "@/app/components/sections/Work";
import Method from "@/app/components/sections/Method";
import StackSection from "@/app/components/sections/StackSection";
import Trajectory from "@/app/components/sections/Trajectory";
import Proof from "@/app/components/sections/Proof";
import Contact from "@/app/components/sections/Contact";
import Footer from "@/app/components/Footer";

/**
 * The narrative, in order:
 *
 *   who I am  →  what I'm doing now  →  how I think  →  what I've built
 *             →  how I build it      →  what I use   →  where I've been
 *             →  who vouches for it  →  how to reach me
 *
 * Each section answers the question the previous one raises, which is what
 * separates a story from a stack of blocks. Nothing here is a "Skills"
 * section or an "About Me" card.
 *
 * Header, command palette, cursor, and overlays live in <Chrome>, mounted
 * once in the root layout so they persist across the case-study routes.
 */
export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Ticker />
        <Ethos />
        <Work />
        <Method />
        <StackSection />
        <Trajectory />
        <Proof />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
