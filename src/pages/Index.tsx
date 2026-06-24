import { useState, useMemo } from "react";
import { pieces, type Technique, type Purpose } from "@/data/pieces";
import GalleryCard from "@/components/GalleryCard";
import FilterBar from "@/components/FilterBar";
import ScrollReveal from "@/components/ScrollReveal";
import unusualJugsHero from "@/assets/piece-unusual-jugs-1.png";

const Index = () => {
  const [technique, setTechnique] = useState<Technique | null>(null);
  const [purpose, setPurpose] = useState<Purpose | null>(null);

  const filtered = useMemo(() => {
    const priority = ["elevated-delights", "fondue-party", "geometric"];
    const ordered = [...pieces].sort((a, b) => {
      const ai = priority.indexOf(a.id);
      const bi = priority.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return ordered.filter((p) => {
      if (technique && !p.techniques.includes(technique)) return false;
      if (purpose && p.purpose !== purpose && !(p.purposes?.includes(purpose))) return false;
      return true;
    });
  }, [technique, purpose]);

  return (
    <main>
      {/* Hero section with video background */}
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={unusualJugsHero}
          alt="Unusual jugs"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-foreground/50" />
        {/* Hero text */}
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <ScrollReveal direction="up">
            <h1 className="font-serif text-4xl md:text-6xl text-background mb-4">
              The Collection
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-background/80 text-lg md:text-xl leading-relaxed">
              Each piece carries a story. Scroll to explore the narratives shaped by fire, earth, and intention.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery */}
      <div className="container py-12 md:py-16">
        <ScrollReveal direction="up">
          <FilterBar
            selectedTechnique={technique}
            selectedPurpose={purpose}
            onTechniqueChange={setTechnique}
            onPurposeChange={setPurpose}
          />
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
          {filtered.map((piece, i) => (
            <ScrollReveal key={piece.id} direction="up" delay={i * 100}>
              <GalleryCard piece={piece} index={i} />
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">
            No pieces match your filters. Try adjusting your selection.
          </p>
        )}
      </div>
    </main>
  );
};

export default Index;
