import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useStore } from "../lib/store";
import { inr } from "../lib/db";
import type { Product } from "../lib/types";

/* =============== scroll reveal =============== */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in-view");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* =============== section heading =============== */
export function SectionHead({
  telugu,
  title,
  sub,
  dark = false,
  center = true,
}: {
  telugu: string;
  title: string;
  sub?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className={`font-telugu text-lg md:text-xl ${dark ? "text-saffron-400" : "text-maroon-600"}`}>
        {telugu}
      </p>
      <h2
        className={`font-display text-4xl md:text-5xl leading-[1.05] mt-1 ${
          dark ? "text-cream-100" : "text-maroon-800"
        }`}
      >
        {title}
      </h2>
      <div className={`mt-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className={`h-px w-12 ${dark ? "bg-gold-500/60" : "bg-gold-500"}`} />
        <DiamondIcon className={dark ? "text-saffron-400" : "text-gold-500"} size={10} />
        <span className={`h-px w-12 ${dark ? "bg-gold-500/60" : "bg-gold-500"}`} />
      </div>
      {sub && (
        <p className={`mt-4 max-w-2xl text-lg ${center ? "mx-auto" : ""} ${dark ? "text-cream-200/80" : "text-ink-500"}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

/* =============== star rating =============== */
export function Stars({
  value,
  size = 16,
  onChange,
}: {
  value: number;
  size?: number;
  onChange?: (v: number) => void;
}) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange && onChange(i)}
          className={onChange ? "cursor-pointer transition-transform hover:scale-125" : "cursor-default"}
          aria-label={`${i} star`}
        >
          <StarIcon
            size={size}
            className={i <= Math.round(value) ? "text-saffron-500" : "text-gold-300/60"}
            filled={i <= Math.round(value)}
          />
        </button>
      ))}
    </span>
  );
}

