import type { ReactNode } from "react";
import { Ban, Check, Circle } from "lucide-react";
import { pieces } from "@/data/pieces";
import type { Item, ItemStatus } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const photoBySitePiece = new Map(pieces.map((p) => [p.id, p.images[0]]));

/** Portfolio photo for the item's design, if the design is on the site. */
export function Thumb({ item, className }: { item: Item; className?: string }) {
  const src = item.designs?.site_piece_id ? photoBySitePiece.get(item.designs.site_piece_id) : undefined;
  const name = item.designs?.name ?? item.label;
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--clay))]", className)} aria-hidden>
      {src ? (
        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 grid place-items-center font-serif text-lg text-[hsl(var(--clay-foreground))]">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}

const statusMeta: Record<ItemStatus, { label: string; icon: typeof Check; cls: string }> = {
  available: { label: "Available", icon: Circle, cls: "text-foreground [&_svg]:fill-[hsl(var(--highlight))] [&_svg]:stroke-foreground" },
  sold: { label: "Sold", icon: Check, cls: "text-muted-foreground" },
  not_for_sale: { label: "Not for sale", icon: Ban, cls: "text-muted-foreground" },
};

export function Status({ status, className }: { status: ItemStatus; className?: string }) {
  const m = statusMeta[status];
  const Icon = m.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", m.cls, className)}>
      <Icon className="size-3" strokeWidth={2.5} />
      {m.label}
    </span>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: ReactNode; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-4 pb-5 pt-2">
      <div className="min-w-0">
        <h1 className="text-balance font-serif text-3xl font-semibold tracking-tight">{title}</h1>
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
