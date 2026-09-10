import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  IconChevronDown,
  IconCopy,
  IconEye,
  IconEyeOff,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
  Reveal,
  Stars,
} from "../components/ui";
import { effStatus, fmtDate, fmtDateTime, inr, timeAgo } from "../lib/db";
import { IMG } from "../lib/seed";
import { useStore } from "../lib/store";
import {
  ALL_STATUSES,
  CATEGORIES,
  type Category,
  type Order,
  type OrderStatus,
  type Product,
  type ProductTag,
} from "../lib/types";
import { StatusChip } from "../pages/OrderPages";

const inputCls =
  "w-full border border-gold-500/40 bg-cream-100 rounded-xl px-3.5 py-2.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-saffron-500/50";

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-12 h-7 rounded-full transition-colors ${on ? "bg-leaf-600" : "bg-ink-400/40"}`}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-cream-50 shadow transition-all ${on ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

/* ================= ORDERS ================= */
export function OrdersPanel() {
  const { orders, setOrderStatus, toast } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [open, setOpen] = useState<string | null>(null);
  const now = Date.now();

  const list = useMemo(() => {
    let l = orders;
    if (filter !== "all") l = l.filter((o) => effStatus(o, now) === filter);
    const s = q.trim().toLowerCase();
    if (s) l = l.filter((o) => (o.id + " " + o.name + " " + o.phone).toLowerCase().includes(s));
    return l;
  }, [orders, filter, q, now]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order ID, name or phone…" className={`${inputCls} sm:max-w-xs`} />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className={`${inputCls} sm:max-w-[220px]`}>
          <option value="all">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="ml-auto self-center text-sm font-bold text-ink-500">{list.length} orders</span>
      </div>

      <div className="bg-cream-50 border border-gold-500/30 rounded-2xl overflow-hidden">
        {list.slice(0, 40).map((o) => (
          <OrderRow
            key={o.id}
            o={o}
            now={now}
            open={open === o.id}
            onToggle={() => setOpen(open === o.id ? null : o.id)}
            onStatus={(s) => {
              setOrderStatus(o.id, s);
              toast(`${o.id} → ${s}`);
            }}
          />
        ))}
        {list.length === 0 && <p className="p-8 text-center text-ink-500 font-semibold">No orders match.</p>}
      </div>
    </div>
  );
}

function OrderRow({ o, now, open, onToggle, onStatus }: { o: Order; now: number; open: boolean; onToggle: () => void; onStatus: (s: OrderStatus) => void }) {
  const status = effStatus(o, now);
  return (
    <div className="border-b border-gold-500/15 last:border-0">
      <button onClick={onToggle} className="w-full grid grid-cols-[1fr_auto] sm:grid-cols-[130px_1fr_100px_110px_170px_24px] items-center gap-3 px-5 py-4 text-left hover:bg-cream-100/70 transition-colors">
        <span>
          <span className="font-display text-maroon-700">#{o.id}</span>
          <span className="block text-[11px] font-semibold text-ink-400">{timeAgo(o.createdAt, now)} · {fmtDateTime(o.createdAt)}</span>
        </span>
        <span className="hidden sm:block min-w-0">
          <span className="block font-bold text-ink-900 truncate">{o.name}</span>
          <span className="block text-[12px] text-ink-500 font-medium">{o.phone}</span>
        </span>
        <span className="hidden sm:block text-sm font-bold tabular-nums text-ink-900">{inr(o.total)}</span>
        <span className="hidden sm:block text-[12px] font-semibold text-ink-500">{o.payment}</span>
        <span className="col-start-2 sm:col-start-auto"><StatusChip status={status} /></span>
        <IconChevronDown size={17} className={`text-ink-400 transition-transform duration-300 justify-self-end ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[500px]" : "max-h-0"}`}>
        <div className="px-5 pb-5 grid md:grid-cols-3 gap-5">
          <div className="bg-cream-100 rounded-xl p-4">
            <p className="text-[12px] font-extrabold uppercase tracking-wider text-ink-400 mb-2">Items</p>
            <ul className="space-y-1.5 text-sm">
              {o.items.map((it) => (
                <li key={it.id} className="flex justify-between text-ink-700">
                  <span>{it.name} × {it.qty} <span className="text-ink-400">({it.unit})</span></span>
                  <span className="font-semibold tabular-nums">{inr(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 pt-2 border-t border-dashed border-gold-500/40 text-sm flex justify-between font-bold text-maroon-800">
              <span>Total (incl. delivery {o.delivery === 0 ? "FREE" : inr(o.delivery)}, −{inr(o.discount)} off)</span>
              <span className="tabular-nums">{inr(o.total)}</span>
            </p>
          </div>
          <div className="bg-cream-100 rounded-xl p-4 text-sm space-y-1.5 text-ink-700">
            <p className="text-[12px] font-extrabold uppercase tracking-wider text-ink-400 mb-2">Delivery</p>
            <p className="font-bold">{o.name} · {o.phone}</p>
            <p>{o.address}{o.landmark ? `, near ${o.landmark}` : ""}, {o.city} — {o.pincode}</p>
            {o.email && <p>{o.email}</p>}
            {o.instructions && <p className="text-saffron-700 font-semibold">Note: {o.instructions}</p>}
          </div>
          <div className="bg-cream-100 rounded-xl p-4">
            <p className="text-[12px] font-extrabold uppercase tracking-wider text-ink-400 mb-2">Update status</p>
            <select
              value={status}
              onChange={(e) => onStatus(e.target.value as OrderStatus)}
              className={inputCls}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <p className="text-[12px] text-ink-400 font-medium mt-2">
              Changing status notifies the customer's tracking page instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= PRODUCTS ================= */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = 480;
        const canvas = document.createElement("canvas");
        canvas.width = S;
        canvas.height = S;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas"));
        const scale = Math.max(S / img.width, S / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("img"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
}

const PRESET_IMGS = Object.values(IMG);
const TAGS: (ProductTag | "")[] = ["", "Bestseller", "Signature", "New", "Chef's Pick"];

function ProductModal({ initial, onClose }: { initial: Product | null; onClose: () => void }) {
  const { upsertProduct, toast } = useStore();
  const [f, setF] = useState<Product>(
    initial ?? {
      id: `p${Date.now()}`,
      name: "",
      telugu: "",
      desc: "",
      price: 200,
      unit: "500 g",
      category: "sweets",
      img: PRESET_IMGS[0],
      rating: 4.6,
      reviews: 0,
      available: true,
    },
  );
  const [busy, setBusy] = useState(false);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(file);
      setF((p) => ({ ...p, img: url }));
      toast("Image uploaded ✓");
    } catch {
      toast("Couldn't read that image", "warn");
    } finally {
      setBusy(false);
    }
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || f.price <= 0) {
      toast("Name and a valid price are required", "warn");
      return;
    }
    upsertProduct({ ...f, name: f.name.trim() });
    toast(initial ? `${f.name} updated` : `${f.name} added to menu`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] bg-maroon-950/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-cream-50 rounded-2xl border border-gold-500/30 shadow-warm w-full max-w-2xl my-8 pop-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/25">
          <h2 className="font-display text-2xl text-maroon-800">{initial ? "Edit Product" : "Add Product"}</h2>
          <button type="button" onClick={onClose} className="text-ink-500 hover:text-maroon-700" aria-label="Close"><IconX size={20} /></button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <label className="sm:col-span-2">
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Name *</span>
            <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inputCls} placeholder="Bellam Garelu" />
          </label>
          <label>
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Telugu name</span>
            <input value={f.telugu} onChange={(e) => setF({ ...f, telugu: e.target.value })} className={inputCls} placeholder="బెల్లం గారెలు" />
          </label>
          <label>
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Category</span>
            <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Description</span>
            <textarea value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
          </label>
          <label>
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Price (₹) *</span>
            <input type="number" min={1} value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} className={inputCls} />
          </label>
          <label>
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Weight / quantity</span>
            <input value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} className={inputCls} placeholder="500 g / 6 pieces" />
          </label>
          <label>
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Tag</span>
            <select value={f.tag ?? ""} onChange={(e) => setF({ ...f, tag: (e.target.value || undefined) as ProductTag | undefined })} className={inputCls}>
              {TAGS.map((t) => (
                <option key={t} value={t}>{t || "— none —"}</option>
              ))}
            </select>
          </label>
          <div>
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Image</span>
            <div className="flex items-center gap-3">
              <img src={f.img} alt="" className="w-16 h-16 rounded-xl object-cover border border-gold-500/40" />
              <label className="cursor-pointer text-sm font-bold text-maroon-700 border-2 border-dashed border-gold-500/60 rounded-xl px-4 py-2.5 hover:bg-cream-100 transition-colors">
                {busy ? "Processing…" : "Upload image"}
                <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={busy} />
              </label>
            </div>
            <div className="mt-2.5 grid grid-cols-8 gap-1.5">
              {PRESET_IMGS.map((src) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setF({ ...f, img: src })}
                  className={`rounded-lg overflow-hidden border-2 aspect-square ${f.img === src ? "border-saffron-500" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gold-500/25 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="font-bold text-ink-500 px-5 py-2.5 hover:text-maroon-700">Cancel</button>
          <button type="submit" className="btn-sweep bg-maroon-700 text-cream-50 font-bold rounded-full px-7 py-2.5">{initial ? "Save changes" : "Add product"}</button>
        </div>
      </form>
    </div>
  );
}

export function ProductsPanel() {
  const { products, upsertProduct, deleteProduct, toast } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink-500">{products.length} products · {products.filter((p) => p.available).length} live</p>
        <button onClick={() => setAdding(true)} className="btn-sweep inline-flex items-center gap-2 bg-maroon-700 text-cream-50 font-bold rounded-full px-5 py-2.5 text-sm">
          <IconPlus size={16} /> Add product
        </button>
      </div>
      <div className="bg-cream-50 border border-gold-500/30 rounded-2xl overflow-hidden">
        {products.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-gold-500/15 last:border-0 hover:bg-cream-100/60 transition-colors">
            <img src={p.img} alt="" className="w-14 h-14 rounded-xl object-cover border border-gold-500/30 shrink-0" />
            <div className="min-w-0 grow basis-40">
              <p className="font-bold text-ink-900 truncate">{p.name} <span className="font-telugu text-[12px] text-ink-400 font-normal">{p.telugu}</span></p>
              <p className="text-[12px] text-ink-400 font-semibold">{CATEGORIES.find((c) => c.id === p.category)?.label} · {p.tag ?? "no tag"} · ★ {p.rating}</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-bold text-ink-700">
              ₹
              <input
                type="number"
                min={1}
                defaultValue={p.price}
                key={p.id + p.price}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (v > 0 && v !== p.price) {
                    upsertProduct({ ...p, price: v });
                    toast(`${p.name} price → ${inr(v)}`);
                  }
                }}
                className="w-20 border border-gold-500/40 bg-cream-100 rounded-lg px-2 py-1.5 tabular-nums focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
              />
            </label>
            <div className="flex items-center gap-2">
              <Toggle
                on={p.available}
                label={`Toggle ${p.name} availability`}
                onClick={() => {
                  upsertProduct({ ...p, available: !p.available });
                  toast(`${p.name} is now ${p.available ? "sold out" : "available"}`);
                }}
              />
              <span className={`text-[12px] font-bold ${p.available ? "text-leaf-700" : "text-ink-400"}`}>{p.available ? "Live" : "Hidden"}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={() => setEditing(p)} className="grid place-items-center w-9 h-9 rounded-full text-maroon-700 hover:bg-cream-200 transition-colors" aria-label={`Edit ${p.name}`}>
                <IconPencil size={17} />
              </button>
              {confirmDel === p.id ? (
                <span className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      deleteProduct(p.id);
                      toast(`${p.name} deleted`, "warn");
                      setConfirmDel(null);
                    }}
                    className="text-[12px] font-extrabold bg-maroon-700 text-cream-50 rounded-full px-3 py-1.5"
                  >
                    Sure?
                  </button>
                  <button onClick={() => setConfirmDel(null)} className="grid place-items-center w-8 h-8 rounded-full text-ink-500 hover:bg-cream-200" aria-label="Cancel delete">
                    <IconX size={15} />
                  </button>
                </span>
              ) : (
                <button onClick={() => setConfirmDel(p.id)} className="grid place-items-center w-9 h-9 rounded-full text-maroon-600 hover:bg-maroon-700/10 transition-colors" aria-label={`Delete ${p.name}`}>
                  <IconTrash size={17} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {(editing || adding) && <ProductModal initial={editing} onClose={() => { setEditing(null); setAdding(false); }} />}
    </div>
  );
}

/* ================= CUSTOMERS ================= */
export function CustomersPanel() {
  const { orders } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; email: string; orders: Order[]; spent: number }>();
    orders.forEach((o) => {
      const cur = map.get(o.phone) ?? { name: o.name, phone: o.phone, email: o.email, orders: [], spent: 0 };
      cur.orders.push(o);
      if (o.status !== "Cancelled") cur.spent += o.total;
      cur.name = o.name;
      if (o.email) cur.email = o.email;
      map.set(o.phone, cur);
    });
    let list = [...map.values()].sort((a, b) => b.spent - a.spent);
    const s = q.trim().toLowerCase();
    if (s) list = list.filter((c) => (c.name + " " + c.phone + " " + c.email).toLowerCase().includes(s));
    return list;
  }, [orders, q]);

  return (
    <div className="space-y-4">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers by name, phone or email…" className={`${inputCls} sm:max-w-md`} />
      <div className="bg-cream-50 border border-gold-500/30 rounded-2xl overflow-hidden">
        {customers.map((c) => (
          <div key={c.phone} className="border-b border-gold-500/15 last:border-0">
            <button onClick={() => setOpen(open === c.phone ? null : c.phone)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream-100/70 transition-colors">
              <span className="w-11 h-11 rounded-full bg-maroon-700 text-cream-100 grid place-items-center font-display text-lg shrink-0">
                {c.name.charAt(0)}
              </span>
              <span className="min-w-0 grow">
                <span className="block font-bold text-ink-900 truncate">{c.name}</span>
                <span className="block text-[12px] text-ink-500 font-semibold">{c.phone}{c.email ? ` · ${c.email}` : ""}</span>
              </span>
              <span className="text-right shrink-0">
                <span className="block font-display text-lg text-maroon-700 tabular-nums">{inr(c.spent)}</span>
                <span className="block text-[12px] font-bold text-ink-400">{c.orders.length} order{c.orders.length > 1 ? "s" : ""}</span>
              </span>
              <IconChevronDown size={17} className={`text-ink-400 transition-transform duration-300 ${open === c.phone ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === c.phone ? "max-h-96" : "max-h-0"}`}>
              <div className="px-5 pb-4">
                <ul className="space-y-2">
                  {c.orders.map((o) => (
                    <li key={o.id} className="flex items-center justify-between bg-cream-100 rounded-xl px-4 py-2.5 text-sm">
                      <span className="font-display text-maroon-700">#{o.id}</span>
                      <span className="text-ink-500 font-semibold hidden sm:block">{fmtDateTime(o.createdAt)}</span>
                      <span className="font-bold tabular-nums text-ink-900">{inr(o.total)}</span>
                      <StatusChip status={effStatus(o)} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        {customers.length === 0 && <p className="p-8 text-center text-ink-500 font-semibold">No customers found.</p>}
      </div>
    </div>
  );
}

/* ================= REVIEWS ================= */
export function ReviewsPanel() {
  const { reviews, reviewAction, toast } = useStore();
  const sorted = [...reviews].sort((a, b) => Number(a.approved) - Number(b.approved) || b.date.localeCompare(a.date));
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {sorted.map((r, i) => (
        <Reveal key={r.id} delay={(i % 2) * 80}>
          <div className={`bg-cream-50 border rounded-2xl p-5 h-full ${r.hidden ? "border-ink-400/30 opacity-70" : "border-gold-500/30"}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full bg-maroon-700 text-cream-100 grid place-items-center font-display text-sm shrink-0">{r.name.charAt(0)}</span>
                <div>
                  <p className="font-bold text-ink-900 text-[15px]">{r.name}</p>
                  <p className="text-[11px] font-semibold text-ink-400">{fmtDate(r.date)}</p>
                </div>
              </div>
              <span
                className={`text-[11px] font-extrabold uppercase tracking-wider rounded-full px-3 py-1 ${
                  r.hidden ? "bg-ink-400/15 text-ink-500" : r.approved ? "bg-leaf-600/15 text-leaf-700" : "bg-saffron-500/20 text-saffron-700"
                }`}
              >
                {r.hidden ? "Hidden" : r.approved ? "Live" : "Pending"}
              </span>
            </div>
            <div className="mt-3"><Stars value={r.rating} size={15} /></div>
            <p className="text-[15px] text-ink-700 mt-2 leading-relaxed">“{r.text}”</p>
            <div className="mt-4 pt-3 border-t border-dashed border-gold-500/40 flex items-center gap-2">
              {!r.approved && (
                <button
                  onClick={() => { reviewAction(r.id, "approve"); toast("Review approved & live"); }}
                  className="text-[13px] font-bold bg-leaf-600 text-cream-50 rounded-full px-4 py-2 hover:bg-leaf-700 transition-colors"
                >
                  Approve
                </button>
              )}
              {r.approved && !r.hidden && (
                <button
                  onClick={() => { reviewAction(r.id, "hide"); toast("Review hidden from site"); }}
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold border border-gold-500/50 text-ink-700 rounded-full px-4 py-2 hover:bg-cream-100 transition-colors"
                >
                  <IconEyeOff size={15} /> Hide
                </button>
              )}
              {r.hidden && (
                <button
                  onClick={() => { reviewAction(r.id, "approve"); toast("Review visible again"); }}
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold border border-gold-500/50 text-ink-700 rounded-full px-4 py-2 hover:bg-cream-100 transition-colors"
                >
                  <IconEye size={15} /> Show
                </button>
              )}
              <button
                onClick={() => { reviewAction(r.id, "delete"); toast("Review deleted", "warn"); }}
                className="inline-flex items-center gap-1.5 ml-auto text-[13px] font-bold text-maroon-600 hover:text-maroon-800 transition-colors"
              >
                <IconTrash size={15} /> Delete
              </button>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ================= OFFERS ================= */
export function OffersPanel() {
  const { offer, updateOffer, toast } = useStore();
  const [f, setF] = useState({ ...offer, pct: String(offer.pct) });

  // Sync form state when offer changes in store
  useEffect(() => {
    setF({ ...offer, pct: String(offer.pct) });
  }, [offer]);

  const save = (e: FormEvent) => {
    e.preventDefault();
    const pct = Math.max(0, Math.min(90, Number(f.pct) || 0));
    updateOffer({ title: f.title.trim() || "Special Offer", code: f.code.trim().toUpperCase() || "SWEET", pct, start: f.start, end: f.end, active: f.active });
    toast(`Offer updated — ${pct}% off is now ${f.active ? "LIVE" : "paused"}`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <form onSubmit={save} className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-2xl text-maroon-800">Manage Active Offer</h2>
        <label className="block">
          <span className="text-[13px] font-bold text-ink-700 block mb-1">Offer title</span>
          <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={inputCls} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Discount %</span>
            <input type="number" min={0} max={90} value={f.pct} onChange={(e) => setF({ ...f, pct: e.target.value })} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Coupon code</span>
            <input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[13px] font-bold text-ink-700 block mb-1">Start date</span>
            <input type="date" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-[13px] font-bold text-ink-700 block mb-1">End date</span>
            <input type="date" value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} className={inputCls} />
          </label>
        </div>
        <div className="flex items-center justify-between bg-cream-100 border border-gold-500/30 rounded-xl px-4 py-3">
          <span className="font-bold text-ink-900">Offer status</span>
          <div className="flex items-center gap-2.5">
            <Toggle on={f.active} onClick={() => setF({ ...f, active: !f.active })} label="Toggle offer" />
            <span className={`text-sm font-extrabold ${f.active ? "text-leaf-700" : "text-ink-400"}`}>{f.active ? "ACTIVE" : "PAUSED"}</span>
          </div>
        </div>
        <button type="submit" className="btn-sweep w-full bg-maroon-700 text-cream-50 font-bold rounded-full py-3.5">
          Save Offer
        </button>
        <p className="text-[13px] text-ink-400 font-medium text-center">
          Changes apply instantly to every cart and the storefront banner.
        </p>
      </form>

      <Reveal delay={120}>
        <div className="bg-maroon-800 pattern-maroon rounded-2xl p-8 text-center border border-gold-500/30 shadow-warm overflow-hidden">
          <p className="font-telugu text-saffron-400">లైవ్ ప్రివ్యూ</p>
          <h3 className="font-display text-3xl text-cream-100 mt-1">{f.title || "Special Offer"}</h3>
          <p className="font-display text-6xl text-saffron-400 mt-3">{f.pct || 0}%</p>
          <div className="mt-5 inline-flex items-center gap-2.5 border-2 border-dashed border-saffron-500/70 rounded-xl px-5 py-2.5">
            <span className="font-display text-2xl tracking-[0.2em] text-cream-100">{f.code || "CODE"}</span>
            <IconCopy size={17} className="text-saffron-400" />
          </div>
          <p className="text-cream-200/70 text-sm font-medium mt-4">
            Valid {fmtDate(f.start)} – {fmtDate(f.end)}
          </p>
          <p className={`mt-3 inline-block text-[12px] font-extrabold uppercase tracking-wider rounded-full px-4 py-1.5 ${f.active ? "bg-leaf-600 text-cream-50" : "bg-ink-400/40 text-cream-200"}`}>
            {f.active ? "Customers see this now" : "Paused — hidden from store"}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
