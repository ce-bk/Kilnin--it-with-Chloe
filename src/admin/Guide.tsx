import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Plus } from "lucide-react";
import { toast } from "sonner";
import type { LeadKind } from "@/lib/supabase";
import { Segmented } from "./ui";

/** The leads process explained, with ideas and messages to copy. Static content. */

const steps: { title: string; body: string; status?: string }[] = [
  { title: "Spot it", status: "To explore", body: "Add anything that might work, even half-ideas: a café you like, a festival poster, a maker you follow. Writing it down is the whole job at this stage." },
  { title: "Go and see", status: "To explore", body: "Visit as a customer first. Is your work at home there? Who runs it? For markets, ask two or three stallholders how they got in and whether it was worth it." },
  { title: "Reach out", status: "Reached out", body: "In person beats a cold message. Go on a quiet weekday morning with one piece in your hand, then send a short message the same day with a link to kilninit.com." },
  { title: "Follow up once", status: "Reached out", body: "No reply after about two weeks is normal, not a no. Send one friendly nudge. If there's still nothing, move it to Not now and try again next season." },
  { title: "Work out the details", status: "Talking", body: "Agree what, how many, the price, who keeps what share, and when you get paid. Write it in a short message you both reply \"yes\" to (checklist below)." },
  { title: "Do it", status: "It's on", body: "For an event, tap Add to my events and the packing, selling and results work as usual. For a collaboration, note in the lead what you left and when." },
  { title: "Look back", body: "Afterwards, write one line in the notes: was it worth it, and would you do it again? That's what makes next year easy." },
];

type Idea = { title: string; body: string; kind: LeadKind; type: string };

const community: Idea[] = [
  { kind: "event", type: "Neighbourhood festival", title: "Your neighbourhood's festa major", body: "Many local festivals have craft stalls run by the neighbourhood committee. Most happen in summer, so ask in spring." },
  { kind: "event", type: "Community market", title: "Centres cívics and ateneus", body: "Community centres host Christmas and spring markets and workshops. Ask at the front desk who organises them." },
  { kind: "event", type: "Pottery studio", title: "Pottery studios", body: "Open-studio days, members' sales and student shows. Ask whether you can share a table, or co-host a workshop." },
  { kind: "event", type: "Pop-up", title: "Cafés, bookshops and coworkings that host pop-ups", body: "Look for \"makers' Sunday\" or Christmas pop-up posters. These are small, friendly and cheap." },
  { kind: "event", type: "Shared stall", title: "Share a stall with another maker", body: "Half the cost and the nerves, and you meet each other's followers. Ask a maker whose work sits nicely next to yours." },
  { kind: "event", type: "Design market", title: "Follow market organisers on Instagram", body: "Open calls and deadlines get posted there first. Add the market as a lead with its deadline as the date." },
];

const collabs: Idea[] = [
  { kind: "collab", type: "Café", title: "Specialty coffee shops", body: "Cups for a few regulars' favourites, or a small shelf of pieces for sale. Your cups and coffee pieces fit naturally." },
  { kind: "collab", type: "Restaurant", title: "Restaurants and wine bars", body: "A small batch of plates or bowls. Price it on your actual hours, not stall price with a discount." },
  { kind: "collab", type: "Lighting / interiors shop", title: "Lighting and interiors shops", body: "Lamps are your most distinctive work. Offer one or two for the window on display or for sale." },
  { kind: "collab", type: "Florist", title: "Florists and plant shops", body: "Vases and planters sold with their flowers or plants. They style your pieces for you." },
  { kind: "collab", type: "Concept store", title: "Concept stores", body: "They sell your pieces and keep a share (often 30–40%). Sales happen without you standing at a stall." },
  { kind: "collab", type: "Other maker", title: "Other makers", body: "A joint workshop, a candle maker filling your holders, a photographer swapping photos for a piece." },
];

