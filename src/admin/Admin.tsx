import { useState, type FormEvent } from "react";
import {
  DiyaLogo,
  IconBox,
  IconChart,
  IconClipboard,
  IconLogout,
  IconTag,
  IconUsers,
  IconExternal,
} from "../components/ui";
import { Link } from "../lib/router";
import { useStore } from "../lib/store";
import Dashboard from "./Dashboard";
import { CustomersPanel, OffersPanel, OrdersPanel, ProductsPanel, ReviewsPanel } from "./Manage";

export type AdminTab = "dashboard" | "orders" | "products" | "customers" | "reviews" | "offers";

const TABS: { id: AdminTab; label: string; icon: typeof IconChart }[] = [
  { id: "dashboard", label: "Dashboard", icon: IconChart },
  { id: "orders", label: "Orders", icon: IconClipboard },
  { id: "products", label: "Products", icon: IconBox },
  { id: "customers", label: "Customers", icon: IconUsers },
  { id: "reviews", label: "Reviews", icon: IconTag },
  { id: "offers", label: "Offers", icon: IconTag },
];

function Login() {
  const { login, toast, cloudConnected } = useStore();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const ok = await login(u, p);
    setBusy(false);
    if (ok) {
      toast("Welcome back, boss 🙏");
    } else {
      setErr("Invalid credentials — try the demo login below.");
      window.setTimeout(() => setErr(""), 3000);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-maroon-900 pattern-maroon px-4">
      <div className="w-full max-w-md pop-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <DiyaLogo size={52} />
          <div>
            <p className="font-display text-2xl text-cream-100 leading-none">Teluginti Mithai</p>
            <p className="font-telugu text-saffron-400 text-sm mt-1">అడ్మిన్ ప్యానెల్</p>
          </div>
        </div>
        <form onSubmit={submit} className="bg-cream-50 rounded-2xl p-7 shadow-warm border border-gold-500/30">
          <h1 className="font-display text-3xl text-maroon-800">Staff Login</h1>
          <div className="flex items-center justify-between gap-3 mt-1">
            <p className="text-sm text-ink-500 font-medium">Manage products, orders, reviews & offers.</p>
            <span
              className={`shrink-0 text-[11px] font-extrabold uppercase tracking-wider rounded-full px-2.5 py-1 ${
                cloudConnected ? "bg-leaf-600/15 text-leaf-700 border border-leaf-600/40" : "bg-cream-200 text-ink-500 border border-gold-500/40"
              }`}
              title={cloudConnected ? "Signed in through Supabase Auth, data synced to Postgres" : "Running on browser storage — add Supabase keys to go live"}
            >
              {cloudConnected ? "● Supabase" : "○ Local demo"}
            </span>
          </div>
          {err && <p className="mt-4 text-sm font-bold text-maroon-700 bg-maroon-700/10 border border-maroon-700/30 rounded-xl px-4 py-2.5 pop-in">{err}</p>}
          <label className="block mt-5">
            <span className="text-[13px] font-bold text-ink-700">{cloudConnected ? "Email (Supabase) or username" : "Username"}</span>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              className="mt-1 w-full border border-gold-500/40 bg-cream-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
              placeholder="admin"
              autoFocus
            />
          </label>
          <label className="block mt-4">
            <span className="text-[13px] font-bold text-ink-700">Password</span>
            <input
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              className="mt-1 w-full border border-gold-500/40 bg-cream-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="btn-sweep mt-6 w-full bg-maroon-700 text-cream-50 font-bold rounded-full py-3.5 active:scale-[0.98] transition-transform">
            Unlock Dashboard
          </button>
          <p className="mt-4 text-center text-[13px] text-ink-400 font-medium bg-cream-100 border border-dashed border-gold-500/50 rounded-xl px-3 py-2.5">
            Demo access — user <strong className="text-maroon-700">admin</strong> · password <strong className="text-maroon-700">mithai2026</strong>
          </p>
        </form>
        <Link to="/" className="flex items-center justify-center gap-2 mt-5 text-cream-200/70 hover:text-saffron-400 transition-colors text-sm font-semibold">
          <IconExternal size={15} /> Back to the storefront
        </Link>
      </div>
    </div>
  );
}

export default function Admin() {
  const { authed, logout, orders, reviews } = useStore();
  const [tab, setTab] = useState<AdminTab>("dashboard");

  if (!authed) return <Login />;

  const pendingOrders = orders.filter((o) => o.status === "Placed" || o.status === "Confirmed").length;
  const pendingReviews = reviews.filter((r) => !r.approved).length;
  const badge = (t: AdminTab) => (t === "orders" ? pendingOrders : t === "reviews" ? pendingReviews : 0);

  return (
    <div className="min-h-screen bg-cream-100 lg:flex">
      {/* sidebar */}
      <aside className="lg:w-64 lg:min-h-screen bg-maroon-900 pattern-maroon lg:flex lg:flex-col shrink-0 lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-cream-200/10">
          <DiyaLogo size={40} />
          <div className="leading-none">
            <p className="font-display text-lg text-cream-100">Teluginti Mithai</p>
            <p className="font-telugu text-saffron-400 text-xs mt-0.5">వ్యాపార డాష్‌బోర్డ్</p>
          </div>
        </div>
        <nav className="flex lg:flex-col gap-1 px-3 py-3 lg:py-5 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                tab === t.id ? "bg-saffron-500 text-maroon-900" : "text-cream-200/80 hover:bg-maroon-800 hover:text-cream-100"
              }`}
            >
              <t.icon size={18} />
              {t.label}
              {badge(t.id) > 0 && (
                <span className={`ml-auto text-[11px] font-extrabold rounded-full px-2 py-0.5 ${tab === t.id ? "bg-maroon-900 text-saffron-400" : "bg-saffron-500 text-maroon-900"}`}>
                  {badge(t.id)}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="lg:mt-auto px-3 pb-4 flex lg:flex-col gap-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-cream-200/80 hover:bg-maroon-800 hover:text-cream-100 transition-colors whitespace-nowrap">
            <IconExternal size={17} /> View site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-cream-200/80 hover:bg-maroon-800 hover:text-cream-100 transition-colors whitespace-nowrap"
          >
            <IconLogout size={17} /> Log out
          </button>
        </div>
      </aside>

      {/* content */}
      <main className="grow min-w-0">
        <header className="bg-cream-50 border-b border-gold-500/25 px-5 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-maroon-800 capitalize">{tab}</h1>
            <p className="text-[13px] text-ink-500 font-medium">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 text-[13px] font-bold text-leaf-700 bg-leaf-600/10 border border-leaf-600/30 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-leaf-600 animate-pulse" /> Store open · 9 AM – 10 PM
          </span>
        </header>
        <div className="p-5 md:p-8">
          {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
          {tab === "orders" && <OrdersPanel />}
          {tab === "products" && <ProductsPanel />}
          {tab === "customers" && <CustomersPanel />}
          {tab === "reviews" && <ReviewsPanel />}
          {tab === "offers" && <OffersPanel />}
        </div>
      </main>
    </div>
  );
}
