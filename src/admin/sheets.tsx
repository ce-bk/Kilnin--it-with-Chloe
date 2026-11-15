import { useEffect, useState, type ReactNode } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Channel, Design, Item, Market, PayMethod, Sale } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  localDay, channelLabel, eur, formatDate, METHODS, parsePrice, today,
  useCreateDesign, useRecordSale, useSaveItem, useSaveMarket, useUndoSale,
} from "./data";
import { Status, Thumb } from "./ui";

function Sheet({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: ReactNode; description?: ReactNode; children: ReactNode }) {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()} shouldScaleBackground={false}>
      <DrawerContent className="mx-auto max-h-[92dvh] max-w-lg">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-serif text-2xl">{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}

function Chips<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "min-h-12 rounded-xl border text-sm font-medium capitalize transition-colors",
            value === o.value ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:bg-muted",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Sale

/** Record a sale. At a market the channel is fixed; elsewhere choose Direct or Online. */
export function SaleSheet({ item, market, onClose }: { item: Item | null; market: Market | null; onClose: () => void }) {
  const [price, setPrice] = useState("");
  const [method, setMethod] = useState<PayMethod>("cash");
  const [channel, setChannel] = useState<Channel>("direct");
  const record = useRecordSale();

  useEffect(() => {
    if (item) {
      setPrice(item.price_eur?.toString() ?? "");
      setMethod(market ? "cash" : "bizum");
      setChannel(market ? "market" : "direct");
    }
  }, [item, market]);

  const parsed = parsePrice(price);
  const valid = typeof parsed === "number";

  return (
    <Sheet open={!!item} onClose={onClose} title={item?.label} description={market ? `Selling at ${market.name}` : "Sale outside a market"}>
      {item && (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            record.mutate({ item, price: parsed, method, channel, marketId: market?.id ?? null }, { onSuccess: onClose });
          }}
        >
          <div className="flex items-center gap-3">
            <Thumb item={item} className="size-14" />
            <p className="text-sm text-muted-foreground">{item.designs?.name}{item.price_eur != null && <> · listed at <span className="tabular">{eur(item.price_eur)}</span></>}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sale-price">Price paid</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-serif text-2xl text-muted-foreground">€</span>
              <Input id="sale-price" inputMode="decimal" autoComplete="off" value={price} onChange={(e) => setPrice(e.target.value)} className="tabular h-14 pl-10 font-serif text-2xl" />
            </div>
            {parsed === "invalid" && <p className="text-sm text-destructive">Enter a number, like 18 or 12.50</p>}
          </div>
          {!market && (
            <div className="space-y-2">
              <Label>Where</Label>
              <Chips<Channel> label="Where" value={channel} onChange={setChannel} options={[{ value: "direct", label: "Direct" }, { value: "online", label: "Online" }]} />
            </div>
          )}
          <div className="space-y-2">
            <Label>Paid by</Label>
            <Chips<PayMethod> label="Paid by" value={method} onChange={setMethod} options={METHODS.map((m) => ({ value: m, label: m }))} />
          </div>
          <Button type="submit" className="h-14 w-full rounded-xl text-base" disabled={!valid || record.isPending}>
            {record.isPending ? "Saving…" : valid ? `Sold for ${eur(parsed)}` : "Sold"}
          </Button>
        </form>
      )}
    </Sheet>
  );
}

// ---------------------------------------------------------------- Piece

