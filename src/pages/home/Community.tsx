import { useState, type FormEvent } from "react";
import {
  IconArrow,
  IconClock,
  IconExternal,
  IconMail,
  IconPhone,
  IconPin,
  IconQuote,
  IconWhatsApp,
  Reveal,
  SectionHead,
  Stars,
} from "../../components/ui";
import { fmtDate } from "../../lib/db";
import { BRANCHES } from "../../lib/seed";
import { useStore } from "../../lib/store";

/* ---------------- reviews ---------------- */
export function Reviews() {
  const { reviews, addReview, hasOrdered } = useStore();
  const approved = reviews.filter((r) => r.approved && !r.hidden).slice(0, 6);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || rating === 0) return;
    addReview({ name: name.trim(), rating, text: text.trim() });
    setName("");
    setRating(0);
    setText("");
  };

  return (
    <section id="reviews" className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <SectionHead
            telugu="కస్టమర్ అభిప్రాయాలు"
            title="Sweet Words"
            sub="Unfiltered opinions from 2,400+ sweet-toothed Hyderabadis."
            center={false}
          />
          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {approved.map((r, i) => (
              <Reveal key={r.id} delay={(i % 2) * 100}>
                <figure className="h-full bg-cream-50 border border-gold-500/25 rounded-xl p-5 card-lift flex flex-col">
                  <div className="flex items-center justify-between">
                    <IconQuote size={26} className="text-saffron-500" />
                    <Stars value={r.rating} size={14} />
                  </div>
                  <blockquote className="text-[15px] text-ink-700 leading-relaxed mt-3 grow">
                    “{r.text}”
                  </blockquote>
                  <figcaption className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-gold-500/30">
                    <span className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-full bg-maroon-700 text-cream-100 grid place-items-center font-display text-sm">
                        {r.name.charAt(0)}
                      </span>
                      <span className="font-bold text-[14px] text-ink-900">{r.name}</span>
                    </span>
                    <span className="text-xs font-semibold text-ink-400">{fmtDate(r.date)}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:pt-24">
          <Reveal delay={150}>
            <form
              onSubmit={submit}
              className="bg-maroon-800 pattern-maroon border border-gold-500/30 rounded-2xl p-7 shadow-warm lg:sticky lg:top-28"
            >
              <p className="font-telugu text-saffron-400">రుచి ఎలా అనిపించింది?</p>
              <h3 className="font-display text-2xl text-cream-100 mt-0.5">Rate your experience</h3>
              {hasOrdered && (
                <p className="mt-3 text-[13px] font-bold text-maroon-900 bg-saffron-400 rounded-full px-3.5 py-1.5 inline-block pop-in">
                  You ordered recently — we'd love feedback!
                </p>
              )}
              <div className="mt-5 space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-maroon-900/60 border border-gold-500/30 rounded-xl px-4 py-3 text-cream-100 placeholder:text-cream-200/40 focus:outline-none focus:ring-2 focus:ring-saffron-500/60"
                />
                <div className="flex items-center justify-between bg-maroon-900/60 border border-gold-500/30 rounded-xl px-4 py-3">
                  <span className="text-sm font-semibold text-cream-200/80">Your rating</span>
                  <Stars value={rating} size={22} onChange={setRating} />
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="The boorelu reminded me of…"
                  className="w-full bg-maroon-900/60 border border-gold-500/30 rounded-xl px-4 py-3 text-cream-100 placeholder:text-cream-200/40 focus:outline-none focus:ring-2 focus:ring-saffron-500/60 resize-none"
                />
                <button
                  type="submit"
                  disabled={!name.trim() || !text.trim() || rating === 0}
                  className="btn-sweep w-full bg-saffron-500 text-maroon-900 font-bold rounded-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                >
                  Submit Review
                </button>
                <p className="text-xs text-cream-200/50 text-center">
                  Reviews appear after a quick approval by our team.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- locations ---------------- */
export function Locations() {
  const main = BRANCHES.find((b) => b.main)!;
  const others = BRANCHES.filter((b) => !b.main);
  return (
    <section id="locations" className="bg-cream-50 border-y border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <SectionHead
          telugu="మా శాఖలు"
          title="Our Locations"
          sub="Four stores, one promise — everything fried, soaked and packed the morning you order it."
        />
        <div className="mt-12 grid lg:grid-cols-5 gap-8">
          <Reveal className="lg:col-span-3">
            <div className="bg-cream-100 border border-gold-500/30 rounded-2xl overflow-hidden shadow-card h-full flex flex-col">
              <div className="p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl md:text-3xl text-maroon-800">{main.name}</h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-saffron-500 text-maroon-900 rounded-full px-3 py-1">
                    Main Store
                  </span>
                </div>
                <ul className="mt-5 space-y-3.5 text-[15px] text-ink-700">
                  <li className="flex gap-3">
                    <IconPin size={19} className="text-maroon-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{main.address}</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <IconPhone size={18} className="text-maroon-600 shrink-0" />
                    <a href="tel:+917948228100" className="font-semibold hover:text-maroon-700 transition-colors">{main.phone}</a>
                  </li>
                  <li className="flex gap-3 items-center">
                    <IconClock size={18} className="text-maroon-600 shrink-0" />
                    <span>Monday – Sunday · <strong>9:00 AM – 10:00 PM</strong></span>
                  </li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="tel:+917948228100"
                    className="btn-sweep inline-flex items-center gap-2 bg-maroon-700 text-cream-50 font-bold rounded-full px-5 py-2.5 text-sm"
                  >
                    <IconPhone size={16} /> Call Store
                  </a>
                  <span className="inline-flex items-center gap-2 border border-leaf-600/40 bg-leaf-600/10 text-leaf-700 font-bold rounded-full px-5 py-2.5 text-sm">
                    <IconArrow size={15} /> Home delivery available
                  </span>
                </div>
              </div>
              <div className="mt-auto border-t border-gold-500/25">
                <iframe
                  title="Teluginti Mithai Kukatpally on the map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=78.3830%2C17.4770%2C78.4170%2C17.4970&layer=mapnik&marker=17.4870%2C78.4000"
                  className="w-full h-64 md:h-72 border-0"
                  loading="lazy"
                />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Kukatpally+Housing+Board+Colony+Hyderabad+500072"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-maroon-700 hover:bg-cream-200/70 transition-colors"
                >
                  <IconExternal size={15} /> Open in Google Maps
                </a>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-2 space-y-5">
            {others.map((b, i) => (
              <Reveal key={b.name} delay={i * 110}>
                <div className="bg-cream-100 border border-gold-500/30 rounded-2xl p-6 card-lift h-full">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-display text-xl text-maroon-800 leading-snug">{b.name}</h4>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-maroon-700 text-cream-100 rounded-full px-3 py-1 shrink-0">
                      {b.area}
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] text-ink-500 leading-relaxed">{b.address}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <a href="tel:+917948228100" className="flex items-center gap-2 text-sm font-bold text-maroon-700 hover:text-maroon-900 transition-colors">
                      <IconPhone size={15} /> {b.phone}
                    </a>
                    <span className="text-xs font-semibold text-leaf-700 bg-leaf-600/10 rounded-full px-3 py-1">
                      9 AM – 10 PM · Delivery
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={330}>
              <p className="text-sm text-ink-500 bg-saffron-500/10 border border-saffron-500/40 rounded-xl px-5 py-4 font-medium">
                <strong className="text-maroon-700">Bulk & festival orders?</strong> Wedding laddus,
                Sankranti ariselu trays, office boxes — call us a day ahead and we'll keep it ready.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- contact ---------------- */
const ACTIONS = [
  {
    icon: IconPhone,
    label: "Call Now",
    sub: "+91 79482 28100",
    href: "tel:+917948228100",
  },
  {
    icon: IconMail,
    label: "Email Us",
    sub: "telugintimithai@gmail.com",
    href: "mailto:telugintimithai@gmail.com",
  },
  {
    icon: IconExternal,
    label: "Get Directions",
    sub: "Rythubazar Rd, Kukatpally",
    href: "https://www.google.com/maps/search/?api=1&query=Teluginti+Mithai+Rythubazar+Road+Kukatpally+Hyderabad",
  },
  {
    icon: IconWhatsApp,
    label: "WhatsApp",
    sub: "Chat with the counter",
    href: "https://wa.me/917948228100",
  },
];

export function Contact() {
  return (
    <section id="contact" className="bg-maroon-900 pattern-maroon relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <SectionHead
            dark
            telugu="సంప్రదించండి"
            title="Talk to Us"
            center={false}
            sub="Questions, bulk orders, or just want to know if the ghee halwa is still warm — we pick up."
          />
          <Reveal delay={150}>
            <address className="mt-8 not-italic space-y-3.5 text-[15px] text-cream-200/85">
              <p className="font-display text-xl text-cream-100">Teluginti Mithai</p>
              <p className="flex gap-3 leading-relaxed">
                <IconPin size={19} className="text-saffron-400 shrink-0 mt-0.5" />
                H.no. 15-29-1000, H-207, Phase I & II, Rythubazar Road, Near Post Office &
                Maharashtra Bank, Hyderabad, Telangana 500072, India.
              </p>
              <p className="flex gap-3 items-center">
                <IconPhone size={18} className="text-saffron-400 shrink-0" />
                +91 79482 28100
              </p>
              <p className="flex gap-3 items-center">
                <IconMail size={18} className="text-saffron-400 shrink-0" />
                telugintimithai@gmail.com
              </p>
              <p className="flex gap-3 items-center">
                <IconClock size={18} className="text-saffron-400 shrink-0" />
                Open all week · 9:00 AM – 10:00 PM
              </p>
            </address>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {ACTIONS.map((a, i) => (
            <Reveal key={a.label} delay={i * 90}>
              <a
                href={a.href}
                target={a.href.startsWith("http") ? "_blank" : undefined}
                rel={a.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex flex-col items-start bg-maroon-800/70 border border-gold-500/25 rounded-2xl p-6 hover:border-saffron-400/70 hover:bg-maroon-800 hover:-translate-y-1.5 transition-all duration-300 h-full"
              >
                <span className="grid place-items-center w-13 h-13 w-[52px] h-[52px] rounded-full bg-saffron-500/15 text-saffron-400 group-hover:bg-saffron-500 group-hover:text-maroon-900 transition-colors">
                  <a.icon size={24} />
                </span>
                <span className="font-display text-xl text-cream-100 mt-4">{a.label}</span>
                <span className="text-sm text-cream-200/70 mt-0.5 break-all">{a.sub}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-saffron-400 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all">
                  Open <IconArrow size={14} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
