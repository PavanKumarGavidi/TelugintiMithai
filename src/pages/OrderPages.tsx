import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  IconArrow,
  IconBike,
  IconBox,
  IconCheck,
  IconClipboard,
  IconClock,
  IconHome,
  IconPhone,
  IconPin,
  IconSearch,
  IconTruck,
  Reveal,
} from "../components/ui";
import { effStatus, fmtDateTime, inr, timeAgo } from "../lib/db";
import { goSection, Link, navigate } from "../lib/router";
import { useStore } from "../lib/store";
import { STATUS_FLOW, type Order, type OrderStatus } from "../lib/types";

const PETAL_COLORS = ["#e89b2e", "#f2b24c", "#a63a2c", "#d5ac52", "#8c281e"];

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: (i * 7.3 + 3) % 100,
        delay: (i * 0.55) % 5,
        dur: 5 + ((i * 1.7) % 4),
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        size: 10 + ((i * 3) % 10),
      })),
    [],
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

function eta(order: Order): string {
  const a = new Date(order.createdAt + 45 * 60000).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const b = new Date(order.createdAt + 60 * 60000).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  return `${a} – ${b}`;
}

/* ================= CONFIRMATION ================= */
export function ConfirmationPage({ id }: { id: string }) {
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-4xl text-maroon-800">Order not found</p>
        <p className="text-ink-500 mt-3">We couldn't find <strong>{id}</strong>. Double-check the number, or track a recent order below.</p>
        <Link to="/track" className="btn-sweep inline-flex items-center gap-2 mt-8 bg-maroon-700 text-cream-50 font-bold rounded-full px-7 py-3.5">
          Go to Order Tracking <IconArrow size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <Petals />
      <div className="max-w-3xl mx-auto px-4 py-14 md:py-20 text-center relative">
        <div className="pop-in mx-auto w-24 h-24 rounded-full bg-leaf-600 grid place-items-center shadow-warm pulse-ring">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#fdf9ef" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path className="draw-check" d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <p className="font-telugu text-2xl text-maroon-600 mt-7">ధన్యవాదాలు!</p>
        <h1 className="font-display text-5xl md:text-6xl text-maroon-800 mt-1">Order Confirmed! 🎉</h1>
        <p className="mt-4 text-lg text-ink-500">
          The kadai fire is already going, {order.name.split(" ")[0]}. Your sweets are being made fresh.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 bg-maroon-800 text-cream-100 rounded-full pl-5 pr-6 py-3 shadow-warm">
          <span className="text-cream-200/70 text-sm font-semibold">Order</span>
          <span className="font-display text-2xl tracking-wide text-saffron-400">#{order.id}</span>
        </div>

        <Reveal className="mt-10">
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl shadow-card overflow-hidden text-left">
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-gold-500/25">
              <div className="p-6 space-y-4">
                <h2 className="font-display text-xl text-maroon-800">Order Details</h2>
                <ul className="space-y-2">
                  {order.items.map((it) => (
                    <li key={it.id} className="flex justify-between text-[15px] text-ink-700">
                      <span>{it.name} <span className="text-ink-400">× {it.qty}</span></span>
                      <span className="font-semibold tabular-nums">{inr(it.price * it.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="pt-3 border-t border-dashed border-gold-500/40 space-y-1 text-[14px]">
                  <div className="flex justify-between text-ink-500"><dt>Subtotal</dt><dd className="tabular-nums">{inr(order.subtotal)}</dd></div>
                  <div className="flex justify-between text-leaf-600 font-semibold"><dt>Discount</dt><dd className="tabular-nums">− {inr(order.discount)}</dd></div>
                  <div className="flex justify-between text-ink-500"><dt>Delivery</dt><dd className="tabular-nums">{order.delivery === 0 ? "FREE" : inr(order.delivery)}</dd></div>
                  <div className="flex justify-between font-display text-lg text-maroon-800 pt-1"><dt>Total</dt><dd className="tabular-nums">{inr(order.total)}</dd></div>
                </dl>
              </div>
              <div className="p-6 space-y-4 bg-cream-100/70 sm:border-l sm:border-gold-500/25">
                <h2 className="font-display text-xl text-maroon-800">Delivery</h2>
                <p className="flex gap-2.5 text-[15px] text-ink-700"><IconPin size={18} className="text-maroon-600 shrink-0 mt-0.5" />{order.address}, {order.city} — {order.pincode}{order.landmark ? ` · Near ${order.landmark}` : ""}</p>
                <p className="flex gap-2.5 text-[15px] text-ink-700 items-center"><IconPhone size={17} className="text-maroon-600 shrink-0" />{order.phone}</p>
                <p className="flex gap-2.5 text-[15px] text-ink-700 items-center"><IconClock size={17} className="text-maroon-600 shrink-0" />Arriving between <strong>{eta(order)}</strong></p>
                <p className="text-[14px] text-ink-500 bg-saffron-500/15 border border-saffron-500/40 rounded-xl px-4 py-2.5 font-semibold">
                  Payment: {order.payment}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150} className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate(`/track/${order.id}`)}
            className="btn-sweep group inline-flex items-center gap-2.5 bg-maroon-700 text-cream-50 font-bold text-lg rounded-full pl-7 pr-6 py-3.5 shadow-warm active:scale-95 transition-transform"
          >
            Track Order
            <IconArrow size={19} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <Link to="/menu" className="inline-flex items-center gap-2 border-2 border-maroon-700 text-maroon-700 font-bold text-lg rounded-full px-7 py-3 hover:bg-maroon-700 hover:text-cream-50 transition-colors">
            Order Something More
          </Link>
        </Reveal>
        <p className="mt-6 text-sm text-ink-400 font-medium">
          Loved it already?{" "}
          <button onClick={() => goSection("reviews")} className="text-maroon-700 font-bold underline underline-offset-2 hover:text-maroon-900 transition-colors">
            Rate your experience →
          </button>
        </p>
      </div>
    </div>
  );
}

/* ================= TRACKING ================= */
const STEP_META: { icon: typeof IconClipboard; label: string; sub: string }[] = [
  { icon: IconClipboard, label: "Order Placed", sub: "We've received your order" },
  { icon: IconCheck, label: "Confirmed", sub: "Payment verified, order accepted" },
  { icon: IconBox, label: "Preparing", sub: "Frying, layering & packing fresh" },
  { icon: IconTruck, label: "Out for Delivery", sub: "Rider is on the way to you" },
  { icon: IconHome, label: "Delivered", sub: "Enjoy every bite!" },
];

export function TrackPage({ id }: { id?: string }) {
  const { orders } = useStore();
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 2500);
    return () => window.clearInterval(t);
  }, []);

  const order = id ? orders.find((o) => o.id === id) : undefined;

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === q);
    if (found) {
      navigate(`/track/${found.id}`);
      setNotFound("");
    } else {
      setNotFound(`No order found for “${query.trim()}”. Try one of the recent orders below.`);
    }
  };

  if (!order) {
    const recent = orders.slice(0, 4);
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <p className="font-telugu text-xl text-maroon-600 text-center">ఆర్డర్ ట్రాకింగ్</p>
        <h1 className="font-display text-4xl md:text-5xl text-maroon-800 text-center mt-1">Track Your Order</h1>
        <form onSubmit={search} className="mt-8 flex gap-3">
          <div className="grow flex items-center gap-2.5 bg-cream-50 border border-gold-500/40 rounded-full px-4 focus-within:border-saffron-500 transition-colors">
            <IconSearch size={18} className="text-maroon-600 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter order ID, e.g. TM202600123"
              className="w-full bg-transparent outline-none py-3.5 font-semibold text-ink-900 placeholder:text-ink-400"
            />
          </div>
          <button type="submit" className="btn-sweep bg-maroon-700 text-cream-50 font-bold rounded-full px-6 shrink-0">
            Track
          </button>
        </form>
        {notFound && <p className="text-sm font-bold text-maroon-700 bg-maroon-700/10 rounded-xl px-4 py-3 mt-4 pop-in">{notFound}</p>}
        <div className="mt-10">
          <h2 className="font-display text-xl text-maroon-800">Recent orders on this device</h2>
          <div className="mt-4 space-y-3">
            {recent.map((o) => (
              <Link
                key={o.id}
                to={`/track/${o.id}`}
                className="flex items-center justify-between bg-cream-50 border border-gold-500/30 rounded-xl px-5 py-4 hover:border-maroon-600/50 hover:shadow-card transition-all group"
              >
                <div>
                  <p className="font-display text-lg text-maroon-800">#{o.id}</p>
                  <p className="text-sm text-ink-500 font-medium">{o.items.length} item{o.items.length > 1 ? "s" : ""} · {fmtDateTime(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-maroon-700">{inr(o.total)}</p>
                  <StatusChip status={effStatus(o, now)} />
                </div>
                <IconArrow size={18} className="text-maroon-600 ml-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const status: OrderStatus = effStatus(order, now);
  const cancelled = status === "Cancelled";
  const currentIdx = cancelled ? -1 : STATUS_FLOW.indexOf(status);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-telugu text-xl text-maroon-600">లైవ్ ట్రాకింగ్</p>
          <h1 className="font-display text-4xl md:text-5xl text-maroon-800 mt-0.5">Order <span className="text-saffron-600">#{order.id}</span></h1>
          <p className="text-ink-500 font-medium mt-2">Placed {fmtDateTime(order.createdAt)} · {timeAgo(order.createdAt, now)}</p>
        </div>
        <StatusChip status={status} big />
      </div>

      {cancelled && (
        <p className="mt-6 text-maroon-700 font-bold bg-maroon-700/10 border border-maroon-700/30 rounded-xl px-5 py-4">
          This order was cancelled. Call +91 79482 28100 if you need help with a refund.
        </p>
      )}

      <div className="mt-10 grid lg:grid-cols-5 gap-8 items-start">
        <Reveal className="lg:col-span-3">
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 md:p-8 shadow-card">
            <ol className="relative">
              {STEP_META.map((s, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                const upcoming = i > currentIdx;
                return (
                  <li key={s.label} className="relative flex gap-5 pb-8 last:pb-0">
                    {i < STEP_META.length - 1 && (
                      <span className={`absolute left-[23px] top-12 bottom-0 w-0.5 ${done || active ? "bg-saffron-500" : "bg-gold-300/40"}`} />
                    )}
                    <span
                      className={`relative z-10 grid place-items-center w-12 h-12 rounded-full border-2 shrink-0 transition-all duration-500 ${
                        done
                          ? "bg-saffron-500 border-saffron-500 text-maroon-900"
                          : active
                            ? "bg-maroon-700 border-saffron-500 text-cream-50 pulse-ring"
                            : "bg-cream-100 border-gold-300/60 text-ink-400"
                      }`}
                    >
                      {done ? <IconCheck size={22} /> : <s.icon size={21} />}
                    </span>
                    <div className={upcoming && !cancelled ? "opacity-45" : ""}>
                      <p className={`font-display text-xl ${active ? "text-maroon-800" : done ? "text-ink-900" : "text-ink-500"}`}>
                        {s.label}
                        {active && <span className="ml-2 text-[11px] font-body font-extrabold uppercase tracking-widest text-saffron-600 align-middle">In progress</span>}
                      </p>
                      <p className="text-[14px] text-ink-500 font-medium mt-0.5">{s.sub}</p>
                      {active && (
                        <div className="mt-2.5 h-1.5 w-44 bg-cream-200 rounded-full overflow-hidden">
                          <div className="h-full w-full shimmer bg-gold-300/40 rounded-full" />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 pt-5 border-t border-dashed border-gold-500/40 text-[13px] text-ink-400 font-medium flex items-center gap-2">
              <IconBike size={16} className="text-maroon-600" />
              Demo kitchen: statuses advance automatically within minutes. The store can update them anytime.
            </p>
          </div>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-2">
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 shadow-card lg:sticky lg:top-28">
            <h2 className="font-display text-xl text-maroon-800">Your Box</h2>
            <ul className="mt-4 space-y-2.5">
              {order.items.map((it) => (
                <li key={it.id} className="flex justify-between text-[15px] text-ink-700">
                  <span>{it.name} <span className="text-ink-400">× {it.qty}</span></span>
                  <span className="font-semibold tabular-nums">{inr(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 pt-3 border-t border-dashed border-gold-500/40 space-y-1 text-[14px]">
              <div className="flex justify-between text-ink-500"><dt>Subtotal</dt><dd className="tabular-nums">{inr(order.subtotal)}</dd></div>
              <div className="flex justify-between text-leaf-600 font-semibold"><dt>Discount</dt><dd className="tabular-nums">− {inr(order.discount)}</dd></div>
              <div className="flex justify-between text-ink-500"><dt>Delivery</dt><dd className="tabular-nums">{order.delivery === 0 ? "FREE" : inr(order.delivery)}</dd></div>
              <div className="flex justify-between font-display text-lg text-maroon-800 pt-1"><dt>Total</dt><dd className="tabular-nums">{inr(order.total)}</dd></div>
            </dl>
            <div className="mt-5 pt-4 border-t border-gold-500/25 space-y-2.5 text-[14px] text-ink-700">
              <p className="flex gap-2.5"><IconPin size={16} className="text-maroon-600 shrink-0 mt-0.5" />{order.address}, {order.city} — {order.pincode}</p>
              <p className="font-semibold">Payment: {order.payment}</p>
              {status !== "Delivered" && !cancelled && (
                <p className="text-[13px] font-bold text-maroon-700 bg-saffron-500/15 border border-saffron-500/40 rounded-lg px-3 py-2">
                  Estimated arrival: {eta(order)}
                </p>
              )}
            </div>
            <a href="tel:+917948228100" className="btn-sweep mt-5 w-full inline-flex items-center justify-center gap-2 bg-maroon-700 text-cream-50 font-bold rounded-full py-3">
              <IconPhone size={17} /> Need help? Call the store
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function StatusChip({ status, big = false }: { status: OrderStatus; big?: boolean }) {
  const cls =
    status === "Delivered"
      ? "bg-leaf-600/15 text-leaf-700 border-leaf-600/40"
      : status === "Cancelled"
        ? "bg-maroon-700/15 text-maroon-700 border-maroon-700/40"
        : status === "Out for Delivery"
          ? "bg-saffron-500/20 text-saffron-700 border-saffron-500/50"
          : "bg-cream-200 text-ink-700 border-gold-500/40";
  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full font-bold ${cls} ${big ? "text-sm px-4 py-2" : "text-[11px] px-2.5 py-1"}`}>
      {status !== "Delivered" && status !== "Cancelled" && <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 animate-pulse" />}
      {status}
    </span>
  );
}
