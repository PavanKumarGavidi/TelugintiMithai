import { useState, type ChangeEvent, type FormEvent } from "react";
import { IconArrow, IconBolt, IconChevronLeft, IconPin, IconRupee, Reveal, Spinner } from "../components/ui";
import { inr } from "../lib/db";
import { Link, navigate } from "../lib/router";
import { useStore, type CheckoutInfo } from "../lib/store";
import type { Payment } from "../lib/types";

function CardIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 10h19M6.5 14.5h4" />
    </svg>
  );
}

const PAYMENTS: { id: Payment; label: string; sub: string; icon: typeof IconRupee }[] = [
  { id: "Cash on Delivery", label: "Cash on Delivery", sub: "Pay when the box arrives", icon: IconRupee },
  { id: "UPI", label: "UPI", sub: "GPay, PhonePe, Paytm", icon: IconBolt },
  { id: "Online Payment", label: "Online Payment", sub: "Cards & netbanking", icon: CardIcon },
];

export default function Checkout() {
  const { cart, products, totals, offer, location, setLocationOpen, placeOrder, toast } = useStore();
  const [form, setForm] = useState({
    name: "",
    phone: location?.phone ?? "",
    email: "",
    address: location?.address ?? "",
    landmark: location?.landmark ?? "",
    city: "Hyderabad",
    pincode: location?.pincode ?? "",
    instructions: "",
  });
  const [payment, setPayment] = useState<Payment>("Cash on Delivery");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const lines = cart
    .map((c) => {
      const p = products.find((x) => x.id === c.id);
      return p ? { ...c, p } : null;
    })
    .filter(Boolean) as { id: string; qty: number; p: (typeof products)[number] }[];

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-4xl text-maroon-800">Your cart is empty</p>
        <p className="text-ink-500 mt-3 text-lg">Add a few sweets first — the kaja won't order itself.</p>
        <Link to="/menu" className="btn-sweep inline-flex items-center gap-2 mt-8 bg-maroon-700 text-cream-50 font-bold rounded-full px-7 py-3.5">
          Back to Menu <IconArrow size={18} />
        </Link>
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Please enter your full name";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid 10-digit mobile number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "That email doesn't look right";
    if (form.address.trim().length < 8) e.address = "Please enter your full delivery address";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields", "warn");
      return;
    }
    setProcessing(true);
    const delay = payment === "Cash on Delivery" ? 600 : 1500;
    window.setTimeout(() => {
      const info: CheckoutInfo = { ...form, name: form.name.trim(), address: form.address.trim(), payment };
      const order = placeOrder(info);
      toast(`Order ${order.id} placed!`);
      navigate(`/order/${order.id}`);
    }, delay);
  };

  const inputCls = (k: string) =>
    `w-full border rounded-xl px-3.5 py-2.5 bg-cream-100 text-ink-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 ${
      errors[k] ? "border-maroon-600" : "border-gold-500/40"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <Link to="/menu" className="inline-flex items-center gap-1.5 text-sm font-bold text-maroon-700 hover:text-maroon-900 transition-colors">
        <IconChevronLeft size={16} /> Keep shopping
      </Link>
      <h1 className="font-display text-4xl md:text-5xl text-maroon-800 mt-3">
        Checkout <span className="font-telugu text-2xl text-saffron-600 ml-2">చెక్అవుట్</span>
      </h1>

      <form onSubmit={submit} className="mt-8 grid lg:grid-cols-5 gap-8 items-start">
        <Reveal className="lg:col-span-3">
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 md:p-7 shadow-card">
            <h2 className="font-display text-2xl text-maroon-800">Delivery Details</h2>

            {location && (
              <div className="mt-4 flex items-start justify-between gap-3 bg-cream-100 border border-gold-500/30 rounded-xl px-4 py-3">
                <p className="flex gap-2.5 text-sm text-ink-700">
                  <IconPin size={17} className="text-maroon-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{location.area}</strong> · {location.address}
                    {location.landmark ? ` · Near ${location.landmark}` : ""} · {location.pincode}
                  </span>
                </p>
                <button type="button" onClick={() => setLocationOpen(true)} className="text-sm font-bold text-maroon-700 underline underline-offset-2 shrink-0">
                  Change
                </button>
              </div>
            )}

            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-ink-700 block mb-1">Customer name *</label>
                <input value={form.name} onChange={set("name")} placeholder="Srikanth Varma" className={inputCls("name")} />
                {errors.name && <p className="text-xs font-bold text-maroon-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-700 block mb-1">Mobile number *</label>
                <input value={form.phone} onChange={set("phone")} placeholder="9XXXX XXXXX" inputMode="tel" className={inputCls("phone")} />
                {errors.phone && <p className="text-xs font-bold text-maroon-600 mt-1">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-[13px] font-bold text-ink-700 block mb-1">Email (for order updates)</label>
                <input value={form.email} onChange={set("email")} placeholder="you@example.com" type="email" className={inputCls("email")} />
                {errors.email && <p className="text-xs font-bold text-maroon-600 mt-1">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-[13px] font-bold text-ink-700 block mb-1">Delivery address *</label>
                <textarea value={form.address} onChange={set("address")} rows={2} placeholder="H.No, street, apartment…" className={`${inputCls("address")} resize-none`} />
                {errors.address && <p className="text-xs font-bold text-maroon-600 mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-700 block mb-1">Landmark</label>
                <input value={form.landmark} onChange={set("landmark")} placeholder="Near metro station" className={inputCls("landmark")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-bold text-ink-700 block mb-1">City</label>
                  <input value={form.city} onChange={set("city")} className={inputCls("city")} />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-ink-700 block mb-1">Pincode *</label>
                  <input value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))} inputMode="numeric" placeholder="500072" className={inputCls("pincode")} />
                  {errors.pincode && <p className="text-xs font-bold text-maroon-600 mt-1">{errors.pincode}</p>}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[13px] font-bold text-ink-700 block mb-1">Delivery instructions</label>
                <textarea value={form.instructions} onChange={set("instructions")} rows={2} placeholder="Ring the bell twice · leave at reception…" className={`${inputCls("instructions")} resize-none`} />
              </div>
            </div>

            <h2 className="font-display text-2xl text-maroon-800 mt-8">Payment Method</h2>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {PAYMENTS.map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => setPayment(pm.id)}
                  className={`text-left rounded-xl border-2 p-4 transition-all ${
                    payment === pm.id
                      ? "border-maroon-700 bg-maroon-700/5 shadow-card"
                      : "border-gold-500/30 bg-cream-100 hover:border-maroon-600/40"
                  }`}
                >
                  <span className={`inline-grid place-items-center w-10 h-10 rounded-full ${payment === pm.id ? "bg-maroon-700 text-cream-100" : "bg-cream-200 text-maroon-700"}`}>
                    <pm.icon size={20} />
                  </span>
                  <span className="block font-bold text-[15px] text-ink-900 mt-2.5">{pm.label}</span>
                  <span className="block text-xs text-ink-500 font-medium mt-0.5">{pm.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-2 lg:sticky lg:top-28">
          <div className="bg-cream-50 border border-gold-500/30 rounded-2xl p-6 shadow-card">
            <h2 className="font-display text-2xl text-maroon-800">Order Summary</h2>
            <ul className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
              {lines.map(({ id, qty, p }) => (
                <li key={id} className="flex items-center gap-3">
                  <img src={p.img} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="grow min-w-0">
                    <p className="font-bold text-[14px] text-ink-900 truncate">{p.name}</p>
                    <p className="text-xs text-ink-400 font-medium">{qty} × {inr(p.price)} · {p.unit}</p>
                  </div>
                  <span className="font-display text-maroon-700 text-sm">{inr(p.price * qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 pt-4 border-t border-dashed border-gold-500/40 space-y-1.5 text-[15px]">
              <div className="flex justify-between text-ink-700"><dt>Subtotal</dt><dd className="font-semibold tabular-nums">{inr(totals.subtotal)}</dd></div>
              <div className="flex justify-between text-leaf-600 font-semibold">
                <dt>Discount ({offer.pct}%)</dt><dd className="tabular-nums">− {inr(totals.discount)}</dd>
              </div>
              <div className="flex justify-between text-ink-700">
                <dt>Delivery</dt>
                <dd className="font-semibold tabular-nums">{totals.delivery === 0 ? <span className="text-leaf-600">FREE</span> : inr(totals.delivery)}</dd>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gold-500/30">
                <dt className="font-display text-lg text-maroon-800">Total</dt>
                <dd className="font-display text-3xl text-maroon-800 tabular-nums">{inr(totals.total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={processing}
              className="btn-sweep mt-6 w-full bg-maroon-700 text-cream-50 font-bold text-lg rounded-full py-4 disabled:opacity-70 active:scale-[0.98] transition-transform flex items-center justify-center gap-2.5"
            >
              {processing ? (
                <>
                  <Spinner size={20} className="text-saffron-400" />
                  {payment === "Cash on Delivery" ? "Placing your order…" : "Connecting to payment…"}
                </>
              ) : (
                <>Place Order · {inr(totals.total)}</>
              )}
            </button>
            <p className="text-center text-xs text-ink-400 font-medium mt-3">
              Estimated delivery 45–60 min after confirmation
            </p>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
