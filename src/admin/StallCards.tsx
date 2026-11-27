import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ImagePlus, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import mark from "@/assets/kilninit-mark.png";
import brandFront from "@/assets/brand-card-front.png";
import brandBack from "@/assets/brand-card-back.jpg";

// Brand colours, as on the piece cards.
const INK = "#3a2d22";
const MAUVE = "#a98aab";
const CREAM = "#fbf2e9";

/**
 * A value remembered in this browser only. Personal details (phone number, payment link)
 * are kept here rather than in the code, because the code is public.
 */
function useRemembered(key: string, initial: string) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(`kilninit:${key}`) ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(`kilninit:${key}`, value);
    } catch {
      /* private window: just not remembered */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

const withoutProtocol = (url: string) => url.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
const asUrl = (s: string) => (/^https?:\/\//.test(s.trim()) ? s.trim() : `https://${s.trim()}`);
/** "600000000" → "600 000 000" */
const spacedPhone = (p: string) => {
  const d = p.replace(/\s+/g, "");
  return /^\d{9}$/.test(d) ? d.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : p.trim();
};

function Field({ id, label, value, onChange, placeholder, hint, inputMode }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string;
  inputMode?: "text" | "tel" | "url";
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} className="h-12" />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Stepper({ label, value, onChange, min, max, unit }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; unit: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-card px-3 py-2 text-sm">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <Button type="button" variant="outline" size="icon" className="size-9 rounded-lg" aria-label="Fewer" disabled={value <= min} onClick={() => onChange(value - 1)}>−</Button>
        <span className="tabular w-16 text-center font-semibold">{value} {unit}</span>
        <Button type="button" variant="outline" size="icon" className="size-9 rounded-lg" aria-label="More" disabled={value >= max} onClick={() => onChange(value + 1)}>+</Button>
      </div>
    </div>
  );
}

function PrintHelp({ children, action }: { children: ReactNode; action: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
      <p>{children}</p>
      <div className="mt-3">{action}</div>
    </div>
  );
}

/** Read a picked image as a small PNG (max 600px), so it fits in the browser's memory for this site. */
async function imageToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

// ---------------------------------------------------------------- Payment sign (A6, 4 per A4)

const SIGN_W = 105; // mm
const SIGN_H = 148;

export function PaymentSigns() {
  const [revolut, setRevolut] = useRemembered("revolut", "");
  const [bizum, setBizum] = useRemembered("bizum", "");
  const [qrImage, setQrImage] = useRemembered("revolut-qr", "");
  const [count, setCount] = useState(1);
  const [imageError, setImageError] = useState("");
  const ready = revolut.trim() !== "" || bizum.trim() !== "" || qrImage !== "";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="pay-revolut" label="Revolut link" value={revolut} onChange={setRevolut} placeholder="revolut.me/yourname" inputMode="url" hint="Printed under the QR code." />
        <Field id="pay-bizum" label="Bizum number" value={bizum} onChange={setBizum} placeholder="600 000 000" inputMode="tel" hint="Leave empty to leave Bizum off." />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-input bg-card px-4 text-sm font-medium hover:bg-muted">
          <ImagePlus className="size-4" /> {qrImage ? "Change QR code image" : "Use my own QR code image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              try {
                setQrImage(await imageToDataUrl(f));
                setImageError("");
              } catch {
                setImageError("Couldn't read that image. Try a screenshot saved as PNG or JPG.");
              }
            }}
          />
        </label>
        {qrImage && <button type="button" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground" onClick={() => setQrImage("")}>Remove image</button>}
      </div>
      {imageError && <p className="text-sm text-destructive">{imageError}</p>}
      <p className="text-xs text-muted-foreground">
        {qrImage ? "The sign uses your QR code image. " : "Without an image, a QR code is made from your Revolut link. "}
        Everything here is remembered on this device only, never uploaded or saved in the website's code.
      </p>

      <div className="overflow-x-auto pb-1">
        <PaymentSign revolut={revolut} bizum={bizum} qrImage={qrImage} />
      </div>

      <Stepper label="How many signs" value={count} onChange={setCount} min={1} max={8} unit={count === 1 ? "sign" : "signs"} />
      <PrintHelp action={<Button className="h-11 w-full rounded-xl sm:w-auto" disabled={!ready} onClick={() => window.print()}><Printer /> Print payment {count === 1 ? "sign" : "signs"}</Button>}>
        Postcard size (A6), 4 to an A4 sheet. In the print window choose <strong className="text-foreground">A4</strong> and scale <strong className="text-foreground">100% / Actual size</strong>, then cut along the faint lines. Thicker paper or card works best for a sign that stands up.
      </PrintHelp>

      <PrintPortal>
        {chunk(Array.from({ length: count }), 4).map((page, p) => (
          <div key={p} className="card-sheet">
            {page.map((_, k) => (
              <div key={k} style={{ position: "absolute", left: `${(k % 2) * SIGN_W}mm`, top: `${Math.floor(k / 2) * SIGN_H}mm` }}>
                <PaymentSign revolut={revolut} bizum={bizum} qrImage={qrImage} />
              </div>
            ))}
            {/* cut guides through the middle of the page */}
            <span style={{ position: "absolute", left: `${SIGN_W}mm`, top: 0, width: "0.2mm", height: `${2 * SIGN_H}mm`, background: "#ddd" }} />
            <span style={{ position: "absolute", top: `${SIGN_H}mm`, left: 0, height: "0.2mm", width: `${2 * SIGN_W}mm`, background: "#ddd" }} />
          </div>
        ))}
      </PrintPortal>
    </div>
  );
}

