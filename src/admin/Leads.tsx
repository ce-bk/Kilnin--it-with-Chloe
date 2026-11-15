import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookOpen, ChevronRight, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Lead, LeadKind, LeadStatus } from "@/lib/supabase";
import type { AdminData } from "./AdminApp";
import { daysUntil, formatDate, useDeleteLead, useLeads, useSaveLead, type LeadFields } from "./data";
import { Chips, MarketSheet, Sheet } from "./sheets";
import { Empty, PageHeader, Segmented } from "./ui";

const statusMeta: Record<LeadStatus, { label: string; hint: string }> = {
  idea: { label: "To explore", hint: "Found it, haven't reached out yet" },
  contacted: { label: "Reached out", hint: "Waiting to hear back" },
  talking: { label: "Talking", hint: "In conversation, working out details" },
  yes: { label: "It's on", hint: "Agreed or booked" },
  no: { label: "Not now", hint: "Not a fit, or maybe later" },
};
const ORDER: LeadStatus[] = ["talking", "contacted", "idea", "yes", "no"];

const kindLabel: Record<LeadKind, string> = { event: "Event", collab: "Collaboration" };

const TYPE_SUGGESTIONS = [
  "Community market", "Neighbourhood festival", "Pop-up", "Shared stall", "Design market",
  "Café", "Restaurant", "Florist", "Plant shop", "Concept store", "Lighting / interiors shop", "Pottery studio", "Other maker",
];

type Filter = "all" | LeadKind;

