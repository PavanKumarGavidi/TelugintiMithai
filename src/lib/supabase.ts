import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { DB, LedgerMonth, Offer, Order, Product, Review } from "./types";

/**
 * Supabase bridge.
 *
 * The app is "local-first": it always works offline via the localStorage
 * store. When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided
 * (see .env.example + supabase/schema.sql), every read is enriched from
 * Postgres and every write is mirrored to it in the background.
 */

const URL = import.meta.env.VITE_SUPABASE_URL;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function sbEnabled(): boolean {
  return Boolean(URL && ANON);
}

function getClient(): SupabaseClient | null {
  if (!sbEnabled()) return null;
  if (!client) client = createClient(URL!, ANON!);
  return client;
}

/* ---------------- row <-> model mapping ---------------- */

type ProductRow = Omit<Product, "desc"> & { desc: string };

function productToRow(p: Product): ProductRow {
  return { ...p };
}
function rowToProduct(r: Record<string, unknown>): Product {
  return { ...(r as unknown as Product) };
}

function orderToRow(o: Order) {
  return {
    id: o.id,
    created_at: new Date(o.createdAt).toISOString(),
    name: o.name,
    phone: o.phone,
    email: o.email,
    address: o.address,
    landmark: o.landmark,
    city: o.city,
    pincode: o.pincode,
    instructions: o.instructions,
    items: o.items,
    subtotal: o.subtotal,
    discount: o.discount,
    delivery: o.delivery,
    total: o.total,
    payment: o.payment,
    status: o.status,
    admin_set: o.adminSet,
  };
}
function rowToOrder(r: Record<string, unknown>): Order {
  const x = r as Record<string, unknown>;
  return {
    id: String(x.id),
    createdAt: new Date(String(x.created_at)).getTime(),
    name: String(x.name),
    phone: String(x.phone),
    email: String(x.email ?? ""),
    address: String(x.address ?? ""),
    landmark: String(x.landmark ?? ""),
    city: String(x.city ?? ""),
    pincode: String(x.pincode ?? ""),
    instructions: String(x.instructions ?? ""),
    items: (x.items as Order["items"]) ?? [],
    subtotal: Number(x.subtotal),
    discount: Number(x.discount),
    delivery: Number(x.delivery),
    total: Number(x.total),
    payment: x.payment as Order["payment"],
    status: x.status as Order["status"],
    adminSet: Boolean(x.admin_set),
  };
}

function offerToRow(o: Offer) {
  return { id: 1, title: o.title, code: o.code, pct: o.pct, start: o.start, end: o.end, active: o.active };
}
function rowToOffer(r: Record<string, unknown>): Offer {
  return {
    title: String(r.title),
    code: String(r.code),
    pct: Number(r.pct),
    start: String(r.start),
    end: String(r.end),
    active: Boolean(r.active),
  };
}

export interface RemoteSnapshot {
  products: Product[] | null;
  orders: Order[] | null;
  reviews: Review[] | null;
  offer: Offer | null;
  ledger: LedgerMonth[] | null;
}

/* ---------------- pull ---------------- */

export async function sbPullAll(): Promise<RemoteSnapshot | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const [p, o, r, of, l] = await Promise.all([
      c.from("products").select("*").order("id"),
      c.from("orders").select("*").order("created_at", { ascending: false }),
      c.from("reviews").select("*"),
      c.from("offers").select("*").eq("id", 1).maybeSingle(),
      c.from("ledger").select("*").order("m"),
    ]);
    return {
      products: p.error ? null : ((p.data ?? []) as Record<string, unknown>[]).map(rowToProduct),
      orders: o.error ? null : ((o.data ?? []) as Record<string, unknown>[]).map(rowToOrder),
      reviews: r.error ? null : ((r.data ?? []) as unknown as Review[]),
      offer: of.error || !of.data ? null : rowToOffer(of.data as Record<string, unknown>),
      ledger: l.error ? null : ((l.data ?? []) as unknown as LedgerMonth[]),
    };
  } catch {
    return null;
  }
}

/* ---------------- push (debounced, whole-collection upsert) ---------------- */

let pushTimer: number | null = null;
let lastSnapshot = "";

export function sbPushAll(db: DB) {
  const c = getClient();
  if (!c) return;
  if (pushTimer) window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(async () => {
    const snapshot = JSON.stringify([db.products, db.orders, db.reviews, db.offer, db.ledger]);
    if (snapshot === lastSnapshot) return;
    lastSnapshot = snapshot;
    try {
      await Promise.all([
        c.from("products").upsert(db.products.map(productToRow), { onConflict: "id" }),
        c.from("orders").upsert(db.orders.map(orderToRow), { onConflict: "id" }),
        c.from("reviews").upsert(db.reviews, { onConflict: "id" }),
        c.from("offers").upsert([offerToRow(db.offer)], { onConflict: "id" }),
        c.from("ledger").upsert(db.ledger, { onConflict: "m" }),
      ]);
    } catch {
      /* offline — local store keeps the data; next change retries */
    }
  }, 600);
}

/** Force the next push even if the snapshot looks unchanged (used after login). */
export function sbInvalidateSnapshot() {
  lastSnapshot = "";
}

/* ---------------- auth ---------------- */

export async function sbSignIn(
  email: string,
  password: string,
): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const c = getClient();
  if (!c) return { ok: false, error: "Supabase is not configured" };
  try {
    const { data, error } = await c.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return { ok: false, error: error?.message ?? "Invalid login credentials" };
    }
    return { ok: true, email: data.session.user.email ?? email };
  } catch {
    return { ok: false, error: "Network error — could not reach Supabase" };
  }
}

export async function sbSignOut() {
  const c = getClient();
  if (c) await c.auth.signOut().catch(() => undefined);
}

export async function sbHasSession(): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try {
    const { data } = await c.auth.getSession();
    return Boolean(data.session);
  } catch {
    return false;
  }
}

export function sbOnAuthChange(cb: (hasSession: boolean) => void): () => void {
  const c = getClient();
  if (!c) return () => undefined;
  const { data } = c.auth.onAuthStateChange((_event, session) => cb(Boolean(session)));
  return () => data.subscription.unsubscribe();
}
