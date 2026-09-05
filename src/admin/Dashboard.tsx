import { useMemo } from "react";
import { IconBike, IconBox, IconClipboard, IconClock, IconRupee, IconUsers, Reveal } from "../components/ui";
import { dayKey, effStatus, inr, timeAgo } from "../lib/db";
import { useStore } from "../lib/store";
import type { AdminTab } from "./Admin";
import { StatusChip } from "../pages/OrderPages";

/* ---------- charts (hand-rolled SVG) ---------- */
function LineChart({ data, labels }: { data: number[]; labels: string[] }) {
  const W = 620;
  const H = 210;
  const PAD = 34;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = PAD + (i * (W - PAD * 2)) / Math.max(1, data.length - 1);
    const y = H - PAD - (v / max) * (H - PAD * 2);
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${pts[pts.length - 1][0]},${H - PAD} L${pts[0][0]},${H - PAD} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="lgold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e89b2e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e89b2e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={PAD} x2={W - PAD} y1={H - PAD - f * (H - PAD * 2)} y2={H - PAD - f * (H - PAD * 2)} stroke="#d5ac52" strokeOpacity="0.25" strokeDasharray="4 5" />
      ))}
      <path d={area} fill="url(#lgold)" />
      <path d={path} fill="none" stroke="#8c281e" strokeWidth="2.5" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3.2} fill={i === pts.length - 1 ? "#e89b2e" : "#fdf9ef"} stroke="#8c281e" strokeWidth="2" />
      ))}
      {labels.map((l, i) =>
        i % 2 === 0 ? (
          <text key={i} x={pts[i][0]} y={H - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#7a5a44">
            {l}
          </text>
        ) : null,
      )}
      <text x={PAD - 6} y={PAD} textAnchor="end" fontSize="10" fontWeight="700" fill="#96705a">
        ₹{(max / 1000).toFixed(0)}k
      </text>
    </svg>
  );
}

