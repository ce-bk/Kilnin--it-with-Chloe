import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase, type Channel, type Category, type Item, type Lead, type Market, type MarketItem, type PayMethod, type Sale } from "@/lib/supabase";

const db = () => {
  if (!supabase) throw new Error("Supabase isn't configured");
  return supabase;
};

async function all<T>(table: string, select = "*", order?: string): Promise<T[]> {
  let q = db().from(table).select(select);
  if (order) q = q.order(order);
  const { data, error } = await q;
  if (error) throw error;
  return data as T[];
}

export const useItems = () => useQuery({ queryKey: ["items"], queryFn: () => all<Item>("items", "*, categories(name, sort)", "sort") });
export const useCategories = () => useQuery({ queryKey: ["categories"], queryFn: () => all<Category>("categories", "*", "sort") });
export const useSales = () => useQuery({ queryKey: ["sales"], queryFn: () => all<Sale>("sales", "*", "sold_at") });
export const useMarkets = () => useQuery({ queryKey: ["markets"], queryFn: () => all<Market>("markets", "*", "date") });
export const useMarketItems = () => useQuery({ queryKey: ["market_items"], queryFn: () => all<MarketItem>("market_items") });

/** Everything the admin needs, loaded together. Data is small (one maker's inventory). */
export function useAdminData() {
  const items = useItems();
  const categories = useCategories();
  const sales = useSales();
  const markets = useMarkets();
  const marketItems = useMarketItems();
  const photos = usePhotoUrls(items.data ?? []);
  const withPhotos = useMemo(
    () => (items.data ?? []).map((i) => (i.photo_path && photos.data?.[i.photo_path] ? { ...i, photo_url: photos.data[i.photo_path] } : i)),
    [items.data, photos.data],
  );
  const qs = [items, categories, sales, markets, marketItems];
  return {
    loading: qs.some((q) => q.isLoading),
    error: qs.find((q) => q.error)?.error as Error | undefined,
    items: withPhotos,
    categories: categories.data ?? [],
    sales: sales.data ?? [],
    markets: markets.data ?? [],
    marketItems: marketItems.data ?? [],
  };
}

function useInvalidate() {
  const qc = useQueryClient();
  return (...keys: string[]) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}

const fail = (e: unknown) => toast.error(`Couldn't save: ${e instanceof Error ? e.message : String(e)}`);

export interface NewSale {
  item: Item;
  price: number;
  method: PayMethod;
  channel: Channel;
  marketId: string | null;
}

export function useRecordSale() {
  const invalidate = useInvalidate();
  const undo = useUndoSale();
  return useMutation({
    mutationFn: async (s: NewSale) => {
      const { data, error } = await db()
        .from("sales")
        .insert({ item_id: s.item.id, price_eur: s.price, method: s.method, channel: s.channel, market_id: s.marketId })
        .select("id")
        .single();
      if (error) throw error.code === "23505" ? new Error("That piece is already sold") : error;
      return { id: data.id as string, s };
    },
    onSuccess: ({ id, s }) => {
      invalidate("sales", "items");
      toast.success(`Sold: ${s.item.label}`, {
        description: `${eur(s.price)} · ${s.method}`,
        action: { label: "Undo", onClick: () => undo.mutate(id) },
        duration: 8000,
      });
    },
    onError: fail,
  });
}

export function useUndoSale() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (saleId: string) => {
      const { error } = await db().from("sales").delete().eq("id", saleId);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate("sales", "items");
      toast("Sale undone");
    },
    onError: fail,
  });
}

export type ItemPatch = Partial<Pick<Item, "label" | "price_eur" | "status" | "notes" | "category_id" | "quantity">>;

export function useSaveItem() {
  const invalidate = useInvalidate();
  return useMutation({
    /** Returns the piece's id (new or existing). */
    mutationFn: async ({ id, patch }: { id: string | null; patch: ItemPatch }) => {
      if (id) {
        const { error } = await db().from("items").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
        return id;
      }
      const { data, error } = await db().from("items").insert({ ...patch, sort: 1000 }).select("id").single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => invalidate("items"),
    onError: fail,
  });
}

// ---- photos ----

const BUCKET = "piece-photos";

/** Signed links (valid 1 hour) for every uploaded photo, fetched in one request. */
function usePhotoUrls(items: Item[]) {
  const paths = items.map((i) => i.photo_path).filter((p): p is string => !!p).sort();
  return useQuery({
    queryKey: ["photo-urls", paths],
    enabled: paths.length > 0,
    staleTime: 50 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await db().storage.from(BUCKET).createSignedUrls(paths, 3600);
      if (error) throw error;
      return Object.fromEntries(data.filter((d) => d.signedUrl && d.path).map((d) => [d.path!, d.signedUrl]));
    },
  });
}

