import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pieces } from "@/data/pieces";
import type { Item } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import mark from "@/assets/kilninit-mark.png";
import type { AdminData } from "./AdminApp";
import { groupByCategory, salesByItem, unitsLeft, useSaveItem } from "./data";
import { Empty, PageHeader, Segmented, Thumb } from "./ui";
import { BrandCards, PaymentSigns } from "./StallCards";

// 4:5 (5.6 × 7 cm), 12 to an A4 sheet.
const CARD_W = 56; // mm
const CARD_H = 70;
const COLS = 3;
const ROWS = 4;
const PER_SHEET = COLS * ROWS;

const INK = "#3a2d22";
const MAUVE = "#a98aab";
const CREAM = "#fbf2e9";

const photoBySitePiece = new Map(pieces.map((p) => [p.id, p.images[0]]));
const photoOf = (i: Item) => i.photo_url ?? (i.site_piece_id ? photoBySitePiece.get(i.site_piece_id) : undefined);

/** "Sap mug (yellow drip) 2" → "Sap mug (yellow drip)": numbers only tell identical pieces apart in the inventory. */
const cardName = (label: string) => label.replace(/\s+\d+$/, "");

type Card = { key: string; name: string; photo?: string };

type Section = "pieces" | "payment" | "brand";

const sections: { value: Section; label: string; sub: string }[] = [
  { value: "pieces", label: "Piece cards", sub: "The little card that goes with each piece. Front: its name. Back: its photo." },
  { value: "payment", label: "Payment", sub: "A table sign so people can pay you: Revolut QR code, Bizum number, and cash." },
  { value: "brand", label: "Brand", sub: "Cards to hand out: tall with a QR code to your Instagram, or square. Both have your clay design on the back." },
];

export default function Cards(data: AdminData) {
  const [section, setSection] = useState<Section>("pieces");
  return (
    <div>
      <PageHeader title="Cards" sub={sections.find((s) => s.value === section)?.sub} />
      <Segmented<Section> className="mb-4" value={section} onChange={setSection} options={sections} />
      {section === "pieces" && <PieceCards {...data} />}
      {section === "payment" && <PaymentSigns />}
      {section === "brand" && <BrandCards />}
    </div>
  );
}

