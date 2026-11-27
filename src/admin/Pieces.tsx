import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IdCard, ImagePlus, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Item } from "@/lib/supabase";
import type { AdminData } from "./AdminApp";
import { eur, groupByCategory, salesByItem, unitsLeft } from "./data";
import { PhotosSheet, PieceSheet, SaleSheet } from "./sheets";
import { Empty, PageHeader, Segmented, SoldPrice, Status, Thumb } from "./ui";

type Filter = "all" | "available" | "sold" | "not_for_sale" | "unpriced";

const filters: { value: Filter; label: string }[] = [
  { value: "available", label: "In stock" },
  { value: "sold", label: "Sold" },
  { value: "all", label: "All" },
];

const extra: Record<string, string> = { unpriced: "Needs a price", not_for_sale: "Not for sale" };

export default function Pieces({ items, categories, sales, markets }: AdminData) {
  const [params, setParams] = useSearchParams();
  const filter = (params.get("filter") as Filter) ?? "available";
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [selling, setSelling] = useState<Item | null>(null);
  const [addingPhotos, setAddingPhotos] = useState(false);

  const bySale = useMemo(() => salesByItem(sales), [sales]);

  const shown = items.filter((i) => {
    const q = query.trim().toLowerCase();
    if (q && !`${i.label} ${i.categories?.name ?? ""} ${i.notes ?? ""}`.toLowerCase().includes(q)) return false;
    switch (filter) {
      case "all": return true;
      case "unpriced": return i.status === "available" && i.price_eur == null;
      default: return i.status === filter;
    }
  });

  const groups = groupByCategory(shown);

  return (
    <div>
      <PageHeader
        title="Pieces"
        sub={`${items.filter((i) => i.status === "available").length} in stock · ${items.filter((i) => i.status === "sold").length} sold`}
        action={
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="size-11 rounded-xl" aria-label="Upload images" onClick={() => setAddingPhotos(true)}><ImagePlus /></Button>
              </TooltipTrigger>
              <TooltipContent>Upload images</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="outline" size="icon" className="size-11 rounded-xl" aria-label="Print tags"><Link to="/admin/cards"><IdCard /></Link></Button>
              </TooltipTrigger>
              <TooltipContent>Print tags</TooltipContent>
            </Tooltip>
            <Button className="h-11 rounded-xl" onClick={() => setCreating(true)}><Plus /> Add piece</Button>
          </div>
        }
      />

      <div className="sticky top-0 z-10 -mx-4 space-y-3 bg-background/95 px-4 pb-3 pt-1 backdrop-blur md:-mx-8 md:px-8">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">Search pieces</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces"
            className="h-12 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        {extra[filter] ? (
          <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm">
            <span>Showing: <strong>{extra[filter]}</strong></span>
            <button className="font-medium underline underline-offset-4" onClick={() => setParams({})}>Clear</button>
          </div>
        ) : (
          <Segmented value={filter} onChange={(v) => setParams(v === "available" ? {} : { filter: v })} options={filters} />
        )}
      </div>

      {shown.length === 0 ? (
        <div className="pt-4"><Empty>{query ? `Nothing matches “${query}”.` : "Nothing here."}</Empty></div>
      ) : (
        <div className="space-y-6 pt-3">
          {groups.map(([category, list]) => (
            <section key={category}>
              <h2 className="mb-2 flex items-baseline justify-between px-1 text-sm font-semibold">
                {category}
                <span className="text-xs font-normal text-muted-foreground">{list.length}</span>
              </h2>
              <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
                {list.map((i) => {
                  const sale = i.status === "sold" ? bySale.get(i.id)?.at(-1) : undefined;
                  const qty = i.quantity ?? 1;
                  return (
                    <li key={i.id}>
                      <button onClick={() => setEditing(i)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted/50">
                        <Thumb item={i} className="size-12" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{i.label}</p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <Status status={i.status} />
                            {qty > 1 && <span className="tabular text-xs text-muted-foreground">{unitsLeft(i, bySale)} of {qty} left</span>}
                          </div>
                        </div>
                        <p className={`tabular text-sm font-semibold ${i.price_eur == null && !sale ? "text-muted-foreground" : ""}`}>
                          {sale ? <SoldPrice paid={sale.price_eur} listed={i.price_eur} /> : i.price_eur == null ? "No price" : eur(i.price_eur)}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <PieceSheet
        item={editing}
        isNew={creating}
        categories={categories}
        sales={editing ? bySale.get(editing.id) ?? [] : []}
        markets={markets}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSell={(i) => { setEditing(null); setSelling(i); }}
      />
      <SaleSheet item={selling} market={null} onClose={() => setSelling(null)} />
      <PhotosSheet open={addingPhotos} items={items} onClose={() => setAddingPhotos(false)} />
    </div>
  );
}
