import { goSection, Link } from "../lib/router";
import { useStore } from "../lib/store";
import { CATEGORIES } from "../lib/types";
import { DiyaLogo, IconClock, IconMail, IconPhone, IconPin } from "./ui";

export default function Footer() {
  const { setMenuCat, offer } = useStore();
  return (
    <footer className="bg-maroon-900 pattern-maroon text-cream-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <DiyaLogo size={46} />
            <div className="leading-none">
              <p className="font-display text-xl text-cream-100">
                Teluginti <span className="text-saffron-400">Mithai</span>
              </p>
              <p className="font-telugu text-[12px] text-cream-200/70 mt-1">తెలుగింటి మిఠాయి</p>
            </div>
          </div>
          <p className="text-sm text-cream-200/75 mt-4 leading-relaxed">
            Authentic Andhra-style sweets, laddus, kajas, halwas and homemade delicacies — prepared
            with classic family recipes since 1998.
          </p>
          {offer.active && (
            <p className="mt-4 inline-block text-[13px] font-bold text-maroon-900 bg-saffron-400 rounded-full px-3.5 py-1.5">
              {offer.title} · {offer.code}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-display text-lg text-saffron-400">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link to="/" className="hover:text-saffron-400 transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-saffron-400 transition-colors">Full Menu</Link></li>
            <li><button onClick={() => goSection("about")} className="hover:text-saffron-400 transition-colors">About Us</button></li>
            <li><button onClick={() => goSection("gallery")} className="hover:text-saffron-400 transition-colors">Gallery</button></li>
            <li><button onClick={() => goSection("reviews")} className="hover:text-saffron-400 transition-colors">Reviews</button></li>
            <li><Link to="/track" className="hover:text-saffron-400 transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-saffron-400">Sweet Categories</h4>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  to="/menu"
                  onClick={() => setMenuCat(c.id)}
                  className="hover:text-saffron-400 transition-colors"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-saffron-400">Kukatpally Store</h4>
          <ul className="mt-4 space-y-3 text-[14px] text-cream-200/85">
            <li className="flex gap-2.5">
              <IconPin size={17} className="text-saffron-400 shrink-0 mt-0.5" />
              <span>H-207, Rythubazar Road, Near Post Office & Maharashtra Bank, KPHB Colony, Hyderabad — 500072</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <IconPhone size={16} className="text-saffron-400 shrink-0" />
              <a href="tel:+917948228100" className="hover:text-saffron-400 transition-colors">+91 79482 28100</a>
            </li>
            <li className="flex gap-2.5 items-center">
              <IconMail size={16} className="text-saffron-400 shrink-0" />
              <a href="mailto:telugintimithai@gmail.com" className="hover:text-saffron-400 transition-colors break-all">
                telugintimithai@gmail.com
              </a>
            </li>
            <li className="flex gap-2.5 items-center">
              <IconClock size={16} className="text-saffron-400 shrink-0" />
              <span>Mon – Sun · 9:00 AM – 10:00 PM</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-cream-200/60">
          <p>© 2026 Teluginti Mithai · Crafted with ghee & love in Hyderabad</p>
          <div className="flex items-center gap-4">
            <span className="font-telugu text-saffron-400/80">రుచి అంటే మా ఇంటి పేరు</span>
            <Link to="/admin" className="hover:text-saffron-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
