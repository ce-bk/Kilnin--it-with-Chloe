import { describe, expect, it } from "vitest";
import type { Item, Sale } from "@/lib/supabase";
import { eur, groupByCategory, parsePrice, salesByItem, sum, unitsLeft } from "./data";

const item = (over: Partial<Item> = {}): Item => ({
  id: "a", category_id: "bowls", site_piece_id: null, photo_path: null, label: "Bowl", price_eur: 20,
  status: "available", quantity: 1, notes: null, sort: 0, categories: { name: "Bowls", sort: 40 }, ...over,
});
const sale = (item_id: string, price_eur = 20): Sale => ({
  id: Math.random().toString(36), item_id, price_eur, method: "cash", channel: "market", market_id: null, sold_at: "2026-11-28T10:00:00Z", notes: null,
});

describe("parsePrice", () => {
  it("accepts whole numbers, decimals with a comma or a point, and a euro sign", () => {
    expect(parsePrice("18")).toBe(18);
    expect(parsePrice("12,50")).toBe(12.5);
    expect(parsePrice("€9.99")).toBe(9.99);
  });
  it("treats an empty box as no price", () => expect(parsePrice("  ")).toBeNull());
  it("rejects text and negative numbers", () => {
    expect(parsePrice("abc")).toBe("invalid");
    expect(parsePrice("-3")).toBe("invalid");
  });
});

describe("units left", () => {
  it("counts down one per sale and never below zero", () => {
    const holders = item({ id: "ph", quantity: 6 });
    expect(unitsLeft(holders, salesByItem([]))).toBe(6);
    expect(unitsLeft(holders, salesByItem([sale("ph"), sale("ph")]))).toBe(4);
    expect(unitsLeft(item({ id: "x" }), salesByItem([sale("x"), sale("x")]))).toBe(0);
  });
});

describe("helpers", () => {
  it("groups pieces by category in the categories' order", () => {
    const groups = groupByCategory([
      item({ id: "1", categories: { name: "Bowls", sort: 40 } }),
      item({ id: "2", categories: { name: "Lamps", sort: 10 } }),
    ]);
    expect(groups.map(([name]) => name)).toEqual(["Lamps", "Bowls"]);
  });
  it("adds up sales and formats euros", () => {
    expect(sum([sale("a", 18), sale("b", 12.5)])).toBe(30.5);
    expect(eur(30)).toBe("€30");
    expect(eur(12.5)).toBe("€12.50");
    expect(eur(null)).toBe("—");
  });
});