function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const W = 620;
  const H = 210;
  const PAD = 34;
  const max = Math.max(...data, 1);
  const bw = (W - PAD * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={PAD} x2={W - PAD} y1={H - PAD - f * (H - PAD * 2)} y2={H - PAD - f * (H - PAD * 2)} stroke="#d5ac52" strokeOpacity="0.25" strokeDasharray="4 5" />
      ))}
      {data.map((v, i) => {
        const h = (v / max) * (H - PAD * 2);
        const x = PAD + i * bw + bw * 0.22;
        const last = i === data.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={H - PAD - h} width={bw * 0.56} height={h} rx="5" fill={last ? "#e89b2e" : "#8c281e"} opacity={last ? 1 : 0.85} />
            <text x={x + bw * 0.28} y={H - 10} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#7a5a44">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function BestSellers({ items }: { items: { name: string; qty: number; rev: number }[] }) {
  const max = Math.max(...items.map((i) => i.qty), 1);
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={it.name}>
          <div className="flex justify-between text-sm font-bold text-ink-700 mb-1.5">
            <span>
              <span className="text-saffron-600 font-display mr-1.5">#{i + 1}</span>
              {it.name}
            </span>
            <span className="text-ink-500">{it.qty} sold · {inr(it.rev)}</span>
          </div>
          <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-maroon-700 to-saffron-500 transition-all duration-700"
              style={{ width: `${(it.qty / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- dashboard ---------- */
export default function Dashboard({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  const { orders, products, ledger } = useStore();
  const now = Date.now();
  const today = dayKey(now);

  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) => dayKey(o.createdAt) === today && o.status !== "Cancelled");
    const pending = orders.filter((o) => {
      const s = effStatus(o, now);
      return s === "Placed" || s === "Confirmed" || s === "Preparing";
    });
    const customers = new Set(orders.map((o) => o.phone));
    const byProduct = new Map<string, { qty: number; rev: number }>();
    orders.forEach((o) =>
      o.items.forEach((it) => {
        const cur = byProduct.get(it.name) ?? { qty: 0, rev: 0 };
        byProduct.set(it.name, { qty: cur.qty + it.qty, rev: cur.rev + it.price * it.qty });
      }),
    );
    const best = [...byProduct.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    return {
      todayOrders: todayOrders.length,
      todaySales: todayOrders.reduce((s, o) => s + o.total, 0),
      totalOrders: orders.length,
      totalCustomers: customers.size,
      pending: pending.length,
      best,
    };
  }, [orders, today, now]);

  const daily = useMemo(() => {
    const days: { label: string; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = dayKey(d.getTime());
      const total = orders
        .filter((o) => dayKey(o.createdAt) === key && o.status !== "Cancelled")
        .reduce((s, o) => s + o.total, 0);
      days.push({ label: d.toLocaleDateString("en-IN", { day: "numeric" }), total });
    }
    return days;
  }, [orders, now]);

  const monthly = useMemo(() => {
    const d0 = new Date();
    const curKey = `${d0.getFullYear()}-${String(d0.getMonth() + 1).padStart(2, "0")}`;
    const curSales = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((s, o) => {
        const d = new Date(o.createdAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === curKey ? s + o.total : s;
      }, 0);
    const all = [...ledger, { m: curKey, sales: curSales, orders: 0 }];
    return {
      labels: all.map((x) => new Date(x.m + "-01").toLocaleDateString("en-IN", { month: "short" })),
      values: all.map((x) => x.sales),
    };
  }, [orders, ledger]);

  const CARDS = [
    { icon: IconClipboard, label: "Today's Orders", value: String(stats.todayOrders), sub: "across all stores", accent: "text-maroon-700 bg-maroon-700/10" },
    { icon: IconRupee, label: "Today's Sales", value: inr(stats.todaySales), sub: "after discounts", accent: "text-leaf-700 bg-leaf-600/10" },
    { icon: IconBox, label: "Total Orders", value: String(stats.totalOrders), sub: "all time", accent: "text-saffron-700 bg-saffron-500/15" },
    { icon: IconUsers, label: "Total Customers", value: String(stats.totalCustomers), sub: "unique phone numbers", accent: "text-maroon-700 bg-maroon-700/10" },
    { icon: IconClock, label: "Pending Orders", value: String(stats.pending), sub: "need attention", accent: "text-saffron-700 bg-saffron-500/15" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {CARDS.map((c, i) => (
          <Reveal key={c.label} delay={i * 70}>
            <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-5 card-lift h-full">
              <span className={`inline-grid place-items-center w-11 h-11 rounded-xl ${c.accent}`}>
                <c.icon size={22} />
              </span>
              <p className="font-display text-3xl text-ink-900 mt-3 tabular-nums">{c.value}</p>
              <p className="font-bold text-[14px] text-ink-700 mt-0.5">{c.label}</p>
              <p className="text-xs text-ink-400 font-medium">{c.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Reveal>
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-xl text-maroon-800">Daily Sales · last 14 days</h2>
              <span className="text-sm font-bold text-leaf-700 bg-leaf-600/10 rounded-full px-3 py-1">{inr(daily.reduce((s, d) => s + d.total, 0))}</span>
            </div>
            <LineChart data={daily.map((d) => d.total)} labels={daily.map((d) => d.label)} />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-xl text-maroon-800">Monthly Sales · 12 months</h2>
              <span className="text-sm font-bold text-saffron-700 bg-saffron-500/15 rounded-full px-3 py-1">orders + history</span>
            </div>
            <BarChart data={monthly.values} labels={monthly.labels} />
          </div>
        </Reveal>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Reveal className="lg:col-span-2">
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 h-full">
            <h2 className="font-display text-xl text-maroon-800 mb-5">Best Selling Products</h2>
            <BestSellers items={stats.best} />
            <p className="mt-5 text-[13px] text-ink-400 font-medium flex items-center gap-2">
              <IconBike size={15} className="text-maroon-600" /> {products.filter((p) => p.available).length} of {products.length} products live on the menu
            </p>
          </div>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-3">
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-maroon-800">Recent Orders</h2>
              <button onClick={() => onNavigate("orders")} className="text-sm font-bold text-maroon-700 underline underline-offset-2 hover:text-maroon-900">
                View all →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[12px] uppercase tracking-wider text-ink-400 border-b border-gold-500/25">
                    <th className="py-2 pr-3 font-bold">Order</th>
                    <th className="py-2 pr-3 font-bold">Customer</th>
                    <th className="py-2 pr-3 font-bold">Total</th>
                    <th className="py-2 pr-3 font-bold hidden sm:table-cell">Payment</th>
                    <th className="py-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 7).map((o) => (
                    <tr key={o.id} className="border-b border-gold-500/15 hover:bg-cream-100/70 transition-colors">
                      <td className="py-3 pr-3">
                        <span className="font-display text-maroon-700">#{o.id.slice(-5)}</span>
                        <span className="block text-[11px] text-ink-400 font-semibold">{timeAgo(o.createdAt, now)}</span>
                      </td>
                      <td className="py-3 pr-3 font-semibold text-ink-900">{o.name}</td>
                      <td className="py-3 pr-3 font-bold tabular-nums text-ink-900">{inr(o.total)}</td>
                      <td className="py-3 pr-3 text-ink-500 font-medium hidden sm:table-cell">{o.payment}</td>
                      <td className="py-3"><StatusChip status={effStatus(o, now)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
