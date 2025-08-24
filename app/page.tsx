import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Resume from "./components/Resume";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Hero />
      <Skills />
      <Resume />
      <Portfolio />
      <Services />
      <Contact />
    </div>
  );
}
