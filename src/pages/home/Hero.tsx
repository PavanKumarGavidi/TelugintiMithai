import { useState, type CSSProperties } from "react";
import { fmtDate, inr } from "../../lib/db";
import { navigate } from "../../lib/router";
import { IMG } from "../../lib/seed";
import { useStore } from "../../lib/store";
import {
  IconArrow,
  IconBolt,
  IconCandy,
  IconCopy,
  IconHeart,
  IconTruck,
  Mandala,
  Reveal,
  StarIcon,
} from "../../components/ui";

export function Hero() {
  const { location, setLocationOpen, setMenuCat, products } = useStore();
  const kaja = products.find((p) => p.id === "p10");

  const orderNow = () => {
    if (!location) setLocationOpen(true);
    setMenuCat("popular");
    navigate("/menu");
  };

  return (
    <section className="relative overflow-hidden pattern-paisley">
      <Mandala className="absolute -top-28 -right-28 w-[420px] h-[420px] text-gold-500/50 spin-slow pointer-events-none" />
      <Mandala className="absolute -bottom-40 -left-40 w-[380px] h-[380px] text-maroon-600/20 pointer-events-none" style={{ animationDirection: "reverse" }} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-16 lg:pt-6 lg:pb-20 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative">
        <div className="lg:col-span-6 relative z-10">
          <Reveal>
            <p className="flex items-center gap-3 font-telugu text-xl md:text-2xl text-maroon-600">
              స్వాగతం
              <span className="h-px w-14 bg-gold-500 inline-block" />
              <span className="text-base font-semibold text-ink-500 font-body">Welcome to</span>
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-[54px] leading-[0.98] sm:text-7xl lg:text-[84px] text-maroon-800 mt-3">
              <span className="line-mask in-view"><span>Teluginti</span></span>
              <span className="line-mask in-view" style={{ transitionDelay: "120ms" }}>
                <span>
                  <em className="not-italic text-saffron-600">Mithai</em>
                  <span className="text-maroon-800">.</span>
                </span>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 text-lg md:text-xl text-ink-500 max-w-xl leading-relaxed">
              Enjoy your favourite <strong className="text-ink-700">Telugu sweets & snacks</strong> —
              boorelu, madatha kaja, ghee halwa and more — delivered right to your doorstep,
              still warm from the kadai.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={orderNow}
                className="btn-sweep group inline-flex items-center gap-2.5 bg-maroon-700 text-cream-50 font-bold text-lg rounded-full pl-7 pr-6 py-3.5 shadow-warm active:scale-95 transition-transform"
              >
                Order Now
                <IconArrow size={19} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate("/menu")}
                className="inline-flex items-center gap-2 border-2 border-maroon-700 text-maroon-700 font-bold text-lg rounded-full px-7 py-3 hover:bg-maroon-700 hover:text-cream-50 transition-colors active:scale-95"
              >
                View Menu
              </button>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-semibold text-ink-700">
              <span className="flex items-center gap-1.5">
                <StarIcon size={16} className="text-saffron-600" filled /> 4.9 · 2,400+ reviews
              </span>
              <span className="text-gold-500">◆</span>
              <span>Sweetening Hyderabad since 1998</span>
              <span className="text-gold-500">◆</span>
              <span>4 stores · 40+ varieties</span>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 relative">
          <Reveal delay={150} className="relative max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 translate-x-4 translate-y-4 arch border-2 border-gold-500/50 pointer-events-none" />
            <div className="arch border border-gold-500/70 bg-cream-50 p-3 shadow-warm">
              <div className="arch overflow-hidden aspect-[4/5]">
                <img
                  src={IMG.thali}
                  alt="Grand Teluginti sweets thali with boorelu, kajas and kaju katli"
                  className="w-full h-full object-cover kenburns"
                />
              </div>
            </div>
            <div
              className="absolute -left-4 sm:-left-10 top-10 floaty bg-cream-50 border border-gold-500/40 rounded-xl shadow-card px-4 py-3 flex items-center gap-3"
              style={{ "--rot": "-4deg" } as CSSProperties}
            >
              <span className="w-10 h-10 rounded-full bg-saffron-500/15 grid place-items-center text-saffron-600">
                <IconCandy size={22} />
              </span>
              <span>
                <span className="block font-bold text-[14px] text-ink-900 leading-tight">Fresh batches daily</span>
                <span className="block text-xs text-ink-500 font-medium">Fried from 6 AM, packed warm</span>
              </span>
            </div>
            {kaja && (
              <div
                className="absolute -right-3 sm:-right-8 bottom-8 floaty bg-maroon-800 text-cream-100 rounded-xl shadow-warm p-3.5 flex items-center gap-3 border border-gold-500/40"
                style={{ "--rot": "3deg", animationDelay: "1.2s" } as CSSProperties}
              >
                <img src={IMG.kaja} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <span>
                  <span className="block font-display text-[15px] leading-tight">{kaja.name}</span>
                  <span className="block text-saffron-400 font-bold text-sm mt-0.5">
                    {inr(kaja.price)} / {kaja.unit}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-cream-200/80 mt-0.5">
                    <StarIcon size={10} filled className="text-saffron-400" /> {kaja.rating} · {kaja.reviews} ratings
                  </span>
                </span>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const TRUST = [
  {
    icon: IconTruck,
    title: "No Hidden Charges",
    sub: "The price on the box is the price you pay. Free delivery above ₹499.",
  },
  {
    icon: IconBolt,
    title: "On-Time Delivery",
    sub: "45–60 minutes across Kukatpally, Miyapur, Kompally & nearby zones.",
  },
  {
    icon: IconCandy,
    title: "Fresh & Authentic",
    sub: "Small batches every morning — pure ghee, palm jaggery, zero shortcuts.",
  },
  {
    icon: IconHeart,
    title: "Traditional Taste",
    sub: "Grandmother's recipes, unchanged since our first kadai in 1998.",
  },
];

export function Offers() {
  const { offer, toast } = useStore();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      toast(`Code ${offer.code} copied!`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(`Use code ${offer.code} at checkout`, "warn");
    }
  };

  return (
    <section id="offers" className="bg-maroon-800 pattern-maroon relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="relative">
            <div className="ticket-notch bg-cream-50 rounded-2xl shadow-warm px-8 py-9 md:px-10">
              <p className="font-telugu text-maroon-600 text-lg">ప్రత్యేక ఆఫర్</p>
              <h3 className="font-display text-4xl md:text-5xl text-maroon-800 leading-tight mt-1">
                Flat <span className="text-saffron-600">{offer.pct}% OFF</span>
                <br /> on All Items
              </h3>
              <p className="text-ink-500 mt-3 font-medium">
                Auto-applied in your cart. Valid {fmtDate(offer.start)} – {fmtDate(offer.end)}.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={copy}
                  className="group flex items-center gap-3 border-2 border-dashed border-saffron-600 bg-saffron-500/10 rounded-xl px-5 py-3 hover:bg-saffron-500/20 transition-colors"
                >
                  <span className="font-display text-2xl tracking-[0.18em] text-maroon-800">{offer.code}</span>
                  <IconCopy size={19} className="text-saffron-700 group-hover:scale-110 transition-transform" />
                </button>
                <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${offer.active ? "bg-leaf-600/15 text-leaf-700" : "bg-maroon-700/10 text-maroon-700"}`}>
                  {offer.active ? "● Offer active" : "○ Offer paused"}
                </span>
              </div>
              <p className="text-[13px] text-ink-400 font-medium mt-4">
                {copied ? "Copied! Paste it anywhere — the cart already knows ✓" : "Tap the code to copy it. Discount reflects instantly in your cart."}
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal delay={100}>
            <h3 className="font-display text-3xl md:text-4xl text-cream-100">
              Why Hyderabad keeps <span className="text-saffron-400">coming back</span>
            </h3>
          </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {TRUST.map((t, i) => (
            <Reveal key={t.title} delay={i * 100}>
              <div className="group bg-maroon-700/45 border border-gold-500/25 rounded-xl p-5 hover:border-saffron-400/70 hover:-translate-y-1 transition-all duration-300">
                <span className="inline-grid place-items-center w-12 h-12 rounded-full bg-saffron-500/15 text-saffron-400 group-hover:bg-saffron-500 group-hover:text-maroon-900 transition-colors">
                  <t.icon size={24} />
                </span>
                <h4 className="font-display text-lg text-cream-100 mt-3.5">{t.title}</h4>
                <p className="text-sm text-cream-200/75 mt-1 leading-relaxed">{t.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>        </div>
      </div>
    </section>
  );
}