function PieceCards({ items, sales }: AdminData) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [scope, setScope] = useState<"available" | "all">("available");
  const bySale = useMemo(() => salesByItem(sales), [sales]);
  const shown = items.filter((i) => (scope === "all" ? i.status !== "not_for_sale" : i.status === "available"));
  const defaultCopies = (i: Item) => (i.status === "available" ? Math.max(1, unitsLeft(i, bySale)) : 1);

  // Copies per piece; pieces not in the map use their default (one per unit left).
  const [copies, setCopies] = useState<Record<string, number>>({});
  const [names, setNames] = useState<Record<string, string>>({});
  const countOf = (i: Item) => copies[i.id] ?? defaultCopies(i);
  const nameOf = (i: Item) => names[i.id] ?? cardName(i.label);
  const save = useSaveItem();

  /** A name changed here is the piece's name everywhere (Pieces, events, sales), so save it. */
  function saveName(i: Item) {
    const typed = names[i.id]?.trim();
    if (typed === undefined) return;
    if (typed && typed !== cardName(i.label)) {
      const number = i.label.match(/\s+\d+$/)?.[0] ?? ""; // keep "2" in "Sap mug 2" so the two stay apart in the inventory
      save.mutate({ id: i.id, patch: { label: `${typed}${number}` } }, { onSettled: () => setNames(({ [i.id]: _, ...rest }) => rest) });
    } else {
      setNames(({ [i.id]: _, ...rest }) => rest);
    }
  }

  const cards: Card[] = shown.flatMap((i) =>
    Array.from({ length: countOf(i) }, (_, n) => ({ key: `${i.id}-${n}`, name: nameOf(i), photo: photoOf(i) })),
  );
  const sheets = Math.ceil(cards.length / PER_SHEET);
  const noPhoto = shown.filter((i) => countOf(i) > 0 && !photoOf(i)).length;

  function print() {
    // Wait for every photo on the sheets to load, so none print blank.
    const imgs = [...document.querySelectorAll<HTMLImageElement>(".card-print img")];
    Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })))).then(() => window.print());
  }

  const previewItem = shown.find((i) => i.id === previewId);
  const preview = previewItem ? { name: nameOf(previewItem), photo: photoOf(previewItem) } : cards[0];

  return (
    <div>
      <div className="space-y-4">
        <Segmented<"available" | "all"> value={scope} onChange={setScope} options={[{ value: "available", label: "In stock" }, { value: "all", label: "All pieces" }]} />

        <div className="rounded-2xl border bg-card p-4 text-sm">
          <p>
            <strong className="tabular">{cards.length}</strong> {cards.length === 1 ? "card" : "cards"} on <strong className="tabular">{sheets}</strong> A4 {sheets === 1 ? "sheet" : "sheets"}, printed both sides
            {noPhoto > 0 && <span className="text-muted-foreground"> · {noPhoto} without a photo get a plain back with the logo</span>}
          </p>
          <p className="mt-2 text-muted-foreground">
            In the print window choose <strong className="text-foreground">A4</strong>, scale <strong className="text-foreground">100% / Actual size</strong>, and <strong className="text-foreground">two-sided, flip on long edge</strong>. Cut along the marks.
          </p>
          <Button className="mt-3 h-11 w-full rounded-xl sm:w-auto" disabled={cards.length === 0} onClick={print}><Printer /> Print piece cards</Button>
        </div>

        <div className="sticky top-14 z-10 -mx-4 md:top-0 bg-background/95 px-4 pb-2 pt-1 backdrop-blur md:-mx-8 md:px-8">
          <p className="mb-1 text-xs text-muted-foreground">
            Preview{previewItem ? <>: <strong className="text-foreground">{nameOf(previewItem)}</strong></> : " · tap a piece below to see its card"}
          </p>
          <div className="flex gap-4 overflow-x-auto pb-1">
            <div className="shrink-0"><p className="mb-1 text-xs text-muted-foreground">Front</p><CardFront name={preview?.name ?? "Page holder"} /></div>
            <div className="shrink-0"><p className="mb-1 text-xs text-muted-foreground">Back</p><CardBack photo={preview?.photo} /></div>
          </div>
        </div>

        {shown.length === 0 ? <Empty>No pieces here.</Empty> : groupByCategory(shown).map(([category, list]) => (
          <section key={category}>
            <h2 className="mb-2 px-1 text-sm font-semibold">{category}</h2>
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
              {list.map((i) => {
                const n = countOf(i);
                return (
                  <li key={i.id} className={cn("flex items-center gap-3 px-3 py-2.5", n === 0 && "opacity-60", previewId === i.id && "bg-muted")}>
                    <button type="button" aria-label={`Preview the card for ${i.label}`} aria-pressed={previewId === i.id} onClick={() => setPreviewId(i.id)} className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <Thumb item={i} className="size-10" />
                    </button>
                    <input
                      onFocus={() => setPreviewId(i.id)}
                      aria-label={`Name on the card for ${i.label}`}
                      value={nameOf(i)}
                      onChange={(e) => setNames((m) => ({ ...m, [i.id]: e.target.value }))}
                      onBlur={() => saveName(i)}
                      onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                      className="h-10 min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 text-sm hover:border-input focus-visible:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <div className="flex shrink-0 items-center gap-1" role="group" aria-label={`Cards for ${i.label}`}>
                      <Button type="button" variant="outline" size="icon" className="size-9 rounded-lg" aria-label="One fewer" disabled={n === 0} onClick={() => setCopies((m) => ({ ...m, [i.id]: n - 1 }))}><Minus /></Button>
                      <span className="tabular w-6 text-center text-sm font-semibold">{n}</span>
                      <Button type="button" variant="outline" size="icon" className="size-9 rounded-lg" aria-label="One more" onClick={() => setCopies((m) => ({ ...m, [i.id]: n + 1 }))}><Plus /></Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <PrintSheets cards={cards} />
    </div>
  );
}

function CardFront({ name }: { name: string }) {
  return (
    <div style={{ width: `${CARD_W}mm`, height: `${CARD_H}mm`, background: CREAM, color: INK }} className="relative flex flex-col items-center overflow-hidden text-center">
      <img src={mark} alt="" style={{ width: "12mm", marginTop: "14mm" }} />
      <p className="font-display" style={{ fontSize: "8.4mm", lineHeight: 1, marginTop: "5mm" }}>Kilnin' it</p>
      <p className="font-display" style={{ fontSize: "3mm", marginTop: "1.6mm" }}>with Chloe</p>
      <p style={{ fontSize: "2.5mm", position: "absolute", top: "51.5mm", left: "4mm", right: "4mm", textWrap: "balance" }}>{name} | <span style={{ whiteSpace: "nowrap" }}>One of a kind</span></p>
      <p style={{ fontSize: "2.2mm", color: MAUVE, position: "absolute", top: "61mm", left: 0, right: 0 }}>@kilninitwithchloe</p>
    </div>
  );
}

function CardBack({ photo }: { photo?: string }) {
  return (
    <div style={{ width: `${CARD_W}mm`, height: `${CARD_H}mm`, background: CREAM }} className="grid place-items-center overflow-hidden">
      {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : <img src={mark} alt="" style={{ width: "16mm" }} />}
    </div>
  );
}

/** A4 sheets for printing only: fronts, then the backs of the same cards mirrored left-to-right so they line up when printed two-sided. */
function PrintSheets({ cards }: { cards: Card[] }) {
  const [host] = useState(() => document.createElement("div"));
  useEffect(() => {
    host.className = "card-print";
    document.body.appendChild(host);
    return () => host.remove();
  }, [host]);

  const pages: Card[][] = [];
  for (let k = 0; k < cards.length; k += PER_SHEET) pages.push(cards.slice(k, k + PER_SHEET));
  const pos = (slot: number, mirror: boolean) => {
    const row = Math.floor(slot / COLS);
    const col = mirror ? COLS - 1 - (slot % COLS) : slot % COLS;
    return { left: `${col * CARD_W}mm`, top: `${row * CARD_H}mm` };
  };

  return createPortal(
    <>
      <style>{`
        @media screen { .card-print { display: none; } }
        @media print {
          @page { size: A4; margin: 0; }
          html, body { background: #fff !important; }
          body > *:not(.card-print) { display: none !important; }
          .card-print { display: block; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .card-sheet { position: relative; width: 210mm; height: 297mm; break-after: page; overflow: hidden; }
          .card-grid { position: absolute; left: ${(210 - COLS * CARD_W) / 2}mm; top: ${(297 - ROWS * CARD_H) / 2}mm; width: ${COLS * CARD_W}mm; height: ${ROWS * CARD_H}mm; }
          .card-slot { position: absolute; }
          .crop { position: absolute; background: #999; }
        }
      `}</style>
      {pages.map((page, p) => (
        [false, true].map((back) => (
          <div key={`${p}-${back}`} className="card-sheet">
            <div className="card-grid">
              {page.map((c, slot) => (
                <div key={c.key} className="card-slot" style={pos(slot, back)}>
                  {back ? <CardBack photo={c.photo} /> : <CardFront name={c.name} />}
                </div>
              ))}
              <CropMarks />
            </div>
          </div>
        ))
      ))}
    </>,
    host,
  );
}

/** Short cut marks outside the grid at every card edge. */
function CropMarks() {
  const len = 5; // mm
  const gap = 1.5;
  const marks: React.CSSProperties[] = [];
  for (let c = 0; c <= COLS; c++) {
    const x = `calc(${c * CARD_W}mm - 0.1mm)`;
    marks.push({ left: x, top: `-${len + gap}mm`, width: "0.2mm", height: `${len}mm` });
    marks.push({ left: x, top: `${ROWS * CARD_H + gap}mm`, width: "0.2mm", height: `${len}mm` });
  }
  for (let r = 0; r <= ROWS; r++) {
    const y = `calc(${r * CARD_H}mm - 0.1mm)`;
    marks.push({ top: y, left: `-${len + gap}mm`, height: "0.2mm", width: `${len}mm` });
    marks.push({ top: y, left: `${COLS * CARD_W + gap}mm`, height: "0.2mm", width: `${len}mm` });
  }
  return <>{marks.map((s, k) => <span key={k} className="crop" style={s} />)}</>;
}
