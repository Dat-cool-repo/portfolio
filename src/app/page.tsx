import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Experience />
        <Projects />
        <About />
      </main>
      <Footer />
    </div>
  );
}
