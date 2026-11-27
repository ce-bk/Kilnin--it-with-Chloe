import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** Null when the env vars are missing (e.g. in CI), so the public site never breaks. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

export type ItemStatus = "available" | "sold" | "not_for_sale";
export type PayMethod = "cash" | "bizum" | "card" | "other";
export type Channel = "market" | "online" | "direct";

export interface Category {
  id: string;
  name: string;
  sort: number;
}

export interface Item {
  id: string;
  category_id: string;
  site_piece_id: string | null;
  photo_path: string | null;
  /** Signed link to the uploaded photo, added by the admin after loading. */
  photo_url?: string;
  label: string;
  price_eur: number | null;
  /** What the piece is worth with the maker's time counted; shown next to the sale price. */
  valued_eur: number | null;
  status: ItemStatus;
  /** How many identical units this entry stands for; each sale is one unit. */
  quantity: number;
  notes: string | null;
  sort: number;
  categories: { name: string; sort: number } | null;
}

export interface Sale {
  id: string;
  item_id: string;
  price_eur: number;
  method: PayMethod;
  channel: Channel;
  market_id: string | null;
  sold_at: string;
  notes: string | null;
}

/** An event (market, fair, pop-up…). Stored in the `markets` table. */
export interface Market {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  location: string | null;
  goal_eur: number | null;
}

export interface MarketItem {
  market_id: string;
  item_id: string;
}

export type LeadKind = "event" | "collab";
export type LeadStatus = "idea" | "contacted" | "talking" | "yes" | "no";

/** An event to explore or a place/person to collaborate with, before anything is booked. */
export interface Lead {
  id: string;
  name: string;
  kind: LeadKind;
  type: string | null;
  status: LeadStatus;
  place: string | null;
  contact: string | null;
  link: string | null;
  next_step: string | null;
  next_date: string | null; // YYYY-MM-DD
  notes: string | null;
  market_id: string | null;
  created_at: string;
  updated_at: string;
}
