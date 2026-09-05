import { useEffect, useState } from "react";
import { goSection, Link, useRoute } from "../lib/router";
import { useStore } from "../lib/store";
import { DiyaLogo, IconCart, IconMenu, IconPin, IconX } from "./ui";

const NAV = [
  { label: "Home", to: "/", section: null as string | null },
  { label: "Menu", to: "/menu", section: null as string | null },
  { label: "About", to: "/", section: "about" },
  { label: "Gallery", to: "/", section: "gallery" },
  { label: "Locations", to: "/", section: "locations" },
  { label: "Contact", to: "/", section: "contact" },
];

export default function Header() {
  const { cartCount, setCartOpen, location, setLocationOpen, offer } = useStore();
  const { path } = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [path]);

  const go = (item: (typeof NAV)[number]) => {
    setMobileOpen(false);
    if (item.section) goSection(item.section);
  };

  const isActive = (item: (typeof NAV)[number]) =>
    item.section ? false : path === item.to || (item.to === "/menu" && path.startsWith("/menu"));

  return (
    <>
      {offer.active && (
        <div className="bg-maroon-900 text-cream-200 text-center text-xs md:text-[13px] font-semibold tracking-wide py-1.5 px-3">
          <span className="text-saffron-400 font-telugu mr-1.5">తీపి కబురు</span>
          {offer.title} · Code <span className="text-saffron-400 font-bold">{offer.code}</span> · FREE delivery
          above ₹499
        </div>
      )}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-cream-50/95 backdrop-blur-md border-gold-500/30 shadow-card"
            : "bg-cream-100/80 backdrop-blur-sm border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-[72px]">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <DiyaLogo size={42} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl md:text-[22px] text-maroon-800">
                Teluginti <span className="text-saffron-600">Mithai</span>
              </span>
              <span className="block font-telugu text-[12px] text-ink-500 mt-0.5">
                తెలుగింటి మిఠాయి · Kukatpally
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) =>
              item.section ? (
                <button
                  key={item.label}
                  onClick={() => go(item)}
                  className="px-3.5 py-2 text-[15px] font-semibold text-ink-700 hover:text-maroon-700 rounded-full hover:bg-cream-200/70 transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`px-3.5 py-2 text-[15px] font-semibold rounded-full transition-colors ${
                    isActive(item)
                      ? "text-cream-50 bg-maroon-700"
                      : "text-ink-700 hover:text-maroon-700 hover:bg-cream-200/70"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setLocationOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-ink-700 bg-cream-200/80 hover:bg-cream-200 border border-gold-500/30 rounded-full pl-2.5 pr-3 py-1.5 transition-colors max-w-[190px]"
              title="Set delivery location"
            >
              <IconPin size={15} className="text-maroon-600 shrink-0" />
              <span className="truncate">{location ? location.area || "Deliver to home" : "Set location"}</span>
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-maroon-700 hover:bg-maroon-600 text-cream-50 font-bold text-sm rounded-full pl-3.5 pr-4 py-2.5 transition-all active:scale-95 shadow-warm"
              aria-label="Open cart"
            >
              <IconCart size={19} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 grid place-items-center rounded-full bg-saffron-500 text-maroon-900 text-xs font-extrabold pop-in">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden grid place-items-center w-10 h-10 rounded-full text-maroon-800 hover:bg-cream-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <IconX size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </div>

        {/* mobile nav */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height] duration-400 ${
            mobileOpen ? "max-h-96 border-t border-gold-500/20" : "max-h-0"
          }`}
        >
          <nav className="bg-cream-50 px-5 py-4 flex flex-col gap-1">
            <button
              onClick={() => {
                setMobileOpen(false);
                setLocationOpen(true);
              }}
              className="flex items-center gap-2 text-sm font-semibold text-ink-700 bg-cream-200/70 rounded-xl px-4 py-2.5 mb-2"
            >
              <IconPin size={16} className="text-maroon-600" />
              {location ? `Delivering to ${location.area || "your address"}` : "Set your delivery location"}
            </button>
            {NAV.map((item) =>
              item.section ? (
                <button
                  key={item.label}
                  onClick={() => go(item)}
                  className="text-left px-4 py-2.5 font-semibold text-ink-700 hover:bg-cream-200/70 rounded-xl transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`px-4 py-2.5 font-semibold rounded-xl transition-colors ${
                    isActive(item) ? "bg-maroon-700 text-cream-50" : "text-ink-700 hover:bg-cream-200/70"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
