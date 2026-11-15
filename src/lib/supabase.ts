import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** Null when the env vars are missing (e.g. in CI), so the public site never breaks. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

export type ItemStatus = "available" | "sold" | "not_for_sale";
export type PayMethod = "cash" | "bizum" | "card" | "other";

export interface Item {
  id: string;
  design_id: string;
  label: string;
  price_eur: number | null;
  going: boolean;
  status: ItemStatus;
  notes: string | null;
  sort: number;
  designs: { name: string } | null;
}

export interface Sale {
  id: string;
  item_id: string;
  price_eur: number;
  method: PayMethod;
  event: string | null;
  sold_at: string;
}
