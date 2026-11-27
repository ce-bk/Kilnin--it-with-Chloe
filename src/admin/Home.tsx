import { Link } from "react-router-dom";
import { ChevronRight, LogOut, Sprout } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { AdminData } from "./AdminApp";
import { channelLabel, daysUntil, eur, formatDate, leadsDueSoon, sum, today, localDay, salesByItem, unitsLeft, useLeads } from "./data";
import { Empty, GoalBar, SoldPrice, Thumb } from "./ui";

export default function Home({ items, sales, markets, marketItems }: AdminData) {
  const now = today();
  const month = now.slice(0, 7);
  const monthSales = sales.filter((s) => localDay(s.sold_at).slice(0, 7) === month);
  const inStock = items.filter((i) => i.status === "available");
  const unpriced = inStock.filter((i) => i.price_eur == null);
  const toCheck = inStock.filter((i) => i.notes?.toLowerCase().includes("check"));
  const bySale = salesByItem(sales);
  const stockValue = inStock.reduce((t, i) => t + Number(i.price_eur ?? 0) * unitsLeft(i, bySale), 0);

  const next = markets.find((m) => m.date >= now);
  const nextSales = next ? sales.filter((s) => s.market_id === next.id) : [];
  const nextPacked = next ? marketItems.filter((mi) => mi.market_id === next.id).length : 0;
  const days = next ? daysUntil(next.date) : null;

  const leads = useLeads().data ?? [];
  const leadsDue = leadsDueSoon(leads);
  const openLeads = leads.filter((l) => l.status !== "yes" && l.status !== "no").length;

  const itemById = new Map(items.map((i) => [i.id, i]));
  const marketById = new Map(markets.map((m) => [m.id, m]));
  const recent = [...sales].reverse().slice(0, 5);

  const tasks = [
    unpriced.length > 0 && { to: "/admin/pieces?filter=unpriced", text: <><strong>{unpriced.length} {unpriced.length === 1 ? "piece needs" : "pieces need"}</strong> a price</> },
    toCheck.length > 0 && { to: "/admin/pieces?filter=check", text: <><strong>{toCheck.length} {toCheck.length === 1 ? "piece has" : "pieces have"}</strong> a question to answer</> },
    leadsDue.length > 0 && { to: "/admin/leads", text: <><strong>{leadsDue.length} {leadsDue.length === 1 ? "lead" : "leads"}</strong> to follow up this week</> },
    next && { to: `/admin/events/${next.id}?tab=pack`, text: <><strong>{nextPacked} packed</strong> for {next.name}</> },
  ].filter(Boolean) as { to: string; text: React.ReactNode }[];

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4 pt-2">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Hi Chloe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {next ? (days === 0 ? <>Event day: <strong className="text-foreground">{next.name}</strong></> : <>{days} {days === 1 ? "day" : "days"} to <strong className="text-foreground">{next.name}</strong></>) : "No events coming up"}
          </p>
        </div>
        <button onClick={() => supabase!.auth.signOut()} className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted md:hidden" aria-label="Sign out">
          <LogOut className="size-5" />
        </button>
      </header>

      {/* Ledger: the two numbers that matter, one surface */}
      <section className="grid grid-cols-2 divide-x rounded-2xl border bg-card">
        <Figure label={`Sold in ${formatDate(now, { month: "long" })}`} value={eur(sum(monthSales))} foot={`${monthSales.length} ${monthSales.length === 1 ? "sale" : "sales"}`} />
        <Figure label="In stock" value={String(inStock.length)} foot={`${eur(stockValue)} if all sell`} />
      </section>

      {next && (
        <Link to={`/admin/events/${next.id}`} className="group block rounded-2xl bg-primary p-5 text-primary-foreground shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.5)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm opacity-75">{formatDate(next.date, { weekday: "long", day: "numeric", month: "long" })}{next.location && ` · ${next.location}`}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{next.name}</p>
            </div>
            <ChevronRight className="mt-1 size-5 opacity-70 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="mt-5 flex items-baseline justify-between text-sm">
            <span><span className="tabular font-display text-3xl">{eur(sum(nextSales))}</span> <span className="opacity-75">sold</span></span>
            {next.goal_eur != null && <span className="tabular opacity-75">goal {eur(next.goal_eur)}</span>}
          </div>
          <div className="mt-2 [&>div]:bg-primary-foreground/15">
            <GoalBar value={sum(nextSales)} goal={next.goal_eur} />
          </div>
        </Link>
      )}

      {tasks.length > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">To do</h2>
          <ul className="divide-y rounded-2xl border bg-card">
            {tasks.map((t) => (
              <li key={t.to}>
                <Link to={t.to} className="flex min-h-14 items-center justify-between gap-3 px-4 text-sm hover:bg-muted/50">
                  <span>{t.text}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link to="/admin/leads" className="flex items-center gap-3 rounded-2xl border bg-card p-4 hover:bg-muted/50">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted"><Sprout className="size-5" /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium">Leads</span>
          <span className="block text-sm text-muted-foreground">{openLeads ? `${openLeads} open · community events and collaborations` : "Community events and collaborations to explore"}</span>
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h2  className="text-xl font-semibold">Recent sales</h2>
          {sales.length > 0 && <Link to="/admin/sales" className="text-sm font-medium underline underline-offset-4">All sales</Link>}
        </div>
        {recent.length === 0 ? (
          <Empty>No sales yet. Your first one will show up here.</Empty>
        ) : (
          <ul className="divide-y rounded-2xl border bg-card">
            {recent.map((s) => {
              const item = itemById.get(s.item_id);
              const where = s.market_id ? marketById.get(s.market_id)?.name : channelLabel[s.channel];
              return (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                  {item && <Thumb item={item} className="size-10" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item?.label ?? "Piece"}</p>
                    <p className="truncate text-xs text-muted-foreground">{where} · {s.method} · {formatDate(localDay(s.sold_at), { day: "numeric", month: "short" })}</p>
                  </div>
                  <p className="text-sm font-semibold"><SoldPrice paid={s.price_eur} listed={item?.price_eur} /></p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Figure({ label, value, foot }: { label: string; value: string; foot: string }) {
  return (
    <div className="p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="tabular mt-1 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{foot}</p>
    </div>
  );
}
