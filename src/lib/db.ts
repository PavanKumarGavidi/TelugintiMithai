import { seedDB } from "./seed";
import { STATUS_FLOW, type DB, type Order, type OrderStatus } from "./types";

const KEY = "tm_db_v3";

/**
 * Data access layer. Every read/write goes through this module so the
 * persistence engine can be swapped (e.g. for Supabase/Postgres) without
 * touching UI code. Orders are never held in component state alone.
 */
export function loadDB(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed && parsed.v === 3 && Array.isArray(parsed.products) && parsed.products.length > 0) {
        return parsed;
      }
    }
  } catch {
    /* corrupted store — reseed */
  }
  const fresh = seedDB();
  saveDB(fresh);
  return fresh;
}

export function saveDB(db: DB) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* storage full — keep running in-memory */
  }
}

/* Time thresholds (ms) for the live kitchen simulation */
const SIM_STAGES = [0, 45_000, 150_000, 300_000, 480_000];

/** Effective status: admin decisions win; otherwise the kitchen progresses on a timer. */
export function effStatus(order: Order, now: number = Date.now()): OrderStatus {
  if (order.adminSet || order.status === "Cancelled" || order.status === "Delivered") return order.status;
  const elapsed = now - order.createdAt;
  let idx = 0;
  for (let i = 0; i < SIM_STAGES.length; i++) if (elapsed >= SIM_STAGES[i]) idx = i;
  return STATUS_FLOW[idx];
}

export function newOrderId(existing: Order[]): string {
  for (let tries = 0; tries < 50; tries++) {
    const id = `TM2026${String(10000 + Math.floor(Math.random() * 89999))}`;
    if (!existing.some((o) => o.id === id)) return id;
  }
  return `TM2026${Date.now() % 100000}`;
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function timeAgo(ts: number, now: number = Date.now()): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}

export function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(ts: number): string {
  return new Date(ts).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
