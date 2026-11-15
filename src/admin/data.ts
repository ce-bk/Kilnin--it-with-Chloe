import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase, type Channel, type Design, type Item, type Market, type MarketItem, type PayMethod, type Sale } from "@/lib/supabase";

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

export const useItems = () => useQuery({ queryKey: ["items"], queryFn: () => all<Item>("items", "*, designs(name, site_piece_id)", "sort") });
export const useDesigns = () => useQuery({ queryKey: ["designs"], queryFn: () => all<Design>("designs", "*", "name") });
export const useSales = () => useQuery({ queryKey: ["sales"], queryFn: () => all<Sale>("sales", "*", "sold_at") });
export const useMarkets = () => useQuery({ queryKey: ["markets"], queryFn: () => all<Market>("markets", "*", "date") });
export const useMarketItems = () => useQuery({ queryKey: ["market_items"], queryFn: () => all<MarketItem>("market_items") });

/** Everything the admin needs, loaded together. Data is small (one maker's inventory). */
export function useAdminData() {
  const items = useItems();
  const designs = useDesigns();
  const sales = useSales();
  const markets = useMarkets();
  const marketItems = useMarketItems();
  const qs = [items, designs, sales, markets, marketItems];
  return {
    loading: qs.some((q) => q.isLoading),
    error: qs.find((q) => q.error)?.error as Error | undefined,
    items: items.data ?? [],
    designs: designs.data ?? [],
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

export type ItemPatch = Partial<Pick<Item, "label" | "price_eur" | "status" | "notes" | "design_id">>;

export function useSaveItem() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string | null; patch: ItemPatch }) => {
      const q = id
        ? db().from("items").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id)
        : db().from("items").insert({ ...patch, sort: 1000 });
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: () => invalidate("items"),
    onError: fail,
  });
}

export function useCreateDesign() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (name: string) => {
      const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "design";
      const id = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      const { error } = await db().from("designs").insert({ id, name: name.trim() });
      if (error) throw error;
      return id;
    },
    onSuccess: () => invalidate("designs"),
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

// ---- helpers ----

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

export const channelLabel: Record<Channel, string> = { market: "Market", direct: "Direct", online: "Online" };
