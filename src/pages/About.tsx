import method2 from "@/assets/method-2.jpg";
import ScrollReveal from "@/components/ScrollReveal";

const About = () => (
  <main className="container py-12 md:py-16 max-w-4xl">
    <ScrollReveal direction="up">
      <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-10">About Chloe</h1>
    </ScrollReveal>

    <div className="grid md:grid-cols-2 gap-10 items-start">
      <div className="flex flex-col gap-4">
        <ScrollReveal direction="left">
          <div className="rounded-lg overflow-hidden">
            <img
              src={method2}
              alt="Chloe in her pottery studio"
              className="w-full object-cover"
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="space-y-5 text-muted-foreground leading-relaxed">
        <ScrollReveal direction="right">
          <p>
            I'm Chloe, a UK-born artist now shaping clay in the heart of Barcelona.
            My journey with pottery began in 2020, evolving from a newfound passion
            into a dedicated practice of intentional creation.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={100}>
          <p>
            I am drawn to the rustic—pieces that feel grounded and tactile. My work
            moves through distinct chapters: from a season spent mastering the
            architecture of lamps to deep dives into glaze chemistry and the
            silhouettes of hand-poured jugs.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={200}>
          <p>
            For me, ceramics is about creating with feeling and refining technique
            to turn intuition into form. Every piece is designed to be touched,
            used, and lived with—not kept behind glass.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={300}>
          <section className="pt-2">
            <h2 className="font-serif text-2xl text-foreground mb-4">Artist Statement</h2>
            <blockquote className="border-l-2 border-primary pl-6 text-muted-foreground italic leading-relaxed">
              "I'm drawn to the space between intention and accident—that moment when the
              clay decides to do something you didn't plan, and you have to decide whether
              to fight it or follow it. The best work happens when you follow."
            </blockquote>
          </section>
        </ScrollReveal>
      </div>
    </div>

    <ScrollReveal direction="up" delay={100}>
      <section className="mt-12">
        <h2 className="font-serif text-2xl text-foreground mb-4">Connect</h2>
        <div className="flex gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Instagram
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Pinterest
          </a>
        </div>
      </section>
    </ScrollReveal>
  </main>
);

export default About;