/* =============== marquee band =============== */
export function Marquee({ items }: { items: string[] }) {
  const row = items.map((t, i) => (
    <span key={i} className="flex items-center">
      <span className="font-display text-lg md:text-xl tracking-wide px-6 text-cream-100 whitespace-nowrap">
        {t}
      </span>
      <DiamondIcon className="text-saffron-400" size={9} />
    </span>
  ));
  return (
    <div className="bg-maroon-800 pattern-maroon border-y border-gold-500/30 py-3 overflow-hidden select-none">
      <div className="marquee-track">
        <div className="flex items-center">{row}</div>
        <div className="flex items-center" aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}

/* =============== veg mark =============== */
export function VegMark({ size = 14 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center border-2 border-leaf-600 rounded-[3px] shrink-0"
      style={{ width: size, height: size }}
      title="Pure veg"
    >
      <span className="rounded-full bg-leaf-600" style={{ width: size * 0.45, height: size * 0.45 }} />
    </span>
  );
}

/* =============== qty stepper =============== */
export function QtyStepper({
  qty,
  onInc,
  onDec,
  small = false,
}: {
  qty: number;
  onInc: () => void;
  onDec: () => void;
  small?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full bg-maroon-700 text-cream-100 shadow-warm ${
        small ? "h-8" : "h-10"
      }`}
    >
      <button
        onClick={onDec}
        className={`grid place-items-center rounded-l-full hover:bg-maroon-600 active:scale-90 transition ${small ? "w-8 h-8" : "w-10 h-10"}`}
        aria-label="Decrease quantity"
      >
        <IconMinus size={small ? 13 : 15} />
      </button>
      <span className={`font-bold tabular-nums text-center ${small ? "w-6 text-sm" : "w-8"}`}>{qty}</span>
      <button
        onClick={onInc}
        className={`grid place-items-center rounded-r-full hover:bg-maroon-600 active:scale-90 transition ${small ? "w-8 h-8" : "w-10 h-10"}`}
        aria-label="Increase quantity"
      >
        <IconPlus size={small ? 13 : 15} />
      </button>
    </div>
  );
}

/* =============== product card =============== */
export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { cart, addToCart, inc, dec } = useStore();
  const inCart = cart.find((c) => c.id === p.id);
  const tagColor =
    p.tag === "Bestseller"
      ? "bg-saffron-500 text-maroon-900"
      : p.tag === "Signature"
        ? "bg-maroon-700 text-cream-100"
        : "bg-leaf-600 text-cream-100";

  return (
    <Reveal delay={(index % 3) * 90}>
      <article className="group bg-cream-50 rounded-xl border border-gold-500/25 overflow-hidden card-lift flex flex-col h-full shadow-card">
        <div className="relative img-zoom overflow-hidden aspect-[4/3]">
          <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/45 via-transparent to-transparent opacity-70" />
          {p.tag && (
            <span className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${tagColor}`}>
              {p.tag}
            </span>
          )}
          <span className="absolute bottom-3 left-3 font-telugu text-cream-100/90 text-sm bg-maroon-900/55 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            {p.telugu}
          </span>
          {!p.available && (
            <div className="absolute inset-0 grid place-items-center bg-cream-100/80 backdrop-blur-[2px]">
              <span className="font-display text-maroon-700 border-2 border-maroon-700 rounded-full px-4 py-1 -rotate-6">
                Sold out today
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col grow">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <VegMark />
              <h3 className="font-display text-lg text-ink-900 leading-tight">{p.name}</h3>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-ink-500 bg-cream-200 px-2 py-0.5 rounded-full shrink-0">
              <StarIcon size={11} filled className="text-saffron-600" />
              {p.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-ink-500 mt-1.5 leading-snug grow">{p.desc}</p>
          <div className="flex items-end justify-between mt-4">
            <div>
              <span className="font-display text-xl text-maroon-700">{inr(p.price)}</span>
              <span className="text-xs text-ink-400 ml-1.5 font-medium">/ {p.unit}</span>
            </div>
            {p.available &&
              (inCart ? (
                <QtyStepper small qty={inCart.qty} onInc={() => inc(p.id)} onDec={() => dec(p.id)} />
              ) : (
                <button
                  onClick={() => addToCart(p.id)}
                  className="btn-sweep h-9 px-5 rounded-full border-2 border-maroon-700 text-maroon-700 font-bold text-sm hover:text-maroon-900 active:scale-95 transition-transform"
                >
                  + Add
                </button>
              ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* =============== lightbox =============== */
export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: { src: string; caption: string; cat: string }[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex],
  );
  const next = useCallback(() => onIndex((index + 1) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const img = images[index];
  return (
    <div
      className="fixed inset-0 z-[100] bg-maroon-950/95 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-cream-200 hover:text-saffron-400 transition-colors"
        aria-label="Close gallery"
      >
        <IconX size={30} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-3 md:left-8 text-cream-200 hover:text-saffron-400 transition-colors bg-maroon-900/60 rounded-full p-2"
        aria-label="Previous image"
      >
        <IconChevronLeft size={28} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-3 md:right-8 text-cream-200 hover:text-saffron-400 transition-colors bg-maroon-900/60 rounded-full p-2"
        aria-label="Next image"
      >
        <IconChevronRight size={28} />
      </button>
      <figure className="max-w-4xl w-full pop-in" onClick={(e) => e.stopPropagation()}>
        <img
          src={img.src}
          alt={img.caption}
          className="w-full max-h-[76vh] object-contain rounded-xl border border-gold-500/30 shadow-warm"
        />
        <figcaption className="flex items-center justify-between mt-4 text-cream-200">
          <span className="text-base md:text-lg">{img.caption}</span>
          <span className="font-telugu text-saffron-400 shrink-0 ml-4">
            {img.cat} · {index + 1}/{images.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

/* =============== decorative =============== */
export function Mandala({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const petals = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="100" cy="100" r="96" opacity="0.5" />
        <circle cx="100" cy="100" r="72" opacity="0.4" />
        <circle cx="100" cy="100" r="30" opacity="0.5" />
        {petals.map((_, i) => (
          <ellipse key={i} cx="100" cy="38" rx="11" ry="26" transform={`rotate(${i * 30} 100 100)`} opacity="0.55" />
        ))}
        {petals.map((_, i) => (
          <ellipse key={`b${i}`} cx="100" cy="58" rx="6" ry="14" transform={`rotate(${i * 30 + 15} 100 100)`} opacity="0.4" />
        ))}
      </g>
      <circle cx="100" cy="100" r="6" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/* ---------- custom logo detection ----------
   Drop your logo at public/logo.png (or logo.jpg / logo.jpeg) and rebuild —
   it replaces the diya mark everywhere, including the browser tab.
   Without the file, the original hand-drawn diya logo is kept. */

const LOGO_CANDIDATES = ["logo.png", "logo.jpg", "logo.jpeg"].map(
  (f) => `${import.meta.env.BASE_URL}${f}`,
);

let logoUrl: string | null | undefined;
const logoListeners = new Set<() => void>();

function emitLogo() {
  logoListeners.forEach((l) => l());
  if (logoUrl) {
    const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (link) {
      link.type = logoUrl.endsWith(".png") ? "image/png" : "image/jpeg";
      link.href = logoUrl;
    }
  }
}

function probeCustomLogo() {
  if (logoUrl !== undefined) return;
  let i = 0;
  const tryNext = () => {
    if (i >= LOGO_CANDIDATES.length) {
      logoUrl = null;
      emitLogo();
      return;
    }
    const url = LOGO_CANDIDATES[i++];
    const img = new Image();
    img.onload = () => {
      logoUrl = url;
      emitLogo();
    };
    img.onerror = tryNext;
    img.src = url;
  };
  tryNext();
}

if (typeof window !== "undefined") probeCustomLogo();

export function useCustomLogo(): string | null {
  return useSyncExternalStore(
    (cb) => {
      logoListeners.add(cb);
      probeCustomLogo();
      return () => logoListeners.delete(cb);
    },
    () => logoUrl ?? null,
  );
}

export function DiyaLogo({ size = 40 }: { size?: number }) {
  const custom = useCustomLogo();
  if (custom) {
    return (
      <img
        src={custom}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        draggable={false}
        className="rounded-2xl object-cover shrink-0 select-none ring-1 ring-gold-500/40 shadow-card"
      />
    );
  }
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="var(--color-maroon-700)" />
      <path d="M14 40h36c0 8-8 13-18 13S14 48 14 40z" fill="var(--color-gold-400)" />
      <path d="M14 40h36l-3 4H17z" fill="var(--color-saffron-500)" />
      <circle cx="32" cy="30" r="9" fill="var(--color-saffron-400)" className="flicker" />
      <path d="M32 14c4 6-5 8-2 14" stroke="var(--color-cream-100)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="25" cy="47" r="1.6" fill="var(--color-maroon-700)" />
      <circle cx="32" cy="49" r="1.6" fill="var(--color-maroon-700)" />
      <circle cx="39" cy="47" r="1.6" fill="var(--color-maroon-700)" />
    </svg>
  );
}

/* =============== icons (hand-drawn strokes) =============== */
type IconProps = { size?: number; className?: string };
const mk = (node: ReactNode, fill = false) =>
  function Icon({ size = 20, className = "" }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill={fill ? "currentColor" : "none"}
        stroke={fill ? "none" : "currentColor"}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {node}
      </svg>
    );
  };

export const IconCart = mk(
  <>
    <path d="M3 4h2.4l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h7.9a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.1" />
    <circle cx="9.6" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="16.9" cy="20" r="1.4" fill="currentColor" stroke="none" />
  </>,
);
export const IconPlus = mk(<path d="M12 5v14M5 12h14" />);
export const IconMinus = mk(<path d="M5 12h14" />);
export const IconTrash = mk(
  <>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 1.8h6A2 2 0 0 0 17 19l1-12M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
  </>,
);
export const IconX = mk(<path d="M6 6l12 12M18 6L6 18" />);
export const IconTruck = mk(
  <>
    <path d="M2 6h12v10H2zM14 9h4.5L21 12.5V16h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </>,
);
export const IconBolt = mk(<path d="M13 2L5 13.5h5L10.5 22 19 10h-5.5z" />);
export const IconCandy = mk(
  <>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 7.5c1 1.5 1 7.5 0 9M8 10.5c2.5 0 5.5 0 8 3M3.5 8.5L8 11M3.5 15.5L8 13M20.5 8.5L16 11M20.5 15.5L16 13" />
  </>,
);
export const IconHeart = mk(
  <path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.5 3.6 4.5 6.8 4.5c2 0 3.6 1.1 4.4 2.6l.8 1.5.8-1.5c.8-1.5 2.4-2.6 4.4-2.6 3.2 0 5.4 3 4.1 6.3C19.5 15.4 12 20 12 20z" />,
);
export const IconPhone = mk(
  <path d="M5 4h4l1.5 4.5-2.3 1.7a12 12 0 0 0 5.6 5.6l1.7-2.3L20 15v4a1.8 1.8 0 0 1-2 1.8C10 20 4 14 3.2 6A1.8 1.8 0 0 1 5 4z" />,
);
export const IconMail = mk(
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </>,
);
export const IconPin = mk(
  <>
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </>,
);
export const IconClock = mk(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
);
export const IconWhatsApp = mk(
  <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5zm0 0v0M8.8 8.6c-.3.8-.4 2 .5 3.6 1 1.7 2.4 3 4.3 3.7 1.1.4 1.9.2 2.4-.2l.6-.7-1.7-1.1-.8.6c-1-.4-2-1.3-2.6-2.4l.6-.9-1.3-1.5-1 .8z" />,
);
export const IconArrow = mk(<path d="M4 12h15M13 6l6 6-6 6" />);
export const IconCheck = mk(<path d="M4.5 12.5l5 5L19.5 7" />);
export const IconSearch = mk(
  <>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15.5 15.5L21 21" />
  </>,
);
export const IconChevronDown = mk(<path d="M6 9l6 6 6-6" />);
export const IconChevronLeft = mk(<path d="M14.5 5L8 12l6.5 7" />);
export const IconChevronRight = mk(<path d="M9.5 5l6.5 7-6.5 7" />);
export const IconMenu = mk(<path d="M4 7h16M4 12h16M4 17h10" />);
export const IconHome = mk(<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />);
export const IconUsers = mk(
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c.5-3.5 2.7-5.5 5.5-5.5s5 2 5.5 5.5M15.5 5.4a3.2 3.2 0 0 1 0 5.9M17.5 14.9c1.7.8 2.7 2.6 3 5.1" />
  </>,
);
export const IconBox = mk(
  <>
    <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
    <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
  </>,
);
export const IconTag = mk(
  <>
    <path d="M3.5 12V4.5H11l9 9-7.5 7.5z" />
    <circle cx="8" cy="9" r="1.4" />
  </>,
);
export const IconPencil = mk(<path d="M4 20l.8-3.6L16.6 4.6a1.8 1.8 0 0 1 2.6 0l.2.2a1.8 1.8 0 0 1 0 2.6L7.6 19.2z M14.5 6.5l3 3" />);
export const IconEye = mk(
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </>,
);
export const IconEyeOff = mk(
  <>
    <path d="M4 4l16 16M9.9 5.9A9.4 9.4 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.6 17.6 0 0 1-3.2 3.9M6 8A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 3.5-.7" />
  </>,
);
export const IconLogout = mk(
  <>
    <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9M15 8l4 4-4 4M19 12H9.5" />
  </>,
);
export const IconChart = mk(
  <>
    <path d="M4 4v16h16" />
    <path d="M8 15v-4M12 15V7M16 15v-6M20 15V10" />
  </>,
);
export const IconClipboard = mk(
  <>
    <rect x="5" y="4.5" width="14" height="16" rx="2" />
    <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 17.5h3.5" />
  </>,
);
export const IconCopy = mk(
  <>
    <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
    <path d="M5.5 15.5h-1a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </>,
);
export const IconExternal = mk(<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />);
export const IconQuote = mk(
  <path
    d="M9.5 6.5C6 8 4.5 10.5 4.5 14v3.5H10V12H7.3c.2-1.8 1-3 2.2-3.8zm10 0C16 8 14.5 10.5 14.5 14v3.5H20V12h-2.7c.2-1.8 1-3 2.2-3.8z"
    fill="currentColor"
    stroke="none"
  />,
);
export const IconBike = mk(
  <>
    <circle cx="5.5" cy="16.5" r="3" />
    <circle cx="18.5" cy="16.5" r="3" />
    <path d="M5.5 16.5L9 9h4l3 5h2.5M13 9l-1.5-3H9M12 16.5h3.5" />
  </>,
);
export const IconRupee = mk(<path d="M6.5 4h11M6.5 8.5h11M7 4c4.5 0 6.5 1.5 6.5 4.5S10 13 7 13l7 7" />);
export const IconDiamond = mk(<path d="M12 3l7 6-7 12L5 9z M5 9h14M12 3l-2.5 6L12 21l2.5-12z" />);

export function StarIcon({ size = 16, className = "", filled = true }: { size?: number; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DiamondIcon({ size = 10, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M12 2l10 10-10 10L2 12z" fill="currentColor" />
    </svg>
  );
}

export function Spinner({ size = 22, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={`animate-spin ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