type Lang = "es" | "en";
const messages: { title: string; es: string; en: string }[] = [
  {
    title: "To a café or shop",
    es: "¡Hola! Soy Chloe, ceramista aquí en Barcelona (kilninit.com). Me encanta vuestro local y creo que mis piezas encajarían muy bien aquí. ¿Os apetecería que pasara un día con un par de piezas para enseñároslas? ¡Gracias!",
    en: "Hi! I'm Chloe, a ceramicist here in Barcelona (kilninit.com). I love your place and I think my pieces would sit really nicely here. Could I drop by one day with a couple of pieces to show you? Thank you!",
  },
  {
    title: "To a market organiser",
    es: "¡Hola! Soy Chloe y hago cerámica a mano en Barcelona: lámparas, tazas y piezas para casa. Me encantaría participar en vuestro próximo mercado. ¿Cómo funciona la selección y cuándo abrís inscripciones? Mi web: kilninit.com. ¡Gracias!",
    en: "Hi! I'm Chloe and I make handmade ceramics in Barcelona: lamps, cups and pieces for the home. I'd love to take part in your next market. How does selection work, and when do applications open? My site: kilninit.com. Thank you!",
  },
  {
    title: "To a maker, to share a stall",
    es: "¡Hola! Me encanta tu trabajo. Soy ceramista y estoy empezando a hacer mercados. ¿Te apetecería compartir puesto en alguno? Así dividimos el coste y nos hacemos compañía.",
    en: "Hi! I love your work. I'm a ceramicist just starting to do markets. Would you like to share a stall at one? We'd split the cost and keep each other company.",
  },
  {
    title: "Follow-up after two weeks",
    es: "¡Hola de nuevo! Os escribí hace un par de semanas sobre mi cerámica. Sé que estáis a tope; solo quería saber si os había llegado. ¡Un saludo!",
    en: "Hi again! I wrote a couple of weeks ago about my ceramics. I know you're busy, I just wanted to check it reached you. All the best!",
  },
];

const agreement = [
  "Which pieces, how many, and the selling price (who sets it)",
  "Their share, or your batch price for an order",
  "How long they keep the pieces, and when you collect what hasn't sold",
  "Who pays if something breaks or goes missing",
  "When and how you get paid (Bizum, transfer, cash)",
  "For tableware: glazes are food safe, and whether it goes through a dishwasher",
  "Put it in one short message and both reply \"yes\"",
];

const kit = [
  "5–6 strong photos of your pieces, and one of your stall set up",
  "A short bio in Spanish and English (Catalan is a bonus)",
  "Your price range and two or three sentences on what makes your work yours",
  "Your Instagram and kilninit.com",
];

export default function Guide() {
  const [lang, setLang] = useState<Lang>("es");

  return (
    <div className="space-y-10">
      <div>
        <Link to="/admin/leads" className="-ml-2 inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Leads
        </Link>
        <h1 className="text-balance pt-1 font-display text-3xl font-semibold tracking-tight">How this works</h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Right now this is about exploring: finding friendly community events and people to make things with. Nothing here needs to be perfect.
          Aim for <strong className="text-foreground">one new conversation every two weeks</strong>.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold">The steps</h2>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl border bg-card p-4">
              <span className="tabular grid size-8 shrink-0 place-items-center rounded-full bg-[hsl(var(--highlight))] font-display text-lg font-semibold leading-none">{i + 1}</span>
              <div className="min-w-0">
                <p className="font-medium">
                  {s.title}
                  {s.status && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{s.status}</span>}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <IdeaList title="Community events to look for" ideas={community} />
      <IdeaList title="Collaboration ideas" ideas={collabs} />

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Messages to copy</h2>
          <Segmented<Lang> className="w-36" value={lang} onChange={setLang} options={[{ value: "es", label: "ES" }, { value: "en", label: "EN" }]} />
        </div>
        <p className="mb-3 text-sm text-muted-foreground">Make each one a little personal: say what you like about them.</p>
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.title} className="rounded-2xl border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{m.title}</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(m[lang]).then(() => toast.success("Copied"), () => toast.error("Couldn't copy. Press and hold the text instead."))}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium hover:bg-muted"
                >
                  <Copy className="size-4" /> Copy
                </button>
              </div>
              <p className="mt-2 select-text text-sm leading-relaxed text-muted-foreground">{m[lang]}</p>
            </li>
          ))}
        </ul>
      </section>

      <Checklist title="Before you say yes to a collaboration" items={agreement} />
      <Checklist title="Your kit (make it once, reuse it)" items={kit} />

      <section className="rounded-2xl bg-muted p-4 text-sm">
        <p className="font-medium">Paperwork, later</p>
        <p className="mt-1 text-muted-foreground">
          Some official artisan fairs on public streets ask for the Generalitat's Carnet d'Artesà, and selling regularly comes with
          self-employed and tax rules in Spain. You don't need this to explore. Ask a gestor before you start selling regularly.
        </p>
      </section>
    </div>
  );
}

function IdeaList({ title, ideas }: { title: string; ideas: Idea[] }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <ul className="divide-y rounded-2xl border bg-card">
        {ideas.map((i) => (
          <li key={i.title} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{i.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{i.body}</p>
            </div>
            <Link
              to={`/admin/leads?add=1&kind=${i.kind}&type=${encodeURIComponent(i.type)}`}
              className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg border px-3 text-sm font-medium hover:bg-muted"
              aria-label={`Add a lead: ${i.title}`}
            >
              <Plus className="size-4" /> Lead
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <ul className="space-y-2 rounded-2xl border bg-card p-4 text-sm">
        {items.map((t) => (
          <li key={t} className="flex gap-3">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40" />
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
