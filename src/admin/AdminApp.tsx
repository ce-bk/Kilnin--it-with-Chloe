import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Home as HomeIcon, LogOut, Package, ReceiptText, Store, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAdminData } from "./data";
import Home from "./Home";
import Pieces from "./Pieces";
import Sell from "./Sell";
import Markets from "./Markets";
import MarketDetail from "./MarketDetail";
import Sales from "./Sales";

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Inventory admin · Kilnin' it";
    document.documentElement.classList.add("admin-theme");
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    const cleanup = () => {
      meta.remove();
      document.documentElement.classList.remove("admin-theme");
    };
    if (!supabase) return cleanup;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      data.subscription.unsubscribe();
      cleanup();
    };
  }, []);

  if (!supabase) return <Centered><p className="text-muted-foreground">The admin isn't connected to its database yet.</p></Centered>;
  if (!ready) return <Centered><p className="text-muted-foreground">Loading…</p></Centered>;
  if (!session) return <Centered><SignIn /></Centered>;
  return <Shell />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-dvh place-items-center bg-background px-4">{children}</main>;
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) setError(error.message === "Invalid login credentials" ? "That email and password don't match. Try again." : error.message);
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-6">
      <div>
        <p className="font-serif text-lg">Kilnin' it</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Inventory admin</h1>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12" />
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="h-12 w-full rounded-xl text-base" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}

const tabs = [
  { to: "/admin", label: "Home", icon: HomeIcon, end: true },
  { to: "/admin/pieces", label: "Pieces", icon: Package },
  { to: "/admin/sell", label: "Sell", icon: Tag, primary: true },
  { to: "/admin/markets", label: "Markets", icon: Store },
  { to: "/admin/sales", label: "Sales", icon: ReceiptText },
];

function Shell() {
  const data = useAdminData();
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="min-h-dvh bg-background text-foreground md:grid md:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r bg-card/60 px-3 py-6 md:flex">
        <p className="px-3 pb-6 font-serif text-xl font-semibold">Kilnin' it</p>
        <nav className="space-y-1">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium", isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}
            >
              <t.icon className="size-4" />
              {t.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => supabase!.auth.signOut()} className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground">
          <LogOut className="size-4" /> Sign out
        </button>
      </aside>

      <main className="mx-auto w-full max-w-3xl px-4 pb-32 pt-4 md:px-8 md:pb-12 md:pt-8">
        {data.error ? (
          <p role="alert" className="rounded-xl bg-muted p-4 text-sm">Couldn't load your inventory: {data.error.message}. Check your connection and refresh.</p>
        ) : data.loading ? (
          <div className="space-y-3 pt-12" aria-label="Loading">
            {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
          </div>
        ) : (
          <Routes>
            <Route index element={<Home {...data} />} />
            <Route path="pieces" element={<Pieces {...data} />} />
            <Route path="sell" element={<Sell {...data} />} />
            <Route path="markets" element={<Markets {...data} />} />
            <Route path="markets/:id" element={<MarketDetail {...data} />} />
            <Route path="sales" element={<Sales {...data} />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        )}
      </main>

      {/* Mobile tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-2">
          {tabs.map((t) => <TabLink key={t.to} tab={t} />)}
        </div>
      </nav>
    </div>
  );
}

function TabLink({ tab }: { tab: (typeof tabs)[number] }) {
  if (tab.primary) {
    return (
      <NavLink to={tab.to} className="flex flex-col items-center gap-1 pb-2 text-[11px] font-semibold" >
        {({ isActive }) => (
          <>
            <span className={cn("-mt-5 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_6px_16px_-4px_hsl(var(--foreground)/0.45)] ring-4 ring-background transition-transform active:scale-95", isActive && "ring-[hsl(var(--highlight))]")}>
              <tab.icon className="size-6" strokeWidth={2} />
            </span>
            {tab.label}
          </>
        )}
      </NavLink>
    );
  }
  return (
    <NavLink
      to={tab.to}
      end={tab.end}
      className={({ isActive }) => cn("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium", isActive ? "text-foreground" : "text-muted-foreground")}
    >
      {({ isActive }) => (
        <>
          <tab.icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} />
          {tab.label}
        </>
      )}
    </NavLink>
  );
}

export type AdminData = ReturnType<typeof useAdminData>;
