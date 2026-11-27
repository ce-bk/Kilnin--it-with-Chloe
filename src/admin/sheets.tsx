import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Channel, Item, Market, PayMethod, Sale } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  localDay, channelLabel, eur, formatDate, METHODS, parsePrice, today,
  matchPhoto, useBulkPhotos, useCreateCategory, useDeletePiece, useRecordSale, useSaveItem, useSetPhoto, useSaveMarket, useUndoSale,
} from "./data";
import { Status, Thumb } from "./ui";

/**
 * How much of the screen the on-screen keyboard covers, and where the visible area starts.
 * iPhone Safari doesn't shrink the page for the keyboard, so sheets pinned to the bottom
 * would sit behind it; we lift them above it instead.
 */
function useKeyboard(active: boolean) {
  const [kb, setKb] = useState<{ inset: number; height: number } | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!active || !vv) return;
    const update = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKb(inset > 80 ? { inset, height: vv.height } : null);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      setKb(null);
    };
  }, [active]);
  return kb;
}

export function Sheet({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: ReactNode; description?: ReactNode; children: ReactNode }) {
  const kb = useKeyboard(open);
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()} shouldScaleBackground={false} repositionInputs={false}>
      <DrawerContent
        className="mx-auto max-h-[92dvh] max-w-lg"
        style={kb ? { bottom: kb.inset, maxHeight: kb.height - 12 } : undefined}
        onFocusCapture={(e) => {
          // Once the keyboard is up, bring the box being typed in into view.
          const el = e.target as HTMLElement;
          if (el.matches("input, textarea, select")) setTimeout(() => el.scrollIntoView({ block: "nearest", behavior: "smooth" }), 350);
        }}
      >
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-display text-2xl">{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="scroll-pb-6 overflow-y-auto px-4 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))]">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}

