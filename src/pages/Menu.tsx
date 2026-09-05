import { useMemo, useState } from "react";
import { ProductCard, Reveal, IconSearch, IconX } from "../components/ui";
import { useStore, type MenuTab } from "../lib/store";
import { CATEGORIES } from "../lib/types";

export default function Menu() {
  const { products, menuCat, setMenuCat } = useStore();
  const [query, setQuery] = useState("");

  const tabs: { tab: MenuTab; label: string; telugu: string; count: number }[] = useMemo(() => {
    const countFor = (t: MenuTab) =>
      t === "popular"
        ? products.filter((p) => p.tag === "Bestseller").length
        : products.filter((p) => p.category === t).length;
    return [
      { tab: "popular" as MenuTab, label: "Popular", telugu: "ప్రాచుర్యం", count: countFor("popular") },
      ...CATEGORIES.map((c) => ({
        tab: c.id as MenuTab,
        label: c.label,
        telugu: c.telugu,
        count: countFor(c.id),
      })),
    ];
  }, [products]);

  const filtered = useMemo(() => {
    let list =
      menuCat === "popular" ? products.filter((p) => p.tag === "Bestseller") : products.filter((p) => p.category === menuCat);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => (p.name + " " + p.desc + " " + p.telugu).toLowerCase().includes(q));
    return list;
  }, [products, menuCat, query]);

  const activeLabel = tabs.find((t) => t.tab === menuCat)?.label ?? "Menu";

  return (
    <div className="min-h-screen">
      <section className="bg-maroon-800 pattern-maroon relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Reveal>
            <p className="font-telugu text-xl text-saffron-400">మా మెనూ · ఏం కావాలంటే అదే</p>
            <h1 className="font-display text-5xl md:text-6xl text-cream-100 mt-1">
              The Full <span className="text-saffron-400">Menu</span>
            </h1>
            <p className="text-cream-200/80 mt-3 max-w-xl text-lg">
              {products.filter((p) => p.available).length} items available today · everything pure veg,
              fried in small batches.
            </p>
          </Reveal>
          <Reveal delay={150} className="md:pb-1">
            <label className="flex items-center gap-2.5 bg-maroon-900/70 border border-gold-500/30 rounded-full px-4 py-3 w-full md:w-80 focus-within:border-saffron-400 transition-colors">
              <IconSearch size={18} className="text-saffron-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search boorelu, kaja, halwa…"
                className="bg-transparent outline-none text-cream-100 placeholder:text-cream-200/40 w-full font-medium"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-cream-200/60 hover:text-cream-100" aria-label="Clear search">
                  <IconX size={16} />
                </button>
              )}
            </label>
          </Reveal>
        </div>
      </section>

      <div className="sticky top-16 md:top-[72px] z-30 bg-cream-100/95 backdrop-blur-md border-b border-gold-500/25">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.tab}
              onClick={() => setMenuCat(t.tab)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                menuCat === t.tab
                  ? "bg-maroon-700 text-cream-50 shadow-warm"
                  : "bg-cream-50 text-ink-700 border border-gold-500/30 hover:border-maroon-600/50 hover:text-maroon-700"
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs ${menuCat === t.tab ? "text-saffron-300" : "text-ink-400"}`}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="flex items-baseline justify-between mb-7">
          <h2 className="font-display text-3xl text-maroon-800">
            {query ? `Results for “${query}”` : activeLabel}
            <span className="text-ink-400 text-lg font-body font-semibold ml-2">({filtered.length})</span>
          </h2>
          <p className="hidden sm:block text-sm font-semibold text-ink-500">
            Prices per pack · 10% off auto-applied
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-3xl text-maroon-800">No sweets match that</p>
            <p className="text-ink-500 mt-2">Try “laddu”, “kaja” or browse a category above.</p>
            <button
              onClick={() => {
                setQuery("");
                setMenuCat("popular");
              }}
              className="btn-sweep mt-6 bg-maroon-700 text-cream-50 font-bold rounded-full px-6 py-3"
            >
              Show Popular Items
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
        )}

        <p className="text-center text-sm text-ink-400 font-medium mt-12">
          Prices include GST · Custom 250 g / 1 kg festive boxes available on request —{" "}
          <a href="tel:+917948228100" className="text-maroon-700 font-bold hover:underline">call the counter</a>
        </p>
      </section>
    </div>
  );
}
