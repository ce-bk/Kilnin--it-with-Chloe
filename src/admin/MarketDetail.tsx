import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Item, Market, Sale } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { AdminData } from "./AdminApp";
import { eur, formatDate, METHODS, parsePrice, sum, useSaveItem, useTogglePacked, useUndoSale } from "./data";
import { MarketSheet, SaleSheet } from "./sheets";
import { Empty, GoalBar, Segmented, Thumb } from "./ui";

type Tab = "pack" | "sell" | "results";

export default function MarketDetail(data: AdminData) {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) ?? "sell";
  const [editing, setEditing] = useState(false);
  const market = data.markets.find((m) => m.id === id);

  if (!market) return <Empty>That market doesn't exist. <Link to="/admin/markets" className="underline">Back to markets</Link></Empty>;

  return (
    <div>
      <Link to="/admin/markets" className="-ml-2 inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Markets
      </Link>
      <header className="flex items-start justify-between gap-3 pb-5 pt-1">
        <div className="min-w-0">
          <h1 className="text-balance font-serif text-3xl font-semibold tracking-tight">{market.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            {formatDate(market.date, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
            {market.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{market.location}</span>}
          </p>
        </div>
        <Button variant="outline" size="icon" className="shrink-0 rounded-xl" onClick={() => setEditing(true)} aria-label="Edit market"><Pencil /></Button>
      </header>

      <Segmented
        className="mb-5"
        value={tab}
        onChange={(t) => setParams(t === "sell" ? {} : { tab: t }, { replace: true })}
        options={[{ value: "pack", label: "Pack" }, { value: "sell", label: "Sell" }, { value: "results", label: "Results" }]}
      />

      {tab === "pack" && <Pack market={market} {...data} />}
      {tab === "sell" && <MarketSell market={market} {...data} />}
      {tab === "results" && <Results market={market} {...data} />}

      <MarketSheet market={market} open={editing} onClose={() => setEditing(false)} />
    </div>
  );
}

type Props = AdminData & { market: Market };

function usePacked(market: Market, { items, marketItems, sales }: AdminData) {
  return useMemo(() => {
    const ids = new Set(marketItems.filter((mi) => mi.market_id === market.id).map((mi) => mi.item_id));
    const marketSales = sales.filter((s) => s.market_id === market.id);
    const saleByItem = new Map(marketSales.map((s) => [s.item_id, s]));
    const packed = items.filter((i) => ids.has(i.id) || saleByItem.has(i.id));
    return { ids, packed, marketSales, saleByItem };
  }, [items, marketItems, sales, market.id]);
}

// ---------------------------------------------------------------- Pack

function Pack({ market, ...data }: Props) {
  const { ids, saleByItem } = usePacked(market, data);
  const toggle = useTogglePacked();
  const saveItem = useSaveItem();
  const candidates = data.items.filter((i) => i.status === "available" || saleByItem.has(i.id));
  const available = candidates.filter((i) => i.status === "available");
  const packedCount = candidates.filter((i) => ids.has(i.id)).length;
  const unpricedPacked = available.filter((i) => ids.has(i.id) && i.price_eur == null).length;
  const value = available.filter((i) => ids.has(i.id)).reduce((t, i) => t + Number(i.price_eur ?? 0), 0);
  const allPacked = available.every((i) => ids.has(i.id));

  const groups = new Map<string, Item[]>();
  for (const i of candidates) groups.set(i.designs?.name ?? "Other", [...(groups.get(i.designs?.name ?? "Other") ?? []), i]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
        <p className="text-sm">
          <strong className="tabular">{packedCount}</strong> packed · <span className="tabular">{eur(value)}</span> if all sell
          {unpricedPacked > 0 && <span className="block text-muted-foreground">{unpricedPacked} without a price</span>}
        </p>
        <Button
          variant="outline"
          className="rounded-xl"
          disabled={toggle.isPending || available.length === 0}
          onClick={() => toggle.mutate({ marketId: market.id, itemIds: available.map((i) => i.id), packed: !allPacked })}
        >
          {allPacked ? "Unpack all" : "Pack everything"}
        </Button>
      </div>

      {candidates.length === 0 && <Empty>No pieces in stock to pack.</Empty>}

      {[...groups.entries()].map(([design, list]) => (
        <section key={design}>
          <h2 className="mb-2 px-1 text-sm font-semibold">{design}</h2>
          <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
            {list.map((i) => {
              const sold = saleByItem.has(i.id);
              const packed = ids.has(i.id) || sold;
              return (
                <li key={i.id} className="flex items-center gap-3 px-3 py-2.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={packed}
                    aria-label={`Pack ${i.label}`}
                    disabled={sold}
                    onClick={() => toggle.mutate({ marketId: market.id, itemIds: [i.id], packed: !packed })}
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-lg border-2 transition-colors",
                      packed ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background",
                    )}
                  >
                    {packed && <Check className="size-4" strokeWidth={3} />}
                  </button>
                  <Thumb item={i} className="size-10" />
                  <p className="min-w-0 flex-1 truncate text-sm">{i.label}{sold && <span className="text-muted-foreground"> · sold here</span>}</p>
                  {!sold && (
                    <input
                      aria-label={`Price for ${i.label}`}
                      key={`${i.id}-${i.price_eur}`}
                      defaultValue={i.price_eur ?? ""}
                      inputMode="decimal"
                      placeholder="€"
                      className="tabular h-10 w-20 rounded-lg border border-input bg-background px-2 text-right text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onBlur={(e) => {
                        const p = parsePrice(e.target.value);
                        if (p === "invalid") { e.target.value = i.price_eur?.toString() ?? ""; return; }
                        if (p !== i.price_eur) saveItem.mutate({ id: i.id, patch: { price_eur: p } });
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Sell

export function MarketSell({ market, ...data }: Props) {
  const { packed, marketSales, saleByItem } = usePacked(market, data);
  const [selling, setSelling] = useState<Item | null>(null);
  const undo = useUndoSale();
  const total = sum(marketSales);
  const ordered = [...packed].sort((a, b) => Number(saleByItem.has(a.id)) - Number(saleByItem.has(b.id)));

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-card p-4">
        <div className="flex items-baseline justify-between">
          <p><span className="tabular font-serif text-4xl font-semibold">{eur(total)}</span> <span className="text-sm text-muted-foreground">sold</span></p>
          <p className="tabular text-sm text-muted-foreground">{marketSales.length} of {packed.length}{market.goal_eur != null && ` · goal ${eur(market.goal_eur)}`}</p>
        </div>
        {market.goal_eur != null && <div className="mt-3"><GoalBar value={total} goal={market.goal_eur} /></div>}
      </div>

      {packed.length === 0 ? (
        <Empty>Nothing packed yet. Use the <strong>Pack</strong> tab to choose what you're bringing.</Empty>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ordered.map((i) => {
            const sale = saleByItem.get(i.id);
            return (
              <li key={i.id} className={cn("flex flex-col overflow-hidden rounded-2xl border bg-card", sale && "bg-muted/60")}>
                <div className="relative">
                  <Thumb item={i} className={cn("aspect-[3/2] w-full rounded-none", sale && "opacity-50 grayscale")} />
                  {sale && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      <Check className="size-3" strokeWidth={3} /> Sold
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-xs text-muted-foreground">{i.designs?.name}</p>
                  <p className="line-clamp-2 text-sm font-medium leading-snug">{i.label}</p>
                  <p className="tabular mt-1 font-serif text-xl font-semibold">{sale ? eur(sale.price_eur) : i.price_eur == null ? <span className="text-sm font-medium text-muted-foreground [font-family:ui-sans-serif,system-ui,sans-serif]">No price</span> : eur(i.price_eur)}</p>
                  <div className="mt-auto pt-3">
                    {sale ? (
                      <Button variant="ghost" className="h-11 w-full rounded-xl text-muted-foreground" disabled={undo.isPending} onClick={() => undo.mutate(sale.id)}>
                        {sale.method} · Undo
                      </Button>
                    ) : (
                      <Button className="h-12 w-full rounded-xl text-base" onClick={() => setSelling(i)}>Sold</Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <SaleSheet item={selling} market={market} onClose={() => setSelling(null)} />
    </div>
  );
}

// ---------------------------------------------------------------- Results

function Results({ market, ...data }: Props) {
  const { packed, marketSales, saleByItem } = usePacked(market, data);
  const total = sum(marketSales);
  const byMethod = METHODS.map((m) => ({ m, n: marketSales.filter((s) => s.method === m) })).filter((x) => x.n.length > 0);
  const cameHome = packed.filter((i) => !saleByItem.has(i.id));

  const groups = new Map<string, { sold: number; total: number }>();
  for (const i of packed) {
    const k = i.designs?.name ?? "Other";
    const g = groups.get(k) ?? { sold: 0, total: 0 };
    g.total++;
    if (saleByItem.has(i.id)) g.sold++;
    groups.set(k, g);
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 divide-x rounded-2xl border bg-card">
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Earned</p>
          <p className="tabular mt-1 font-serif text-3xl font-semibold">{eur(total)}</p>
          {market.goal_eur != null && <p className="mt-1 text-xs text-muted-foreground">{total >= market.goal_eur ? "Goal reached" : `${eur(market.goal_eur - total)} short of goal`}</p>}
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Sold</p>
          <p className="tabular mt-1 font-serif text-3xl font-semibold">{marketSales.length}<span className="text-lg text-muted-foreground">/{packed.length}</span></p>
          <p className="mt-1 text-xs text-muted-foreground">{cameHome.length} came home</p>
        </div>
      </section>

      {byMethod.length > 0 && (
        <section>
          <h2 className="mb-2 font-serif text-xl font-semibold">How people paid</h2>
          <ul className="divide-y rounded-2xl border bg-card text-sm">
            {byMethod.map(({ m, n }) => (
              <li key={m} className="flex justify-between px-4 py-3 capitalize"><span>{m} <span className="text-muted-foreground">· {n.length}</span></span><span className="tabular font-semibold">{eur(sum(n))}</span></li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold">By design</h2>
        {groups.size === 0 ? <Empty>Nothing packed for this market.</Empty> : (
          <ul className="divide-y rounded-2xl border bg-card text-sm">
            {[...groups.entries()].sort((a, b) => b[1].sold / b[1].total - a[1].sold / a[1].total).map(([d, g]) => (
              <li key={d} className="px-4 py-3">
                <div className="flex justify-between"><span>{d}</span><span className="tabular text-muted-foreground">{g.sold} of {g.total} sold</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(g.sold / g.total) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {marketSales.length > 0 && <SalesList sales={marketSales} items={data.items} />}
    </div>
  );
}

function SalesList({ sales, items }: { sales: Sale[]; items: Item[] }) {
  const byId = new Map(items.map((i) => [i.id, i]));
  return (
    <section>
      <h2 className="mb-2 font-serif text-xl font-semibold">Sales</h2>
      <ul className="divide-y rounded-2xl border bg-card text-sm">
        {sales.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 truncate">{byId.get(s.item_id)?.label}</span>
            <span className="shrink-0 text-muted-foreground"><span className="capitalize">{s.method}</span> · <span className="tabular font-semibold text-foreground">{eur(s.price_eur)}</span></span>
          </li>
        ))}
      </ul>
    </section>
  );
}
