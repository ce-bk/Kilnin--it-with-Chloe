import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { BookOpen, CalendarDays, Home as HomeIcon, IdCard, LogOut, Menu, Package, ReceiptText, Sprout, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "@/assets/kilninit-mark.png";
import { useAdminData } from "./data";
import Home from "./Home";
import Pieces from "./Pieces";
import Sell from "./Sell";
import Markets from "./Markets";
import MarketDetail from "./MarketDetail";
import Sales from "./Sales";
import Leads from "./Leads";
import Guide from "./Guide";
import Cards from "./Cards";

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
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) setError(error.message === "Invalid login credentials" ? "That email and password don't match. Try again." : error.message);
    else navigate("/admin", { replace: true }); // always start on Home after signing in
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-6">
      <div>
        <img src={logo} alt="Kilnin' it" className="mb-3 size-14" />
        <h1 className="font-display text-4xl font-semibold tracking-tight">Inventory admin</h1>
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

type TabDef = { to: string; label: string; icon: typeof HomeIcon; end?: boolean };
const tabs: TabDef[] = [
  { to: "/admin", label: "Home", icon: HomeIcon, end: true },
  { to: "/admin/pieces", label: "Pieces", icon: Package },
  { to: "/admin/sell", label: "Sell", icon: Tag },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/sales", label: "Sales", icon: ReceiptText },
  { to: "/admin/cards", label: "Cards", icon: IdCard },
  { to: "/admin/leads", label: "Leads", icon: Sprout },
  { to: "/admin/guide", label: "Guide", icon: BookOpen },
];

/** The menu: the same list on the desktop sidebar and in the phone's slide-out menu. */
function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <nav className="space-y-1">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            onClick={onNavigate}
            className={({ isActive }) => cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-base font-medium md:min-h-9 md:text-sm", isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}
          >
            <t.icon className="size-5 md:size-4" />
            {t.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => supabase!.auth.signOut()} className="mt-auto flex min-h-11 items-center gap-3 rounded-lg px-3 text-base text-muted-foreground hover:bg-muted/60 hover:text-foreground md:min-h-9 md:text-sm">
        <LogOut className="size-5 md:size-4" /> Sign out
      </button>
    </>
  );
}

export function Shell() {
  const data = useAdminData();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const current = [...tabs].sort((a, b) => b.to.length - a.to.length).find((t) => (t.end ? pathname === t.to : pathname.startsWith(t.to)));

  return (
    <div className="min-h-dvh bg-background text-foreground md:grid md:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r bg-card/60 px-3 py-6 md:flex">
        <p className="flex items-center gap-2 px-3 pb-6 font-display text-xl font-semibold"><img src={logo} alt="" className="size-8" />Kilnin' it</p>
        <NavList />
      </aside>

      {/* Phone top bar with the menu button */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-card/95 px-2 backdrop-blur md:hidden">
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="grid size-11 place-items-center rounded-lg hover:bg-muted">
          <Menu className="size-6" />
        </button>
        <img src={logo} alt="" className="size-7" />
        <span className="font-display text-lg font-semibold">{current?.label ?? "Kilnin' it"}</span>
      </header>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="admin-theme flex w-72 flex-col bg-background px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
          <SheetTitle className="flex items-center gap-2 px-3 pb-4 font-display text-xl font-semibold"><img src={logo} alt="" className="size-8" />Kilnin' it</SheetTitle>
          <SheetDescription className="sr-only">Go to a page</SheetDescription>
          <NavList onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-4 md:px-8 md:pb-12 md:pt-8">
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
            <Route path="events" element={<Markets {...data} />} />
            <Route path="events/:id" element={<MarketDetail {...data} />} />
            <Route path="sales" element={<Sales {...data} />} />
            <Route path="leads" element={<Leads {...data} />} />
            <Route path="guide" element={<Guide />} />
            <Route path="cards" element={<Cards {...data} />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        )}
      </main>

    </div>
  );
}

export type AdminData = ReturnType<typeof useAdminData>;
