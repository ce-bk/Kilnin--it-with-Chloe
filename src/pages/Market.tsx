import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase, type Item, type PayMethod, type Sale } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const EVENT = "market-2026-11-28";
const TARGET_EUR = 135;
const METHODS: PayMethod[] = ["cash", "bizum", "card"];
const eur = (n: number | null | undefined) => (n == null ? "—" : `€${Number(n).toFixed(2).replace(/\.00$/, "")}`);

function groupByDesign(items: Item[]) {
  const groups = new Map<string, Item[]>();
  for (const it of items) {
    const name = it.designs?.name ?? it.design_id;
    groups.set(name, [...(groups.get(name) ?? []), it]);
  }
  return [...groups.entries()];
}

export default function Market() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Market · Kilnin' it";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    if (!supabase) return () => meta.remove();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      data.subscription.unsubscribe();
      meta.remove();
    };
  }, []);

  if (!supabase) return <Shell><p>Supabase isn't configured (missing env vars).</p></Shell>;
  if (!ready) return <Shell><p>Loading…</p></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  return <Shell><MarketApp /></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="container mx-auto max-w-3xl px-4 py-8">{children}</main>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">Market</h1>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}

function MarketApp() {
  const qc = useQueryClient();
  const items = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase!.from("items").select("*, designs(name)").order("sort");
      if (error) throw error;
      return data as Item[];
    },
  });
  const sales = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase!.from("sales").select("*").order("sold_at");
      if (error) throw error;
      return data as Sale[];
    },
  });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["items"] });
    qc.invalidateQueries({ queryKey: ["sales"] });
  };

  if (items.isLoading || sales.isLoading) return <p>Loading…</p>;
  if (items.error || sales.error) return <p className="text-destructive">Couldn't load: {String(items.error ?? sales.error)}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Market</h1>
        <Button variant="ghost" size="sm" onClick={() => supabase!.auth.signOut()}>Sign out</Button>
      </div>
      <Tabs defaultValue="sell">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prep">Prep</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="prep"><Prep items={items.data!} onChange={refresh} /></TabsContent>
        <TabsContent value="sell"><Sell items={items.data!} sales={sales.data!} onChange={refresh} /></TabsContent>
        <TabsContent value="results"><Results items={items.data!} sales={sales.data!} /></TabsContent>
      </Tabs>
    </div>
  );
}

