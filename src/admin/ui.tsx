import type { ReactNode } from "react";
import { pieces } from "@/data/pieces";
import type { Item, ItemStatus } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { eur } from "./data";

const photoBySitePiece = new Map(pieces.map((p) => [p.id, p.images[0]]));

/** The piece's own photo; otherwise its portfolio photo; otherwise its first letter. */
export function Thumb({ item, className }: { item: Item; className?: string }) {
  const src = item.photo_url ?? (item.site_piece_id ? photoBySitePiece.get(item.site_piece_id) : undefined);
  const name = item.label;
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--clay))]", className)} aria-hidden>
      {src ? (
        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 grid place-items-center font-display text-lg text-[hsl(var(--clay-foreground))]">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}

const statusMeta: Record<ItemStatus, { label: string; cls: string }> = {
  available: { label: "Available", cls: "bg-[hsl(var(--available-bg))] text-[hsl(var(--available-fg))]" },
  sold: { label: "Sold", cls: "bg-[hsl(var(--sold-bg))] text-[hsl(var(--sold-fg))]" },
  not_for_sale: { label: "Not for sale", cls: "bg-muted text-muted-foreground" },
};

/** Status pill: green available, orange sold, grey not for sale. The word carries the meaning, not just the colour. */
export function Status({ status, className }: { status: ItemStatus; className?: string }) {
  const m = statusMeta[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold leading-tight", m.cls, className)}>
      {m.label}
    </span>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: ReactNode; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-4 pb-5 pt-2">
      <div className="min-w-0">
        <h1 className="text-balance font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </header>
  );
}

/** Segmented control: large tap targets, works one-handed. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("flex rounded-xl bg-muted p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          type="button"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "min-h-10 flex-1 rounded-lg px-3 text-sm font-medium transition-[background-color,box-shadow,color] duration-200",
            value === o.value ? "bg-card text-foreground shadow-[0_1px_2px_hsl(var(--foreground)/0.12),0_2px_8px_-2px_hsl(var(--foreground)/0.12)]" : "text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Thin goal bar; yellow is the one brand highlight in the admin. */
export function GoalBar({ value, goal }: { value: number; goal: number | null }) {
  const pct = goal ? Math.min(100, (value / goal) * 100) : 0;
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-[hsl(var(--highlight))] transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">{children}</p>;
}

/** Price a piece sold for. When it differs from the listed price, the listed price shows struck through before it. */
export function SoldPrice({ paid, listed }: { paid: number; listed: number | null | undefined }) {
  const changed = listed != null && Number(listed) !== Number(paid);
  return (
    <span className="tabular whitespace-nowrap">
      {changed && (
        <s className="mr-1.5 text-[0.8em] font-normal text-muted-foreground" aria-label={`listed at ${eur(listed)}`}>
          {eur(listed)}
        </s>
      )}
      {eur(paid)}
    </span>
  );
}
