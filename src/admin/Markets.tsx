import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Market } from "@/lib/supabase";
import type { AdminData } from "./AdminApp";
import { eur, sum, today } from "./data";
import { MarketSheet } from "./sheets";
import { Empty, PageHeader } from "./ui";

export default function Markets({ markets, sales, marketItems }: AdminData) {
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const now = today();
  const upcoming = markets.filter((m) => m.date >= now);
  const past = markets.filter((m) => m.date < now).reverse();

  const row = (m: Market) => {
    const ms = sales.filter((s) => s.market_id === m.id);
    const packed = marketItems.filter((mi) => mi.market_id === m.id).length;
    const d = new Date(`${m.date}T00:00:00`);
    return (
      <li key={m.id}>
        <Link to={`/admin/events/${m.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50">
          <div className="w-12 shrink-0 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{d.toLocaleDateString("en-GB", { month: "short" })}</p>
            <p className="tabular font-display text-2xl font-semibold leading-none">{d.getDate()}</p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{m.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {m.location ? `${m.location} · ` : ""}
              {m.date >= now ? `${packed} packed` : `${ms.length} sold`}
            </p>
          </div>
          <div className="text-right">
            <p className="tabular text-sm font-semibold">{eur(sum(ms))}</p>
            {m.goal_eur != null && <p className="tabular text-xs text-muted-foreground">of {eur(m.goal_eur)}</p>}
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </li>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Events"
        sub={markets.length ? `${markets.length} ${markets.length === 1 ? "event" : "events"} · ${eur(sum(sales.filter((s) => s.market_id)))} earned at events` : undefined}
        action={<Button className="h-11 rounded-xl" onClick={() => setCreating(true)}><Plus /> New event</Button>}
      />
      <Link to="/admin/leads" className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-muted px-4 text-sm hover:bg-muted/70">
        <span>Looking for new events or collaborations? <strong>Leads</strong></span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
      <section>
        <h2 className="mb-2 text-xl font-semibold">Coming up</h2>
        {upcoming.length ? <ul className="divide-y rounded-2xl border bg-card">{upcoming.map(row)}</ul> : <Empty>No events planned. Add one to start packing.</Empty>}
      </section>
      {past.length > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Past</h2>
          <ul className="divide-y rounded-2xl border bg-card">{past.map(row)}</ul>
        </section>
      )}
      <MarketSheet market={null} open={creating} onClose={() => setCreating(false)} onSaved={(id) => navigate(`/admin/events/${id}?tab=pack`)} />
    </div>
  );
}
