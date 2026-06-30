import { useParams, Link } from "react-router-dom";
import { pieces } from "@/data/pieces";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const PieceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const piece = pieces.find((p) => p.id === id);

  if (!piece) {
    return (
      <main className="container py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Piece not found</h1>
        <Link to="/" className="text-muted-foreground hover:text-foreground underline">
          Back to gallery
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-8 md:py-14 max-w-4xl">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to gallery
      </Link>

      {piece.images.length === 2 ? (
        /* Two images — side by side */
        <div className="grid grid-cols-2 gap-4 mb-10">
          {piece.images.map((img, i) => (
            <ScrollReveal key={i} direction={i === 0 ? "left" : "right"} delay={i * 100}>
              <div className="rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={i === 0 ? piece.name : `${piece.name} — detail ${i + 1}`}
                  className="w-full h-80 md:h-[420px] object-cover"
                  loading={i === 0 ? undefined : "lazy"}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <>
          {/* Hero image */}
          <ScrollReveal direction="up">
            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={piece.images[0]}
                alt={piece.name}
                className="w-full max-h-[560px] object-cover"
              />
            </div>
          </ScrollReveal>

          {/* Additional images */}
          {piece.images.length > 1 && (
            <div className="grid grid-cols-2 gap-4 mb-10">
              {piece.images.slice(1).map((img, i) => (
                <ScrollReveal key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 100}>
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`${piece.name} — detail ${i + 2}`}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </>
      )}


      {/* Title & meta */}
      <ScrollReveal direction="up">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{piece.name}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BarChart3 size={15} />
            {(piece.purposes ?? [piece.purpose]).join(" · ")}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock size={15} />
            {piece.estimatedTime}
          </div>
          {piece.techniques.map((t) => (
            <Badge key={t} variant="outline" className="text-xs font-normal">
              {t}
            </Badge>
          ))}
        </div>
      </ScrollReveal>

      {/* Story */}
      <ScrollReveal direction="up">
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-foreground mb-4">The Story</h2>
          {piece.story.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </section>
      </ScrollReveal>

      {/* Tutorial intro */}
      <ScrollReveal direction="up">
        <p className="font-serif text-xl md:text-2xl text-foreground mb-10 italic">
          Looking to create your own version of this piece?
        </p>
      </ScrollReveal>

      {/* Materials */}
      <ScrollReveal direction="up">
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-foreground mb-4">Materials Needed</h2>
          <ul className="grid gap-1.5">
            {piece.materials.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-2 h-1 w-1 rounded-full bg-primary shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      {/* Steps */}
      <section className="mb-12">
        <ScrollReveal direction="up">
          <h2 className="font-serif text-2xl text-foreground mb-6">Step-by-Step Instructions</h2>
        </ScrollReveal>
        <ol className="space-y-8">
          {piece.steps.map((step, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 80}>
              <li className="flex gap-4">
                <span className="flex shrink-0 items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  {step.note && (
                    <p className="mt-2 text-sm italic text-secondary border-l-2 border-secondary pl-3">
                      {step.note}
                    </p>
                  )}
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </section>

      {/* Process images */}
      {piece.processImages && piece.processImages.length > 0 && (
        <section className="mb-4">
          <ScrollReveal direction="up">
            <h2 className="font-serif text-2xl text-foreground mb-6">The Process</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {piece.processImages.map((img, i) => (
              <ScrollReveal key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 100}>
                <div className="rounded-lg overflow-hidden bg-muted">
                  <img
                    src={img}
                    alt={`${piece.name} — process ${i + 1}`}
                    className="w-full h-72 md:h-96 object-cover"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default PieceDetail;
