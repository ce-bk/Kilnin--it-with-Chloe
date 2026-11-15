import type { Channel } from "@/lib/supabase";
import type { AdminData } from "./AdminApp";
import { channelLabel, eur, formatDate, sum, localDay } from "./data";
import { Empty, PageHeader, Thumb } from "./ui";

const CHANNELS: Channel[] = ["market", "direct", "online"];

/** Every sale across markets, direct and online, newest first. */
export default function Sales({ sales, items, markets }: AdminData) {
  const itemById = new Map(items.map((i) => [i.id, i]));
  const marketById = new Map(markets.map((m) => [m.id, m]));
  const byChannel = CHANNELS.map((c) => ({ c, list: sales.filter((s) => s.channel === c) }));

  const days = new Map<string, typeof sales>();
  for (const s of [...sales].reverse()) {
    const d = localDay(s.sold_at);
    days.set(d, [...(days.get(d) ?? []), s]);
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Sales" sub={`${sales.length} ${sales.length === 1 ? "sale" : "sales"} · ${eur(sum(sales))} in total`} />

      <section className="grid grid-cols-3 divide-x rounded-2xl border bg-card">
        {byChannel.map(({ c, list }) => (
          <div key={c} className="p-3 sm:p-4">
            <p className="text-xs font-medium text-muted-foreground">{channelLabel[c]}</p>
            <p className="tabular mt-1 font-serif text-xl font-semibold sm:text-2xl">{eur(sum(list))}</p>
            <p className="text-xs text-muted-foreground">{list.length} {list.length === 1 ? "sale" : "sales"}</p>
          </div>
        ))}
      </section>

      {sales.length === 0 ? (
        <Empty>No sales yet. Tap <strong>Sell</strong> to record one.</Empty>
      ) : (
        [...days.entries()].map(([day, list]) => (
          <section key={day}>
            <h2 className="mb-2 flex justify-between px-1 text-sm font-semibold">
              {formatDate(day, { weekday: "long", day: "numeric", month: "long" })}
              <span className="tabular font-normal text-muted-foreground">{eur(sum(list))}</span>
            </h2>
            <ul className="divide-y rounded-2xl border bg-card">
              {list.map((s) => {
                const item = itemById.get(s.item_id);
                return (
                  <li key={s.id} className="flex items-center gap-3 px-3 py-3">
                    {item && <Thumb item={item} className="size-10" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item?.label ?? "Piece"}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {s.market_id ? marketById.get(s.market_id)?.name ?? "Market" : channelLabel[s.channel]} · <span className="capitalize">{s.method}</span>
                      </p>
                    </div>
                    <p className="tabular text-sm font-semibold">{eur(s.price_eur)}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
