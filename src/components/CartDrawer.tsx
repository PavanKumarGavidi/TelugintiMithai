import { inr } from "../lib/db";
import { navigate } from "../lib/router";
import { useStore } from "../lib/store";
import { IconArrow, IconBike, IconCart, IconTrash, IconX, QtyStepper } from "./ui";

const FREE_AT = 499;

export default function CartDrawer() {
  const {
    cart,
    products,
    cartOpen,
    setCartOpen,
    inc,
    dec,
    removeItem,
    clearCart,
    totals,
    cartCount,
    offer,
    location,
    setLocationOpen,
    toast,
  } = useStore();

  const lines = cart
    .map((c) => {
      const p = products.find((x) => x.id === c.id);
      return p ? { ...c, p } : null;
    })
    .filter(Boolean) as { id: string; qty: number; p: (typeof products)[number] }[];

  const base = totals.subtotal - totals.discount;
  const remaining = Math.max(0, FREE_AT - base);
  const progress = Math.min(100, (base / FREE_AT) * 100);

  const checkout = () => {
    if (lines.length === 0) return;
    if (!location) {
      setCartOpen(false);
      setLocationOpen(true);
      toast("First, tell us where to deliver 🛵", "warn");
      return;
    }
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-maroon-950/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-cream-50 shadow-warm flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-500/25 bg-cream-100">
          <div>
            <h2 className="font-display text-2xl text-maroon-800">Your Thali</h2>
            <p className="text-[13px] text-ink-500 font-medium">
              {cartCount} item{cartCount === 1 ? "" : "s"} · fresh from Kukatpally
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lines.length > 0 && (
              <button
                onClick={() => {
                  clearCart();
                  toast("Cart emptied");
                }}
                className="text-xs font-bold text-maroon-600 hover:text-maroon-800 underline underline-offset-2"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setCartOpen(false)}
              className="grid place-items-center w-9 h-9 rounded-full hover:bg-cream-200 text-ink-700 transition-colors"
              aria-label="Close cart"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="grow grid place-items-center px-8 text-center">
            <div>
              <div className="mx-auto w-24 h-24 rounded-full bg-cream-200 grid place-items-center text-gold-500">
                <IconCart size={40} />
              </div>
              <p className="font-display text-2xl text-maroon-800 mt-5">Nothing here yet</p>
              <p className="text-ink-500 text-sm mt-1.5">
                Boorelu, kajas, halwa… your cravings deserve better.
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/menu");
                }}
                className="btn-sweep mt-6 inline-flex items-center gap-2 bg-maroon-700 text-cream-50 font-bold rounded-full px-6 py-3"
              >
                Browse the menu <IconArrow size={17} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grow overflow-y-auto px-5 py-4 space-y-4">
              {lines.map(({ id, qty, p }) => (
                <div key={id} className="flex gap-3 bg-cream-100 border border-gold-500/20 rounded-xl p-3">
                  <img src={p.img} alt={p.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-[15px] text-ink-900 truncate">{p.name}</p>
                        <p className="text-xs text-ink-400 font-medium">
                          {inr(p.price)} / {p.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          removeItem(id);
                          toast(`${p.name} removed`);
                        }}
                        className="text-ink-400 hover:text-maroon-600 transition-colors shrink-0"
                        aria-label={`Remove ${p.name}`}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <QtyStepper small qty={qty} onInc={() => inc(id)} onDec={() => dec(id)} />
                      <span className="font-display text-maroon-700">{inr(p.price * qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gold-500/25 bg-cream-100 px-5 py-4 space-y-3">
              <div className="bg-cream-50 border border-gold-500/25 rounded-xl p-3">
                <div className="flex items-center gap-2 text-[13px] font-bold text-ink-700">
                  <IconBike size={17} className="text-maroon-600" />
                  {remaining > 0 ? (
                    <span>
                      Add <span className="text-maroon-700">{inr(remaining)}</span> more for{" "}
                      <span className="text-leaf-600">FREE delivery</span>
                    </span>
                  ) : (
                    <span className="text-leaf-600">You unlocked FREE delivery! 🎉</span>
                  )}
                </div>
                <div className="h-2 bg-cream-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 to-saffron-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <dl className="text-[15px] space-y-1.5">
                <div className="flex justify-between text-ink-700">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold tabular-nums">{inr(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-leaf-600 font-semibold">
                  <dt>Discount ({offer.pct}% · {offer.code})</dt>
                  <dd className="tabular-nums">− {inr(totals.discount)}</dd>
                </div>
                <div className="flex justify-between text-ink-700">
                  <dt>Delivery</dt>
                  <dd className="font-semibold tabular-nums">
                    {totals.delivery === 0 ? <span className="text-leaf-600">FREE</span> : inr(totals.delivery)}
                  </dd>
                </div>
                <div className="border-t border-dashed border-gold-500/40 pt-2 mt-2 flex justify-between items-center">
                  <dt className="font-display text-lg text-maroon-800">Total</dt>
                  <dd className="font-display text-2xl text-maroon-800 tabular-nums">{inr(totals.total)}</dd>
                </div>
              </dl>

              <button
                onClick={checkout}
                className="btn-sweep w-full bg-maroon-700 text-cream-50 font-bold rounded-full py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                Proceed to Checkout <IconArrow size={18} />
              </button>
              <p className="text-center text-xs text-ink-400">
                {location
                  ? `Delivering to ${location.area || "your saved address"} · ${location.pincode}`
                  : "You'll set your delivery location next"}
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