export function PieceSheet({
  item, isNew, designs, sale, market, onClose, onSell,
}: {
  item: Item | null; isNew: boolean; designs: Design[]; sale: Sale | undefined; market: Market | undefined;
  onClose: () => void; onSell: (item: Item) => void;
}) {
  const open = isNew || !!item;
  const [label, setLabel] = useState("");
  const [designId, setDesignId] = useState("");
  const [newDesign, setNewDesign] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [forSale, setForSale] = useState(true);
  const save = useSaveItem();
  const createDesign = useCreateDesign();
  const undo = useUndoSale();

  useEffect(() => {
    if (!open) return;
    setLabel(item?.label ?? "");
    setDesignId(item?.design_id ?? designs[0]?.id ?? "");
    setNewDesign("");
    setPrice(item?.price_eur?.toString() ?? "");
    setNotes(item?.notes ?? "");
    setForSale(item?.status !== "not_for_sale");
  }, [open, item, designs]);

  const parsed = parsePrice(price);
  const busy = save.isPending || createDesign.isPending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (parsed === "invalid" || !label.trim()) return;
    let design = designId;
    if (design === "__new") {
      if (!newDesign.trim()) return;
      design = await createDesign.mutateAsync(newDesign);
    }
    const status = item?.status === "sold" ? "sold" : forSale ? "available" : "not_for_sale";
    await save.mutateAsync({
      id: item?.id ?? null,
      patch: { label: label.trim(), design_id: design, price_eur: parsed, notes: notes.trim() || null, status },
    });
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={isNew ? "New piece" : item?.label} description={item && <Status status={item.status} />}>
      {item && sale && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-muted p-3 text-sm">
          <p>
            Sold for <strong className="tabular">{eur(sale.price_eur)}</strong> · {sale.method}
            <br />
            <span className="text-muted-foreground">
              {market ? market.name : channelLabel[sale.channel]} · {formatDate(localDay(sale.sold_at))}
            </span>
          </p>
          <Button variant="outline" size="sm" disabled={undo.isPending} onClick={() => undo.mutate(sale.id, { onSuccess: onClose })}>Undo sale</Button>
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="p-label">Name</Label>
          <Input id="p-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Teal lamp, dark shade" required className="h-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-design">Design</Label>
          <select
            id="p-design"
            value={designId}
            onChange={(e) => setDesignId(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
          >
            {designs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            <option value="__new">+ New design…</option>
          </select>
          {designId === "__new" && (
            <Input aria-label="New design name" value={newDesign} onChange={(e) => setNewDesign(e.target.value)} placeholder="Design name" className="h-12" autoFocus />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-price">Price</Label>
          <Input id="p-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="€" className="tabular h-12" />
          {parsed === "invalid" && <p className="text-sm text-destructive">Enter a number, like 18 or 12.50</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-notes">Notes</Label>
          <Textarea id="p-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Glaze, size, flaws…" />
        </div>
        {item?.status !== "sold" && (
          <label className="flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 text-sm">
            <span>For sale</span>
            <input type="checkbox" checked={forSale} onChange={(e) => setForSale(e.target.checked)} className="size-5 accent-[hsl(var(--primary))]" />
          </label>
        )}
        <div className="flex gap-2 pt-1">
          {item && item.status === "available" && (
            <Button type="button" variant="outline" className="h-12 flex-1 rounded-xl" onClick={() => onSell(item)}>Record sale</Button>
          )}
          <Button type="submit" className="h-12 flex-1 rounded-xl" disabled={busy || parsed === "invalid"}>
            {busy ? "Saving…" : isNew ? "Add piece" : "Save"}
          </Button>
        </div>
      </form>
    </Sheet>
  );
}

// ---------------------------------------------------------------- Market

export function MarketSheet({ market, open, onClose, onSaved }: { market: Market | null; open: boolean; onClose: () => void; onSaved?: (id: string) => void }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(today());
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState("");
  const save = useSaveMarket();

  useEffect(() => {
    if (!open) return;
    setName(market?.name ?? "");
    setDate(market?.date ?? today());
    setLocation(market?.location ?? "");
    setGoal(market?.goal_eur?.toString() ?? "");
  }, [open, market]);

  const parsedGoal = parsePrice(goal);

  return (
    <Sheet open={open} onClose={onClose} title={market ? "Edit market" : "New market"}>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim() || !date || parsedGoal === "invalid") return;
          const id = await save.mutateAsync({ id: market?.id ?? null, fields: { name: name.trim(), date, location: location.trim() || null, goal_eur: parsedGoal } });
          onClose();
          onSaved?.(id);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="m-name">Name</Label>
          <Input id="m-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Christmas craft market" required className="h-12" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="m-date">Date</Label>
            <Input id="m-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="m-goal">Sales goal</Label>
            <Input id="m-goal" inputMode="decimal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="€" className="tabular h-12" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="m-loc">Place</Label>
          <Input id="m-loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Optional" className="h-12" />
        </div>
        <Button type="submit" className="h-12 w-full rounded-xl" disabled={save.isPending}>{save.isPending ? "Saving…" : market ? "Save" : "Create market"}</Button>
      </form>
    </Sheet>
  );
}