export default function Leads({ markets }: AdminData) {
  const leads = useLeads();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<{ lead: Lead | null; preset?: Partial<LeadFields> } | null>(null);

  // The guide's "Add as lead" buttons arrive here as ?add=1&kind=…&type=…
  useEffect(() => {
    if (params.get("add")) {
      const kind = params.get("kind") === "event" ? "event" : "collab";
      setOpen({ lead: null, preset: { kind, type: params.get("type") || null } });
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const list = (leads.data ?? []).filter((l) => filter === "all" || l.kind === filter);
  const groups = ORDER.map((s) => [s, sortLeads(list.filter((l) => l.status === s))] as const).filter(([, ls]) => ls.length);
  const openCount = (leads.data ?? []).filter((l) => l.status !== "yes" && l.status !== "no").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        sub={leads.data?.length ? `${openCount} open · events to explore and people to work with` : "Events to explore and people to work with"}
        action={<Button className="h-11 rounded-xl" onClick={() => setOpen({ lead: null })}><Plus /> New lead</Button>}
      />

      <Link to="/admin/guide" className="flex items-center gap-3 rounded-2xl border bg-card p-4 hover:bg-muted/50">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[hsl(var(--highlight))] text-foreground"><BookOpen className="size-5" /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium">How this works</span>
          <span className="block text-sm text-muted-foreground">The steps, where to look, and messages to copy</span>
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>

      <Segmented<Filter>
        value={filter}
        onChange={setFilter}
        options={[{ value: "all", label: "All" }, { value: "collab", label: "Collabs" }, { value: "event", label: "Events" }]}
      />

      {leads.error ? (
        <p role="alert" className="rounded-xl bg-muted p-4 text-sm">Leads aren't set up in the database yet. They'll appear once the update is live.</p>
      ) : leads.isLoading ? (
        <div className="h-16 animate-pulse rounded-xl bg-muted" aria-label="Loading" />
      ) : groups.length === 0 ? (
        <Empty>No leads yet. Open <Link to="/admin/guide" className="underline">How this works</Link> for ideas, or add one.</Empty>
      ) : (
        groups.map(([status, ls]) => (
          <section key={status}>
            <h2 className="mb-2 flex items-baseline gap-2 text-xl font-semibold">
              {statusMeta[status].label}
              <span className="text-sm font-normal text-muted-foreground">{ls.length}</span>
            </h2>
            <ul className="divide-y rounded-2xl border bg-card">
              {ls.map((l) => <LeadRow key={l.id} lead={l} onOpen={() => setOpen({ lead: l })} />)}
            </ul>
          </section>
        ))
      )}

      <LeadSheet
        open={!!open}
        lead={open?.lead ?? null}
        preset={open?.preset}
        hasEvent={!!open?.lead?.market_id && markets.some((m) => m.id === open.lead!.market_id)}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

/** Soonest date first; leads without a date after. */
function sortLeads(ls: Lead[]) {
  return [...ls].sort((a, b) => (a.next_date ?? "9999").localeCompare(b.next_date ?? "9999") || a.name.localeCompare(b.name));
}

function When({ date, open }: { date: string; open: boolean }) {
  const d = daysUntil(date);
  const label = formatDate(date, { day: "numeric", month: "short" });
  if (!open) return <span>{label}</span>;
  if (d < 0) return <span className="font-semibold text-destructive">Overdue · {label}</span>;
  if (d === 0) return <span className="font-semibold text-foreground">Today</span>;
  if (d <= 7) return <span className="font-semibold text-foreground">{d === 1 ? "Tomorrow" : `In ${d} days`} · {label}</span>;
  return <span>{label}</span>;
}

function LeadRow({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  const isOpen = lead.status !== "yes" && lead.status !== "no";
  return (
    <li>
      <button type="button" onClick={onOpen} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/50">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{lead.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {[lead.type ?? kindLabel[lead.kind], lead.place].filter(Boolean).join(" · ")}
          </p>
          {(lead.next_step || lead.next_date) && (
            <p className="mt-1 line-clamp-2 text-sm">
              {lead.next_date && <><When date={lead.next_date} open={isOpen} />{lead.next_step && " · "}</>}
              {lead.next_step}
            </p>
          )}
        </div>
        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
      </button>
    </li>
  );
}

const empty: LeadFields = {
  name: "", kind: "collab", type: null, status: "idea", place: null, contact: null, link: null,
  next_step: null, next_date: null, notes: null, market_id: null,
};

function LeadSheet({ open, lead, preset, hasEvent, onClose }: { open: boolean; lead: Lead | null; preset?: Partial<LeadFields>; hasEvent: boolean; onClose: () => void }) {
  const [f, setF] = useState<LeadFields>(empty);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [makingEvent, setMakingEvent] = useState(false);
  const save = useSaveLead();
  const del = useDeleteLead();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setF(lead ? { ...empty, ...lead } : { ...empty, ...preset });
    setConfirmDelete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lead]);

  const set = <K extends keyof LeadFields>(k: K, v: LeadFields[K]) => setF((p) => ({ ...p, [k]: v }));
  const text = (k: "type" | "place" | "contact" | "link" | "next_step" | "notes") => ({
    value: f[k] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value || null),
  });
  const clean = (): LeadFields => {
    const t = (v: string | null) => v?.trim() || null;
    return { ...f, name: f.name.trim(), type: t(f.type), place: t(f.place), contact: t(f.contact), link: t(f.link), next_step: t(f.next_step), notes: t(f.notes) };
  };
  const href = f.link && (/^https?:\/\//.test(f.link) ? f.link : `https://${f.link}`);

  return (
    <>
      <Sheet open={open && !makingEvent} onClose={onClose} title={lead ? lead.name : "New lead"} description={lead ? statusMeta[lead.status].hint : "An event to explore or someone to work with"}>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!f.name.trim()) return;
            await save.mutateAsync({ id: lead?.id ?? null, fields: clean() });
            onClose();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="l-name">Name</Label>
            <Input id="l-name" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Café on my street, Gràcia festival" required className="h-12" />
          </div>
          <div className="space-y-2">
            <Label>What is it</Label>
            <Chips<LeadKind> label="What is it" value={f.kind} onChange={(v) => set("kind", v)} options={[{ value: "collab", label: "Collaboration" }, { value: "event", label: "Event" }]} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="l-type">Type</Label>
            <Input id="l-type" list="lead-types" {...text("type")} placeholder="e.g. Café, Florist, Community market" className="h-12" />
            <datalist id="lead-types">{TYPE_SUGGESTIONS.map((t) => <option key={t} value={t} />)}</datalist>
          </div>
          <div className="space-y-2">
            <Label htmlFor="l-status">Where it's at</Label>
            <select
              id="l-status"
              value={f.status}
              onChange={(e) => set("status", e.target.value as LeadStatus)}
              className="h-12 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
            >
              {(["idea", "contacted", "talking", "yes", "no"] as LeadStatus[]).map((s) => (
                <option key={s} value={s}>{statusMeta[s].label}: {statusMeta[s].hint.toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="l-next">Next step</Label>
            <Input id="l-next" {...text("next_step")} placeholder="e.g. Drop by Tuesday morning with a cup" className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="l-date">By when</Label>
            <Input id="l-date" type="date" value={f.next_date ?? ""} onChange={(e) => set("next_date", e.target.value || null)} className="h-12" />
            <p className="text-xs text-muted-foreground">A follow-up, a visit or an application deadline. It shows on Home when it's close.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="l-place">Place</Label>
              <Input id="l-place" {...text("place")} placeholder="Neighbourhood or address" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l-contact">Contact</Label>
              <Input id="l-contact" {...text("contact")} placeholder="@instagram, email, name" className="h-12" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="l-link">Link</Label>
            <div className="flex gap-2">
              <Input id="l-link" inputMode="url" {...text("link")} placeholder="Website or Instagram" className="h-12" />
              {href && (
                <a href={href} target="_blank" rel="noreferrer" className="grid size-12 shrink-0 place-items-center rounded-md border hover:bg-muted" aria-label="Open link">
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="l-notes">Notes</Label>
            <Textarea id="l-notes" {...text("notes")} rows={3} placeholder="Who you spoke to, what they said, commission, dates…" />
          </div>

          {lead && f.kind === "event" && f.status === "yes" && (
            hasEvent ? (
              <Button type="button" variant="outline" className="h-12 w-full rounded-xl" onClick={() => navigate(`/admin/events/${lead.market_id}`)}>Open this event</Button>
            ) : (
              <Button type="button" variant="outline" className="h-12 w-full rounded-xl" onClick={() => setMakingEvent(true)}>Add to my events</Button>
            )
          )}

          <Button type="submit" className="h-12 w-full rounded-xl" disabled={save.isPending}>{save.isPending ? "Saving…" : lead ? "Save" : "Add lead"}</Button>

          {lead && (
            <div className="pt-1 text-center">
              {confirmDelete ? (
                <p className="flex items-center justify-center gap-3 text-sm">
                  Delete this lead?
                  <button type="button" className="font-semibold text-destructive underline underline-offset-4" disabled={del.isPending} onClick={() => del.mutate(lead.id, { onSuccess: onClose })}>Yes, delete</button>
                  <button type="button" className="underline underline-offset-4" onClick={() => setConfirmDelete(false)}>Keep</button>
                </p>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Delete lead</button>
              )}
            </div>
          )}
        </form>
      </Sheet>

      {lead && (
        <MarketSheet
          market={null}
          open={makingEvent}
          initial={{ name: f.name, date: f.next_date ?? undefined, location: f.place }}
          onClose={() => setMakingEvent(false)}
          onSaved={async (id) => {
            await save.mutateAsync({ id: lead.id, fields: { ...clean(), market_id: id } });
            onClose();
            navigate(`/admin/events/${id}?tab=pack`);
          }}
        />
      )}
    </>
  );
}

