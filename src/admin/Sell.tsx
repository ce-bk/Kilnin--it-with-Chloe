import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import type { Item } from "@/lib/supabase";
import type { AdminData } from "./AdminApp";
import { eur, today } from "./data";
import { MarketSell } from "./MarketDetail";
import { SaleSheet } from "./sheets";
import { Empty, PageHeader, Segmented, Thumb } from "./ui";

/** The centre tab. On market day it is the stall; otherwise it records a direct or online sale. */
export default function Sell(data: AdminData) {
  const todays = data.markets.find((m) => m.date === today());
  const [mode, setMode] = useState<"market" | "other">(todays ? "market" : "other");

  if (todays) {
    return (
      <div>
        <PageHeader title="Sell" sub={<>Market day: <Link to={`/admin/markets/${todays.id}`} className="font-medium text-foreground underline underline-offset-4">{todays.name}</Link></>} />
        <Segmented<"market" | "other"> className="mb-5" value={mode} onChange={setMode} options={[{ value: "market", label: "At the market" }, { value: "other", label: "Other sale" }]} />
        {mode === "market" ? <MarketSell market={todays} {...data} /> : <OtherSale {...data} />}
      </div>
    );
  }

  const next = data.markets.find((m) => m.date > today());
  return (
    <div>
      <PageHeader title="Sell" sub="Record a sale to a friend, a commission or an Instagram order." />
      {next && (
        <Link to={`/admin/markets/${next.id}`} className="mb-5 flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-sm hover:bg-muted/50">
          <span>Selling at a market? Open <strong>{next.name}</strong></span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      )}
      <OtherSale {...data} />
    </div>
  );
}

function OtherSale({ items }: AdminData) {
  const [query, setQuery] = useState("");
  const [selling, setSelling] = useState<Item | null>(null);
  const q = query.trim().toLowerCase();
  const available = items.filter((i) => i.status === "available" && (!q || `${i.label} ${i.designs?.name ?? ""}`.toLowerCase().includes(q)));

  return (
    <div className="space-y-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <span className="sr-only">Find the piece you sold</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Which piece did you sell?"
          className="h-12 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      {available.length === 0 ? (
        <Empty>{q ? `No piece in stock matches “${query}”.` : "Nothing in stock."}</Empty>
      ) : (
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
          {available.map((i) => (
            <li key={i.id}>
              <button onClick={() => setSelling(i)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted/50">
                <Thumb item={i} className="size-12" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{i.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{i.designs?.name}</p>
                </div>
                <span className="tabular text-sm font-semibold">{eur(i.price_eur)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <SaleSheet item={selling} market={null} onClose={() => setSelling(null)} />
    </div>
  );
}
