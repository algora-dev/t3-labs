import { Contact, Feedback, Footer, Header, Hero, Intro, MobileActions, ProcessAndAreas, Projects, Services, WhyChoose } from "./components";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Projects />
        <WhyChoose />
        <Feedback />
        <ProcessAndAreas />
        <Contact />
      </main>
      <Footer />
      <MobileActions />
    </>
  );
}
