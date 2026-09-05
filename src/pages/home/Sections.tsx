import { useState } from "react";
import { Lightbox, Mandala, ProductCard, Reveal, SectionHead, IconArrow, IconBike, IconCart, IconBox } from "../../components/ui";
import { navigate } from "../../lib/router";
import { GALLERY, IMG } from "../../lib/seed";
import { useStore, type MenuTab } from "../../lib/store";
import { CATEGORIES, type Category } from "../../lib/types";

export function Featured() {
  const { products } = useStore();
  const best = products.filter((p) => p.available && p.tag === "Bestseller").slice(0, 6);

  return (
    <section id="featured" className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <SectionHead
          telugu="మా బెస్ట్ సెల్లర్లు"
          title="Crowd Favourites"
          sub="The boxes that leave the shop fastest — fried, layered and soaked fresh every single morning."
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {best.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>
        <Reveal className="text-center mt-10">
          <button
            onClick={() => navigate("/menu")}
            className="group inline-flex items-center gap-2.5 font-bold text-lg text-maroon-700 border-b-2 border-saffron-500 pb-1 hover:text-maroon-900 transition-colors"
          >
            Explore the full menu
            <IconArrow size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

const TILE_IMG: Record<MenuTab, string> = {
  popular: IMG.thali,
  sweets: IMG.katli,
  laddus: IMG.laddus,
  kajas: IMG.kaja,
  halwa: IMG.halwa,
  snacks: IMG.snacks,
  mixtures: IMG.snacks,
  homemade: IMG.bobbatlu,
};

export function CategoryMosaic() {
  const { products, setMenuCat } = useStore();
  const count = (tab: MenuTab) =>
    tab === "popular" ? products.filter((p) => p.tag === "Bestseller").length : products.filter((p) => p.category === tab).length;

  const tabs: { tab: MenuTab; label: string; telugu: string }[] = [
    { tab: "popular", label: "Popular", telugu: "ప్రాచుర్యం" },
    ...CATEGORIES.map((c) => ({ tab: c.id as MenuTab, label: c.label, telugu: c.telugu })),
  ];

  const go = (tab: MenuTab) => {
    setMenuCat(tab);
    navigate("/menu");
  };

  return (
    <section className="bg-cream-50 border-y border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <SectionHead
          telugu="ఏం కావాలి?"
          title="Shop by Craving"
          sub="From festival ariselu to evening janthikalu — pick a lane and dive in."
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[170px]">
          {tabs.map((t, i) => (
            <Reveal
              key={t.tab}
              delay={i * 60}
              className={i === 0 ? "col-span-2 row-span-2" : ""}
            >
              <button
                onClick={() => go(t.tab)}
                className={`group relative w-full h-full min-h-[150px] rounded-xl overflow-hidden text-left img-zoom border border-gold-500/25 ${i === 0 ? "md:min-h-full" : ""}`}
              >
                <img src={TILE_IMG[t.tab]} alt={t.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-maroon-950/85 via-maroon-950/25 to-transparent" />
                <span className="absolute bottom-0 inset-x-0 p-4 md:p-5">
                  <span className={`block font-telugu text-saffron-300 ${i === 0 ? "text-lg" : "text-sm"}`}>{t.telugu}</span>
                  <span className={`block font-display text-cream-100 leading-tight ${i === 0 ? "text-3xl md:text-4xl" : "text-lg md:text-xl"}`}>
                    {t.label}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-[12px] md:text-[13px] font-semibold text-cream-200/85">
                    {count(t.tab)} items
                    <IconArrow size={14} className="text-saffron-400 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="bg-maroon-800 pattern-maroon rounded-2xl px-6 md:px-10 py-7 grid md:grid-cols-3 gap-6 items-center">
            {[
              { icon: IconCart, step: "01", title: "Pick your sweets", sub: "Browse 29 varieties across 7 traditional categories." },
              { icon: IconBox, step: "02", title: "We fry & pack fresh", sub: "Your order is prepared after you place it — never off the shelf." },
              { icon: IconBike, step: "03", title: "Rider at your door", sub: "Track live from kadai to doorstep in 45–60 minutes." },
            ].map((s, i) => (
              <div key={s.step} className="flex items-start gap-4 relative">
                {i < 2 && <span className="hidden md:block absolute top-6 -right-3 w-6 border-t-2 border-dashed border-gold-500/50" />}
                <span className="grid place-items-center w-12 h-12 rounded-full bg-saffron-500 text-maroon-900 shrink-0">
                  <s.icon size={22} />
                </span>
                <div>
                  <p className="text-saffron-400 font-display text-sm">{s.step}</p>
                  <h4 className="font-display text-xl text-cream-100">{s.title}</h4>
                  <p className="text-sm text-cream-200/75 mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="relative overflow-hidden">
      <Mandala className="absolute -top-24 -left-24 w-80 h-80 text-gold-500/30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-14">
        <div className="lg:sticky lg:top-28 self-start">
          <SectionHead telugu="మా గురించి" title="About Teluginti Mithai" center={false} />
          <Reveal delay={120}>
            <p className="mt-6 text-lg text-ink-500 leading-relaxed">
              Teluginti Mithai in <strong className="text-ink-700">Kukatpally, Hyderabad</strong> is a
              traditional sweets and snacks outlet known for authentic Andhra-style sweets, laddus,
              kajas, halwas and homemade delicacies — prepared using classic recipes and quality
              ingredients.
            </p>
            <p className="mt-4 text-lg text-ink-500 leading-relaxed">
              What started as a single kadai beside the Rythubazar in 1998 is now four stores across
              the city. The palm jaggery still comes from the same farms, the ghee is still churned
              the slow way, and every kaja is still folded by hand — 24 layers, no machines.
            </p>
            <p className="mt-6 font-display text-xl text-maroon-700">— The Teluginti Family</p>
          </Reveal>
          <Reveal delay={220}>
            <dl className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { n: "27+", l: "Years of taste" },
                { n: "40+", l: "Sweet varieties" },
                { n: "4", l: "Stores in HYD" },
                { n: "4.9★", l: "Customer rating" },
              ].map((s) => (
                <div key={s.l} className="bg-cream-50 border border-gold-500/30 rounded-xl px-4 py-4 text-center card-lift">
                  <dt className="font-display text-3xl text-maroon-700">{s.n}</dt>
                  <dd className="text-[13px] font-semibold text-ink-500 mt-0.5">{s.l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="relative pattern-dots rounded-3xl">
          <Reveal>
            <div className="rounded-2xl border border-gold-500/50 bg-cream-50 p-3 shadow-warm">
              <img
                src={IMG.store}
                alt="Inside the Teluginti Mithai store — brass jars of sweets on wooden shelves"
                className="rounded-xl w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="relative z-10 -mt-16 ml-8 sm:ml-16 max-w-xs rotate-2 rounded-xl border border-gold-500/50 bg-cream-50 p-2.5 shadow-card">
              <img src={IMG.bobbatlu} alt="Hand-rolled bobbatlu with ghee" className="rounded-lg w-full aspect-square object-cover" loading="lazy" />
              <p className="font-telugu text-maroon-700 text-sm text-center py-2">ఇంటి రుచి · the taste of home</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const HEIGHTS = ["h-64", "h-80", "h-72", "h-80", "h-64", "h-72", "h-80", "h-64"];

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return (
    <section id="gallery" className="bg-maroon-900 pattern-maroon relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <SectionHead
          dark
          telugu="మా వంటగది నుంచి"
          title="From Our Kitchen"
          sub="Sweets, snacks, the store and the hands that make it all — click any frame to look closer."
        />
        <div className="mt-12 columns-2 md:columns-3 gap-4 [column-fill:balance]">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src + i} delay={(i % 3) * 90} className="mb-4 break-inside-avoid">
              <button
                onClick={() => setLightbox(i)}
                className={`group relative w-full ${HEIGHTS[i % HEIGHTS.length]} rounded-xl overflow-hidden border border-gold-500/25 img-zoom block`}
                aria-label={`Open ${g.caption}`}
              >
                <img src={g.src} alt={g.caption} loading="lazy" className="w-full h-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-0 inset-x-0 p-4 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-left">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-saffron-500 text-maroon-900 rounded-full px-2.5 py-0.5">
                    {g.cat}
                  </span>
                  <span className="block text-cream-100 font-semibold mt-1.5 text-[15px] leading-snug">{g.caption}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {lightbox !== null && (
        <Lightbox images={GALLERY} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
      )}
    </section>
  );
}