export function Chips<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
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
    <Sheet open={!!item} onClose={onClose} title={item?.label} description={market ? `Selling at ${market.name}` : "Sale outside an event"}>
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
            <p className="text-sm text-muted-foreground">{item.categories?.name}{item.price_eur != null && <> · listed at <span className="tabular">{eur(item.price_eur)}</span></>}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sale-price">Price paid</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-2xl text-muted-foreground">€</span>
              <Input id="sale-price" inputMode="decimal" autoComplete="off" value={price} onChange={(e) => setPrice(e.target.value)} className="tabular h-14 pl-10 font-display text-2xl" />
            </div>
            {parsed === "invalid" && <p className="text-sm text-destructive">Enter a number, like 18 or 12.50</p>}
            {typeof parsed === "number" && item.price_eur != null && parsed !== Number(item.price_eur) && (
              <p className="text-sm text-muted-foreground">
                <span className="tabular">{eur(Math.abs(Number(item.price_eur) - parsed))}</span>{" "}
                {parsed < Number(item.price_eur) ? "below" : "above"} the listed <span className="tabular">{eur(item.price_eur)}</span>
              </p>
            )}
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
  item, isNew, categories, sales, markets, onClose, onSell,
}: {
  item: Item | null; isNew: boolean; categories: Category[]; sales: Sale[]; markets: Market[];
  onClose: () => void; onSell: (item: Item) => void;
}) {
  const open = isNew || !!item;
  const [label, setLabel] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [forSale, setForSale] = useState(true);
  const [quantity, setQuantity] = useState("1");
  const save = useSaveItem();
  const createCategory = useCreateCategory();
  const setPhoto = useSetPhoto();
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const pendingUrl = useMemo(() => (pendingPhoto ? URL.createObjectURL(pendingPhoto) : null), [pendingPhoto]);
  useEffect(() => () => { if (pendingUrl) URL.revokeObjectURL(pendingUrl); }, [pendingUrl]);
  const undo = useUndoSale();
  const remove = useDeletePiece();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setConfirmDelete(false);
    setLabel(item?.label ?? "");
    setCategoryId(item?.category_id ?? "other");
    setPendingPhoto(null);
    setNewCategory("");
    setPrice(item?.price_eur?.toString() ?? "");
    setNotes(item?.notes ?? "");
    setForSale(item?.status !== "not_for_sale");
    setQuantity(String(item?.quantity ?? 1));
  }, [open, item]);

  const parsed = parsePrice(price);
  const qty = Number(quantity);
  const qtyError = !Number.isInteger(qty) || qty < 1
    ? "Enter a whole number, 1 or more"
    : qty < sales.length ? `${sales.length} already sold, so it can't be fewer than that` : null;
  const left = Math.max(0, qty - sales.length);
  const busy = save.isPending || createCategory.isPending || setPhoto.isPending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (parsed === "invalid" || qtyError || !label.trim()) return;
    let category = categoryId;
    if (category === "__new") {
      if (!newCategory.trim()) return;
      category = await createCategory.mutateAsync(newCategory);
    }
    const status = !forSale ? "not_for_sale" : left === 0 && sales.length > 0 ? "sold" : "available";
    const id = await save.mutateAsync({
      id: item?.id ?? null,
      patch: { label: label.trim(), category_id: category, price_eur: parsed, notes: notes.trim() || null, status, quantity: qty },
    });
    if (pendingPhoto) await setPhoto.mutateAsync({ itemId: id, oldPath: item?.photo_path ?? null, file: pendingPhoto });
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={isNew ? "New piece" : item?.label} description={item && <Status status={item.status} />}>
      {item && sales.length > 0 && (
        <ul className="mb-5 space-y-2">
          {sales.map((sale) => {
            const market = sale.market_id ? markets.find((m) => m.id === sale.market_id) : undefined;
            return (
              <li key={sale.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted p-3 text-sm">
                <p>
                  Sold for <strong className="tabular">{eur(sale.price_eur)}</strong> · {sale.method}
                  {item.price_eur != null && Number(item.price_eur) !== Number(sale.price_eur) && (
                    <span className="text-muted-foreground"> (listed at <span className="tabular">{eur(item.price_eur)}</span>)</span>
                  )}
                  <br />
                  <span className="text-muted-foreground">
                    {market ? market.name : channelLabel[sale.channel]} · {formatDate(localDay(sale.sold_at))}
                  </span>
                </p>
                <Button variant="outline" size="sm" disabled={undo.isPending} onClick={() => undo.mutate(sale.id, { onSuccess: onClose })}>Undo sale</Button>
              </li>
            );
          })}
        </ul>
      )}
      <form onSubmit={submit} className="space-y-4">
        <PhotoPicker
          preview={pendingUrl ?? item?.photo_url ?? null}
          fallback={item}
          hasOwnPhoto={!!pendingPhoto || !!item?.photo_path}
          busy={setPhoto.isPending}
          onPick={setPendingPhoto}
          onRemove={() => {
            if (pendingPhoto) setPendingPhoto(null);
            else if (item?.photo_path) setPhoto.mutate({ itemId: item.id, oldPath: item.photo_path, file: null });
          }}
        />
        <div className="space-y-2">
          <Label htmlFor="p-label">Name</Label>
          <Input id="p-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Teal lamp, dark shade" required className="h-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-category">Category</Label>
          <select
            id="p-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
          >
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            <option value="__new">+ New category…</option>
          </select>
          {categoryId === "__new" && (
            <Input aria-label="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Planters" className="h-12" autoFocus />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-price">Price</Label>
          <Input id="p-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="€" className="tabular h-12" />
          {parsed === "invalid" && <p className="text-sm text-destructive">Enter a number, like 18 or 12.50</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-qty">How many</Label>
          <Input id="p-qty" type="number" inputMode="numeric" min={1} step={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="tabular h-12 w-28" />
          {qtyError ? <p className="text-sm text-destructive">{qtyError}</p> : qty > 1 && (
            <p className="text-sm text-muted-foreground">Identical pieces sold one at a time. {sales.length > 0 ? `${left} of ${qty} left.` : ""}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-notes">Notes</Label>
          <Textarea id="p-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Glaze, size, flaws…" />
        </div>
        {(item?.status !== "sold" || left > 0) && (
          <label className="flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 text-sm">
            <span>For sale</span>
            <input type="checkbox" checked={forSale} onChange={(e) => setForSale(e.target.checked)} className="size-5 accent-[hsl(var(--primary))]" />
          </label>
        )}
        <div className="flex gap-2 pt-1">
          {item && item.status === "available" && left > 0 && (
            <Button type="button" variant="outline" className="h-12 flex-1 rounded-xl" onClick={() => onSell(item)}>Record sale</Button>
          )}
          <Button type="submit" className="h-12 flex-1 rounded-xl" disabled={busy || parsed === "invalid" || !!qtyError}>
            {busy ? "Saving…" : isNew ? "Add piece" : "Save"}
          </Button>
        </div>
        {item && !isNew && (
          sales.length > 0 ? (
            <p className="pt-2 text-center text-xs text-muted-foreground">This piece has sales, so it can't be deleted. Turn off For sale to hide it.</p>
          ) : confirmDelete ? (
            <div className="space-y-2 rounded-xl border border-destructive/40 p-3">
              <p className="text-sm">Delete <strong>{item.label}</strong> for good? It also comes off any packing lists.</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="h-11 flex-1 rounded-xl" onClick={() => setConfirmDelete(false)}>Keep it</Button>
                <Button type="button" variant="destructive" className="h-11 flex-1 rounded-xl" disabled={remove.isPending} onClick={() => remove.mutate(item, { onSuccess: onClose })}>
                  {remove.isPending ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="mx-auto flex min-h-11 items-center gap-1.5 text-sm text-destructive underline-offset-4 hover:underline">
              <Trash2 className="size-4" /> Delete piece
            </button>
          )
        )}
      </form>
    </Sheet>
  );
}

function PhotoPicker({
  preview, fallback, hasOwnPhoto, busy, onPick, onRemove,
}: {
  preview: string | null; fallback: Item | null; hasOwnPhoto: boolean; busy: boolean;
  onPick: (f: File) => void; onRemove: () => void;
}) {
  const inputId = useId();
  return (
    <div className="flex items-center gap-4">
      <label
        htmlFor={inputId}
        aria-label={hasOwnPhoto ? "Change photo" : "Add photo"}
        className={cn("group relative size-24 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[hsl(var(--clay))] focus-within:ring-2 focus-within:ring-ring", busy && "pointer-events-none opacity-50")}
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : fallback ? (
          <Thumb item={fallback} className="size-24 rounded-xl" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[hsl(var(--clay-foreground))]"><ImagePlus className="size-7" /></span>
        )}
        <span className="absolute bottom-1 right-1 grid size-7 place-items-center rounded-full bg-background/90 shadow-sm"><Camera className="size-3.5" /></span>
      </label>
      <div className="flex flex-col items-start gap-2">
        <label className={cn("inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-input bg-card px-4 text-sm font-medium hover:bg-muted", busy && "pointer-events-none opacity-50")}>
          <Camera className="size-4" />
          {hasOwnPhoto ? "Change photo" : "Add photo"}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
              e.target.value = "";
            }}
          />
        </label>
        {hasOwnPhoto && (
          <button type="button" onClick={onRemove} disabled={busy} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50">
            Remove photo
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Photos (several at once)

/** Pick many photos; each is matched to a piece by its file name and can be changed before saving. */
export function PhotosSheet({ open, items, onClose }: { open: boolean; items: Item[]; onClose: () => void }) {
  const [rows, setRows] = useState<{ file: File; url: string; itemId: string }[]>([]);
  const [done, setDone] = useState(0);
  const upload = useBulkPhotos();
  const inputId = useId();
  const sorted = useMemo(() => [...items].sort((a, b) => a.label.localeCompare(b.label)), [items]);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  useEffect(() => {
    if (!open) setRows((r) => { r.forEach((x) => URL.revokeObjectURL(x.url)); return []; });
    setDone(0);
  }, [open]);

  function pick(files: FileList | null) {
    if (!files) return;
    const taken = new Set(rows.map((r) => r.itemId));
    const next = [...files].map((file) => {
      const m = matchPhoto(file.name, items);
      const itemId = m && !taken.has(m.id) ? m.id : "";
      if (itemId) taken.add(itemId);
      return { file, url: URL.createObjectURL(file), itemId };
    });
    setRows((r) => [...r, ...next]);
  }

  const chosen = rows.filter((r) => r.itemId && byId.has(r.itemId));
  const counts = new Map<string, number>();
  chosen.forEach((r) => counts.set(r.itemId, (counts.get(r.itemId) ?? 0) + 1));
  const doubled = [...counts.values()].some((n) => n > 1);

  return (
    <Sheet open={open} onClose={onClose} title="Add photos" description="Choose several photos. Each one is matched to a piece by its file name. Check the matches, then save.">
      <div className="space-y-4">
        <label htmlFor={inputId} className={cn("flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-card px-4 text-sm font-medium hover:bg-muted", upload.isPending && "pointer-events-none opacity-50")}>
          <ImagePlus className="size-4" /> {rows.length ? "Choose more photos" : "Choose photos"}
          <input id={inputId} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />
        </label>

        {rows.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">
              {chosen.length} of {rows.length} matched{rows.length > chosen.length && <> · the rest will be skipped unless you pick a piece</>}
            </p>
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
              {rows.map((r, k) => {
                const piece = byId.get(r.itemId);
                const dup = r.itemId && (counts.get(r.itemId) ?? 0) > 1;
                return (
                  <li key={r.url} className="flex items-center gap-3 p-3">
                    <img src={r.url} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-xs text-muted-foreground" title={r.file.name}>{r.file.name}</p>
                      <select
                        aria-label={`Piece for ${r.file.name}`}
                        value={r.itemId}
                        disabled={upload.isPending}
                        onChange={(e) => setRows((all) => all.map((x, j) => (j === k ? { ...x, itemId: e.target.value } : x)))}
                        className={cn("h-11 w-full rounded-md border bg-background px-2 text-sm", r.itemId ? "border-input" : "border-dashed border-input text-muted-foreground", dup && "border-destructive")}
                      >
                        <option value="">Skip this photo</option>
                        {sorted.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
                      </select>
                      {dup ? <p className="text-xs text-destructive">Two photos are on this piece. Pick one.</p>
                        : piece?.photo_path ? <p className="text-xs text-muted-foreground">Replaces its current photo</p> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
            <Button
              className="h-14 w-full rounded-xl text-base"
              disabled={!chosen.length || doubled || upload.isPending}
              onClick={() => upload.mutate(
                { matches: chosen.map((r) => ({ file: r.file, item: byId.get(r.itemId)! })), onProgress: setDone },
                { onSuccess: onClose },
              )}
            >
              {upload.isPending ? `Saving ${done + 1} of ${chosen.length}…` : `Save ${chosen.length} photo${chosen.length === 1 ? "" : "s"}`}
            </Button>
          </>
        )}
      </div>
    </Sheet>
  );
}

// ---------------------------------------------------------------- Market

export function MarketSheet({
  market, open, onClose, onSaved, initial,
}: {
  market: Market | null; open: boolean; onClose: () => void; onSaved?: (id: string) => void;
  /** Starting values for a new event, e.g. from a lead. */
  initial?: Partial<Omit<Market, "id">>;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(today());
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState("");
  const save = useSaveMarket();

  useEffect(() => {
    if (!open) return;
    setName(market?.name ?? initial?.name ?? "");
    setDate(market?.date ?? initial?.date ?? today());
    setLocation(market?.location ?? initial?.location ?? "");
    setGoal(market?.goal_eur?.toString() ?? initial?.goal_eur?.toString() ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, market]);

  const parsedGoal = parsePrice(goal);

  return (
    <Sheet open={open} onClose={onClose} title={market ? "Edit event" : "New event"}>
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
        <Button type="submit" className="h-12 w-full rounded-xl" disabled={save.isPending}>{save.isPending ? "Saving…" : market ? "Save" : "Create event"}</Button>
      </form>
    </Sheet>
  );
}