/** Shrink a phone photo to at most 1600px on its long side as a JPEG, so uploads are quick. */
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    return blob ?? file;
  } catch {
    return file; // the browser can't decode it; upload as is
  }
}

/** Upload a new photo (file) or remove the current one (file = null) for one piece. */
async function setPhoto({ itemId, oldPath, file }: { itemId: string; oldPath: string | null; file: File | null }) {
  let path: string | null = null;
  if (file) {
    const blob = await shrink(file);
    path = `${itemId}/${Date.now()}.jpg`;
    const { error } = await db().storage.from(BUCKET).upload(path, blob, { contentType: blob.type || "image/jpeg" });
    if (error) throw error;
  }
  const { error } = await db().from("items").update({ photo_path: path, updated_at: new Date().toISOString() }).eq("id", itemId);
  if (error) throw error;
  if (oldPath) await db().storage.from(BUCKET).remove([oldPath]);
}

export function useSetPhoto() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: setPhoto,
    onSuccess: (_d, v) => {
      invalidate("items", "photo-urls");
      toast.success(v.file ? "Photo saved" : "Photo removed");
    },
    onError: fail,
  });
}

export interface PhotoMatch {
  file: File;
  /** The piece this photo goes on, or null to skip it. */
  item: Item | null;
}

const words = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/**
 * The piece a photo's file name points to. Exact name first (ignoring case and punctuation),
 * then the longest piece name the file name starts with, so "Small dip bowl (my guess).jpg"
 * finds "Small dip bowl".
 */
export function matchPhoto(fileName: string, items: Item[]): Item | null {
  const name = words(fileName.replace(/\.[^.]+$/, ""));
  if (!name) return null;
  const exact = items.find((i) => words(i.label) === name);
  if (exact) return exact;
  let best: Item | null = null;
  for (const i of items) {
    const label = words(i.label);
    if (label && (name.startsWith(`${label} `)) && label.length > (best ? words(best.label).length : 0)) best = i;
  }
  return best;
}

/** Upload several photos, one after another, each onto its piece (replacing any photo it had). */
export function useBulkPhotos() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ matches, onProgress }: { matches: { file: File; item: Item }[]; onProgress: (done: number) => void }) => {
      const failed: string[] = [];
      let done = 0;
      for (const m of matches) {
        try {
          await setPhoto({ itemId: m.item.id, oldPath: m.item.photo_path, file: m.file });
        } catch {
          failed.push(m.item.label);
        }
        onProgress(++done);
      }
      return { saved: matches.length - failed.length, failed };
    },
    onSuccess: ({ saved, failed }) => {
      invalidate("items", "photo-urls");
      if (failed.length) toast.error(`${saved} saved, ${failed.length} didn't upload`, { description: failed.join(", ") });
      else toast.success(`${saved} photo${saved === 1 ? "" : "s"} saved`);
    },
    onError: fail,
  });
}

/** Remove a piece for good, with its photo. Pieces with sales can't be deleted (undo the sales first). */
export function useDeletePiece() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (item: Item) => {
      const { error } = await db().from("items").delete().eq("id", item.id);
      if (error) throw error.code === "23503" ? new Error("it has sales recorded. Undo them first, or turn off For sale instead") : error;
      if (item.photo_path) await db().storage.from(BUCKET).remove([item.photo_path]);
      return item;
    },
    onSuccess: (item) => {
      invalidate("items", "market_items", "photo-urls");
      toast(`Deleted: ${item.label}`);
    },
    onError: (e) => toast.error(`Couldn't delete: ${e instanceof Error ? e.message : String(e)}`),
  });
}

export function useCreateCategory() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (name: string) => {
      const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "category";
      const id = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      const { error } = await db().from("categories").insert({ id, name: name.trim(), sort: 500 });
      if (error) throw error;
      return id;
    },
    onSuccess: () => invalidate("categories", "items"),
    onError: fail,
  });
}