function PaymentSign({ revolut, bizum, qrImage }: { revolut: string; bizum: string; qrImage: string }) {
  const hasRevolut = revolut.trim() !== "" || qrImage !== "";
  const hasBizum = bizum.trim() !== "";
  const mm = (n: number) => `${n}mm`;
  return (
    <div style={{ width: mm(SIGN_W), height: mm(SIGN_H), background: CREAM, color: INK }} className="relative flex shrink-0 flex-col items-center overflow-hidden text-center">
      <img src={mark} alt="" style={{ width: mm(11), marginTop: mm(10) }} />
      <p className="font-display" style={{ fontSize: mm(6.5), lineHeight: 1, marginTop: mm(3) }}>Kilnin' it</p>
      <p className="font-display" style={{ fontSize: mm(2.6), marginTop: mm(1.2) }}>with Chloe</p>

      <p className="font-display" style={{ fontSize: mm(7), lineHeight: 1, marginTop: mm(7) }}>Scan to pay</p>
      {hasRevolut ? (
        <>
          {qrImage ? (
            <img src={qrImage} alt="" style={{ marginTop: mm(4), width: mm(51), height: mm(51), objectFit: "contain", borderRadius: mm(3) }} />
          ) : (
            <div style={{ marginTop: mm(4), padding: mm(2.5), background: "#fff", borderRadius: mm(3) }}>
              <QRCodeSVG value={asUrl(revolut)} size={200} fgColor={INK} bgColor="#ffffff" level="M" style={{ width: mm(46), height: mm(46), display: "block" }} />
            </div>
          )}
          <p style={{ fontSize: mm(3), marginTop: mm(2.5) }}>
            <strong>Revolut</strong>{revolut.trim() && <> · {withoutProtocol(revolut)}</>}
          </p>
        </>
      ) : (
        <p style={{ fontSize: mm(3), marginTop: mm(6), color: MAUVE }}>Add your Revolut link to show the QR code</p>
      )}

      <div style={{ position: "absolute", left: mm(12), right: mm(12), bottom: mm(12) }}>
        {hasBizum && (
          <>
            <div style={{ height: "0.25mm", background: MAUVE, opacity: 0.5, marginBottom: mm(4) }} />
            <p style={{ fontSize: mm(3), letterSpacing: "0.08em", textTransform: "uppercase" }}>Bizum</p>
            <p className="font-display" style={{ fontSize: mm(6.5), lineHeight: 1.1, marginTop: mm(1) }}>{spacedPhone(bizum)}</p>
          </>
        )}
        <p style={{ fontSize: mm(2.8), color: MAUVE, marginTop: mm(3.5) }}>Cash is welcome also</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Brand cards (two-sided)

const CARD_W = 50.8; // mm, business card, 9 per A4
const CARD_H = 88.9;
const SQ = 55; // mm, square card, 15 per A4

type BrandStyle = "qr" | "square";

const styles: Record<BrandStyle, { label: string; w: number; h: number; cols: number; rows: number }> = {
  qr: { label: "With Instagram QR code", w: CARD_W, h: CARD_H, cols: 3, rows: 3 },
  square: { label: "Square", w: SQ, h: SQ, cols: 3, rows: 5 },
};

export function BrandCards() {
  const [instagram, setInstagram] = useRemembered("instagram", "kilninitwithchloe");
  const [website, setWebsite] = useRemembered("website", "kilninit.com");
  const [style, setStyle] = useRemembered("brand-style", "qr");
  const [sheets, setSheets] = useState(1);
  const handle = instagram.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
  const st = styles[(style as BrandStyle) in styles ? (style as BrandStyle) : "qr"];
  const isQr = st === styles.qr;
  const perSheet = st.cols * st.rows;
  const front = isQr ? <BrandCard handle={handle} website={withoutProtocol(website)} /> : <SquareFront website={withoutProtocol(website)} />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Card style">
        {(Object.keys(styles) as BrandStyle[]).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={st === styles[k]}
            onClick={() => setStyle(k)}
            className={`min-h-12 rounded-xl border px-3 text-sm font-medium ${st === styles[k] ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:bg-muted"}`}
          >
            {styles[k].label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {isQr && <Field id="brand-ig" label="Instagram" value={instagram} onChange={setInstagram} placeholder="kilninitwithchloe" hint="The QR code opens your Instagram." />}
        <Field id="brand-web" label="Website" value={website} onChange={setWebsite} placeholder="kilninit.com" inputMode="url" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        <div className="shrink-0"><p className="mb-1 text-xs text-muted-foreground">Front</p>{front}</div>
        <div className="shrink-0"><p className="mb-1 text-xs text-muted-foreground">Back</p><BrandBack w={st.w} h={st.h} /></div>
      </div>

      <Stepper label="How many sheets" value={sheets} onChange={setSheets} min={1} max={5} unit={`× ${perSheet}`} />
      <PrintHelp action={<Button className="h-11 w-full rounded-xl sm:w-auto" disabled={isQr && !handle} onClick={() => window.print()}><Printer /> Print {sheets * perSheet} cards</Button>}>
        {isQr ? "Business-card size" : `Square, ${SQ / 10} × ${SQ / 10} cm`}: {perSheet} to an A4 sheet, printed both sides. In the print window choose <strong className="text-foreground">A4</strong>, scale <strong className="text-foreground">100% / Actual size</strong>, and <strong className="text-foreground">two-sided, flip on long edge</strong>. Cut along the marks.
      </PrintHelp>

      <PrintPortal>
        {Array.from({ length: sheets }, (_, p) =>
          [false, true].map((back) => (
            <div key={`${p}-${back}`} className="card-sheet">
              <div style={{ position: "absolute", left: `${(210 - st.cols * st.w) / 2}mm`, top: `${(297 - st.rows * st.h) / 2}mm`, width: `${st.cols * st.w}mm`, height: `${st.rows * st.h}mm` }}>
                {Array.from({ length: perSheet }, (_, k) => {
                  // Backs are mirrored left-to-right so they line up with their fronts when printed two-sided.
                  const col = back ? st.cols - 1 - (k % st.cols) : k % st.cols;
                  return (
                    <div key={k} style={{ position: "absolute", left: `${col * st.w}mm`, top: `${Math.floor(k / st.cols) * st.h}mm` }}>
                      {back ? <BrandBack w={st.w} h={st.h} /> : front}
                    </div>
                  );
                })}
                <CropMarks cols={st.cols} rows={st.rows} w={st.w} h={st.h} />
              </div>
            </div>
          )),
        )}
      </PrintPortal>
    </div>
  );
}

function BrandCard({ handle, website }: { handle: string; website: string }) {
  const mm = (n: number) => `${n}mm`;
  return (
    <div style={{ width: mm(CARD_W), height: mm(CARD_H), background: CREAM, color: INK }} className="relative flex shrink-0 flex-col items-center overflow-hidden text-center">
      <img src={mark} alt="" style={{ width: mm(10), marginTop: mm(9) }} />
      <p className="font-display" style={{ fontSize: mm(6.6), lineHeight: 1, marginTop: mm(3.5) }}>Kilnin' it</p>
      <p className="font-display" style={{ fontSize: mm(2.5), marginTop: mm(1.2) }}>with Chloe</p>
      {handle && (
        <div style={{ marginTop: mm(6), padding: mm(1.5), background: "#fff", borderRadius: mm(2) }}>
          <QRCodeSVG value={`https://instagram.com/${handle}`} size={160} fgColor={INK} bgColor="#ffffff" level="M" style={{ width: mm(25), height: mm(25), display: "block" }} />
        </div>
      )}
      <p style={{ fontSize: mm(2.4), color: MAUVE, position: "absolute", top: mm(74), left: 0, right: 0 }}>@{handle}</p>
      {website && <p style={{ fontSize: mm(2.3), position: "absolute", top: mm(78.5), left: 0, right: 0 }}>{website}</p>}
    </div>
  );
}

/** Chloe's square design (logo, name and Instagram handle), with the website added underneath. */
function SquareFront({ website }: { website: string }) {
  return (
    <div style={{ width: `${SQ}mm`, height: `${SQ}mm` }} className="relative shrink-0">
      <img src={brandFront} alt="" className="block h-full w-full" />
      {website && <p style={{ position: "absolute", left: 0, right: 0, top: `${SQ * 0.865}mm`, fontSize: "2.4mm", color: INK, textAlign: "center" }}>{website}</p>}
    </div>
  );
}

/**
 * The textured clay back with the logo badge. On the tall card the texture fills the card and
 * the full design sits in the middle, fading into it top and bottom so the badge isn't cut off.
 */
function BrandBack({ w, h }: { w: number; h: number }) {
  const square = w === h;
  return (
    <div style={{ width: `${w}mm`, height: `${h}mm`, background: "#e8dfd3" }} className="relative shrink-0 overflow-hidden">
      <img src={brandBack} alt="" className="absolute inset-0 h-full w-full object-cover" style={square ? undefined : { filter: "blur(0.3mm)" }} />
      {!square && (
        <img
          src={brandBack}
          alt=""
          className="absolute left-0 top-1/2 w-full -translate-y-1/2"
          style={{ maskImage: "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)" }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------- printing

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let k = 0; k < list.length; k += size) out.push(list.slice(k, k + size));
  return out;
}

/** A4 pages that only exist when printing; the rest of the page is hidden from the printer. */
function PrintPortal({ children }: { children: ReactNode }) {
  const [host] = useState(() => document.createElement("div"));
  useEffect(() => {
    host.className = "card-print";
    document.body.appendChild(host);
    return () => host.remove();
  }, [host]);
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
        }
      `}</style>
      {children}
    </>,
    host,
  );
}

/** Short cut marks outside the grid at every card edge. */
function CropMarks({ cols, rows, w, h }: { cols: number; rows: number; w: number; h: number }) {
  const len = 5;
  const gap = 1.5;
  const marks: CSSProperties[] = [];
  for (let c = 0; c <= cols; c++) {
    const x = `calc(${c * w}mm - 0.1mm)`;
    marks.push({ left: x, top: `-${len + gap}mm`, width: "0.2mm", height: `${len}mm` });
    marks.push({ left: x, top: `${rows * h + gap}mm`, width: "0.2mm", height: `${len}mm` });
  }
  for (let r = 0; r <= rows; r++) {
    const y = `calc(${r * h}mm - 0.1mm)`;
    marks.push({ top: y, left: `-${len + gap}mm`, height: "0.2mm", width: `${len}mm` });
    marks.push({ top: y, left: `${cols * w + gap}mm`, height: "0.2mm", width: `${len}mm` });
  }
  return <>{marks.map((s, k) => <span key={k} style={{ position: "absolute", background: "#999", ...s }} />)}</>;
}