function Prep({ items, onChange }: { items: Item[]; onChange: () => void }) {
  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Item> }) => {
      const { error } = await supabase!.from("items").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: onChange,
  });
  const going = items.filter((i) => i.going && i.status !== "not_for_sale");
  const unpriced = going.filter((i) => i.price_eur == null).length;

  return (
    <div className="space-y-6 pt-2">
      <p className="text-sm text-muted-foreground">
        {going.length} pieces going · {unpriced} without a price
        {update.isError && <span className="text-destructive"> · Save failed: {String(update.error)}</span>}
      </p>
      {groupByDesign(items).map(([design, list]) => (
        <section key={design} className="space-y-2">
          <h2 className="font-medium">{design}</h2>
          {list.map((it) => (
            <div key={it.id} className="flex items-center gap-3 rounded-md border p-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{it.label}</p>
                {it.notes && <p className="truncate text-xs text-muted-foreground">{it.notes}</p>}
              </div>
              {it.status === "sold" && <Badge>Sold</Badge>}
              {it.status === "not_for_sale" && <Badge variant="secondary">Not for sale</Badge>}
              <Input
                aria-label={`Price for ${it.label}`}
                className="w-20"
                inputMode="decimal"
                placeholder="€"
                defaultValue={it.price_eur ?? ""}
                onBlur={(e) => {
                  const v = e.target.value.trim().replace(",", ".");
                  const price = v === "" ? null : Number(v);
                  if (price !== null && (Number.isNaN(price) || price < 0)) return;
                  if (price !== it.price_eur) update.mutate({ id: it.id, patch: { price_eur: price } });
                }}
              />
              <Switch
                aria-label={`Take ${it.label} to the market`}
                checked={it.going}
                disabled={it.status === "not_for_sale"}
                onCheckedChange={(going) => update.mutate({ id: it.id, patch: { going } })}
              />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function Sell({ items, sales, onChange }: { items: Item[]; sales: Sale[]; onChange: () => void }) {
  const [selling, setSelling] = useState<Item | null>(null);
  const [price, setPrice] = useState("");
  const [method, setMethod] = useState<PayMethod>("cash");
  const saleByItem = useMemo(() => new Map(sales.map((s) => [s.item_id, s])), [sales]);
  const eventTotal = sales.filter((s) => s.event === EVENT).reduce((t, s) => t + Number(s.price_eur), 0);
  const stall = items.filter((i) => i.going && i.status !== "not_for_sale");

  const sell = useMutation({
    mutationFn: async () => {
      const p = Number(price.replace(",", "."));
      if (!selling || Number.isNaN(p) || p < 0) throw new Error("Enter a valid price");
      const { error } = await supabase!.from("sales").insert({ item_id: selling.id, price_eur: p, method, event: EVENT, channel: "market" });
      if (error) throw error;
    },
    onSuccess: () => {
      setSelling(null);
      onChange();
    },
  });
  const undo = useMutation({
    mutationFn: async (saleId: string) => {
      const { error } = await supabase!.from("sales").delete().eq("id", saleId);
      if (error) throw error;
    },
    onSuccess: onChange,
  });

  return (
    <div className="space-y-4 pt-2">
      <div className="rounded-md border p-3">
        <p className="text-sm text-muted-foreground">Sold today</p>
        <p className="text-3xl font-semibold">{eur(eventTotal)} <span className="text-base font-normal text-muted-foreground">/ {eur(TARGET_EUR)} goal</span></p>
        <div className="mt-2 h-2 rounded bg-muted">
          <div className="h-2 rounded bg-primary" style={{ width: `${Math.min(100, (eventTotal / TARGET_EUR) * 100)}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stall.map((it) => {
          const sale = saleByItem.get(it.id);
          return (
            <div key={it.id} className={`flex flex-col justify-between rounded-md border p-3 ${sale ? "opacity-60" : ""}`}>
              <div>
                <p className="text-xs text-muted-foreground">{it.designs?.name}</p>
                <p className="text-sm font-medium leading-tight">{it.label}</p>
                <p className="mt-1 text-lg">{sale ? eur(sale.price_eur) : eur(it.price_eur)}</p>
              </div>
              {sale ? (
                <Button variant="outline" size="sm" className="mt-2" disabled={undo.isPending} onClick={() => undo.mutate(sale.id)}>
                  Sold ({sale.method}) · Undo
                </Button>
              ) : (
                <Button size="lg" className="mt-2" onClick={() => { setSelling(it); setPrice(it.price_eur?.toString() ?? ""); setMethod("cash"); sell.reset(); }}>
                  Sold
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <Dialog open={!!selling} onOpenChange={(o) => !o && setSelling(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selling?.label}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sale-price">Price paid (€)</Label>
              <Input id="sale-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} autoFocus />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <Button key={m} type="button" variant={method === m ? "default" : "outline"} onClick={() => setMethod(m)} className="capitalize">{m}</Button>
              ))}
            </div>
            {sell.isError && <p className="text-sm text-destructive">{String((sell.error as Error).message)}</p>}
          </div>
          <DialogFooter>
            <Button size="lg" className="w-full" disabled={sell.isPending || price.trim() === ""} onClick={() => sell.mutate()}>Confirm sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Results({ items, sales }: { items: Item[]; sales: Sale[] }) {
  const sold = new Set(sales.map((s) => s.item_id));
  const total = sales.reduce((t, s) => t + Number(s.price_eur), 0);
  const byMethod = METHODS.map((m) => [m, sales.filter((s) => s.method === m).reduce((t, s) => t + Number(s.price_eur), 0)] as const);
  const offered = items.filter((i) => i.going && i.status !== "not_for_sale");

  return (
    <div className="space-y-6 pt-2">
      <p className="text-sm">
        <strong>{eur(total)}</strong> from {sales.length} sales · {byMethod.map(([m, t]) => `${m} ${eur(t)}`).join(" · ")}
      </p>
      {groupByDesign(offered).map(([design, list]) => {
        const n = list.filter((i) => sold.has(i.id)).length;
        return (
          <section key={design}>
            <h2 className="font-medium">{design} <span className="text-sm text-muted-foreground">{n}/{list.length} sold</span></h2>
            <ul className="text-sm">
              {list.map((it) => (
                <li key={it.id} className={sold.has(it.id) ? "" : "text-muted-foreground"}>
                  {sold.has(it.id) ? "✓" : "–"} {it.label}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