export function useSaveMarket() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, fields }: { id: string | null; fields: Omit<Market, "id"> }) => {
      if (id) {
        const { error } = await db().from("markets").update(fields).eq("id", id);
        if (error) throw error;
        return id;
      }
      const { data, error } = await db().from("markets").insert(fields).select("id").single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => invalidate("markets"),
    onError: fail,
  });
}

export function useTogglePacked() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ marketId, itemIds, packed }: { marketId: string; itemIds: string[]; packed: boolean }) => {
      const q = packed
        ? db().from("market_items").upsert(itemIds.map((item_id) => ({ market_id: marketId, item_id })), { ignoreDuplicates: true })
        : db().from("market_items").delete().eq("market_id", marketId).in("item_id", itemIds);
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: () => invalidate("market_items"),
    onError: fail,
  });
}

// ---- leads ----

/** Loaded on its own so the rest of the admin keeps working if this table isn't there yet. */
export const useLeads = () => useQuery({ queryKey: ["leads"], queryFn: () => all<Lead>("leads", "*", "created_at") });

export type LeadFields = Omit<Lead, "id" | "created_at" | "updated_at">;

export function useSaveLead() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, fields }: { id: string | null; fields: Partial<LeadFields> }) => {
      if (id) {
        const { error } = await db().from("leads").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
        return id;
      }
      const { data, error } = await db().from("leads").insert(fields).select("id").single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => invalidate("leads"),
    onError: fail,
  });
}

export function useDeleteLead() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db().from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate("leads");
      toast("Lead deleted");
    },
    onError: fail,
  });
}

/** Open leads (not yet a yes or a no) with a date within the next week, or overdue. */
export const leadsDueSoon = (leads: Lead[]) =>
  leads.filter((l) => l.next_date && (l.status === "idea" || l.status === "contacted" || l.status === "talking") && daysUntil(l.next_date) <= 7);

// ---- helpers ----

/** Sales per piece, oldest first. */
export const salesByItem = (sales: Sale[]) => {
  const m = new Map<string, Sale[]>();
  for (const s of sales) m.set(s.item_id, [...(m.get(s.item_id) ?? []), s]);
  return m;
};

/** Units of a piece still to sell. */
export const unitsLeft = (item: Item, bySale: Map<string, Sale[]>) =>
  Math.max(0, (item.quantity ?? 1) - (bySale.get(item.id)?.length ?? 0));

/** Items grouped by category, in the categories' own order. */
export function groupByCategory(items: Item[]): [string, Item[]][] {
  const groups = new Map<string, { sort: number; list: Item[] }>();
  for (const i of items) {
    const name = i.categories?.name ?? "Other";
    const g = groups.get(name) ?? { sort: i.categories?.sort ?? 999, list: [] };
    g.list.push(i);
    groups.set(name, g);
  }
  return [...groups.entries()].sort((a, b) => a[1].sort - b[1].sort).map(([n, g]) => [n, g.list]);
}

export const eur = (n: number | null | undefined) =>
  n == null ? "—" : `€${Number(n).toFixed(2).replace(/\.00$/, "")}`;

export const sum = (sales: Sale[]) => sales.reduce((t, s) => t + Number(s.price_eur), 0);

/** Local date as YYYY-MM-DD. */
export const today = () => new Date().toLocaleDateString("en-CA");

/** A timestamp's local calendar day, YYYY-MM-DD. */
export const localDay = (ts: string) => new Date(ts).toLocaleDateString("en-CA");

export function daysUntil(date: string) {
  const ms = new Date(`${date}T00:00:00`).getTime() - new Date(`${today()}T00:00:00`).getTime();
  return Math.round(ms / 86_400_000);
}

export const formatDate = (date: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", opts);

export function parsePrice(v: string): number | null | "invalid" {
  const t = v.trim().replace(",", ".").replace("€", "");
  if (t === "") return null;
  const n = Number(t);
  return Number.isNaN(n) || n < 0 ? "invalid" : n;
}

export const METHODS: PayMethod[] = ["cash", "bizum", "card"];

export const channelLabel: Record<Channel, string> = { market: "Event", direct: "Direct", online: "Online" };
