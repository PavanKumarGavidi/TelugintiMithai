import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadDB, mergeRemote, newOrderId, saveDB } from "./db";
import { buildTotals } from "./seed";
import {
  sbEnabled,
  sbHasSession,
  sbInvalidateSnapshot,
  sbOnAuthChange,
  sbPullAll,
  sbPushAll,
  sbSignIn,
  sbSignOut,
} from "./supabase";
import type {
  CartItem,
  Category,
  DB,
  Offer,
  Order,
  OrderStatus,
  Payment,
  Product,
  Review,
  SavedLocation,
} from "./types";

export interface ToastMsg {
  id: number;
  msg: string;
  kind: "ok" | "warn";
}

export interface CheckoutInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  instructions: string;
  payment: Payment;
}

export type MenuTab = Category | "popular";

interface StoreValue {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  offer: Offer;
  ledger: DB["ledger"];

  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  totals: { subtotal: number; discount: number; delivery: number; total: number };

  location: SavedLocation | null;
  saveLocation: (l: SavedLocation) => void;
  clearLocation: () => void;
  locationOpen: boolean;
  setLocationOpen: (v: boolean) => void;

  menuCat: MenuTab;
  setMenuCat: (c: MenuTab) => void;
  hasOrdered: boolean;
  markOrdered: () => void;

  authed: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  cloudConnected: boolean;

  toasts: ToastMsg[];
  toast: (msg: string, kind?: "ok" | "warn") => void;

  placeOrder: (info: CheckoutInfo) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  updateOffer: (o: Offer) => void;
  addReview: (r: { name: string; rating: number; text: string }) => void;
  reviewAction: (id: string, action: "approve" | "hide" | "delete") => void;
}

const Ctx = createContext<StoreValue | null>(null);

export function useStore(): StoreValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DB>(() => loadDB());
  const [cart, setCart] = useState<CartItem[]>(() => readLS<CartItem[]>("tm_cart", []));
  const [location, setLocation] = useState<SavedLocation | null>(() =>
    readLS<SavedLocation | null>("tm_loc", null),
  );
  const [authed, setAuthed] = useState<boolean>(() => localStorage.getItem("tm_admin") === "1");
  const [cartOpen, setCartOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [menuCat, setMenuCat] = useState<MenuTab>("popular");
  const [hasOrdered, setHasOrdered] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => saveDB(data), [data]);
  useEffect(() => localStorage.setItem("tm_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => {
    if (location) localStorage.setItem("tm_loc", JSON.stringify(location));
    else localStorage.removeItem("tm_loc");
  }, [location]);

  const toast = useCallback((msg: string, kind: "ok" | "warn" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, msg, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  /* ---------------- cart ---------------- */
  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === id);
      return found ? prev.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c)) : [...prev, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) => (qty <= 0 ? prev.filter((c) => c.id !== id) : prev.map((c) => (c.id === id ? { ...c, qty } : c))));
  }, []);

  const inc = useCallback((id: string) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c)));
  }, []);

  const dec = useCallback((id: string) => {
    setCart((prev) =>
      prev.flatMap((c) => (c.id === id ? (c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : []) : [c])),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totals = useMemo(() => {
    const items = cart
      .map((c) => {
        const p = data.products.find((x) => x.id === c.id);
        return p ? { id: p.id, name: p.name, price: p.price, qty: c.qty, unit: p.unit } : null;
      })
      .filter(Boolean) as Order["items"];
    return buildTotals(items, data.offer);
  }, [cart, data.products, data.offer]);

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

  /* ---------------- orders ---------------- */
  const placeOrder = useCallback(
    (info: CheckoutInfo): Order => {
      const items = cart
        .map((c) => {
          const p = data.products.find((x) => x.id === c.id);
          return p ? { id: p.id, name: p.name, price: p.price, qty: c.qty, unit: p.unit } : null;
        })
        .filter(Boolean) as Order["items"];
      const t = buildTotals(items, data.offer);
      const order: Order = {
        id: newOrderId(data.orders),
        createdAt: Date.now(),
        name: info.name,
        phone: info.phone,
        email: info.email,
        address: info.address,
        landmark: info.landmark,
        city: info.city,
        pincode: info.pincode,
        instructions: info.instructions,
        items,
        ...t,
        payment: info.payment,
        status: "Placed",
        adminSet: false,
      };
      setData((d) => ({ ...d, orders: [order, ...d.orders] }));
      setCart([]);
      setHasOrdered(true);
      return order;
    },
    [cart, data.products, data.offer, data.orders],
  );

  const setOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id ? { ...o, status, adminSet: true } : o)),
    }));
  }, []);

  /* ---------------- admin: products ---------------- */
  const upsertProduct = useCallback((p: Product) => {
    setData((d) => {
      const exists = d.products.some((x) => x.id === p.id);
      return {
        ...d,
        products: exists ? d.products.map((x) => (x.id === p.id ? p : x)) : [p, ...d.products],
      };
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setData((d) => ({ ...d, products: d.products.filter((x) => x.id !== id) }));
  }, []);

  const updateOffer = useCallback((o: Offer) => {
    setData((d) => ({ ...d, offer: o }));
  }, []);

  /* ---------------- reviews ---------------- */
  const addReview = useCallback(
    (r: { name: string; rating: number; text: string }) => {
      const review: Review = {
        id: `r${Date.now()}`,
        name: r.name,
        rating: r.rating,
        text: r.text,
        date: new Date().toISOString().slice(0, 10),
        approved: false,
        hidden: false,
      };
      setData((d) => ({ ...d, reviews: [review, ...d.reviews] }));
      toast("Thanks! Your review will appear once approved.", "ok");
    },
    [toast],
  );

  const reviewAction = useCallback((id: string, action: "approve" | "hide" | "delete") => {
    setData((d) => ({
      ...d,
      reviews:
        action === "delete"
          ? d.reviews.filter((r) => r.id !== id)
          : d.reviews.map((r) =>
              r.id === id
                ? { ...r, approved: action === "approve" ? true : r.approved, hidden: action === "hide" ? true : action === "approve" ? false : r.hidden }
                : r,
            ),
    }));
  }, []);

  /* ---------------- auth (Supabase when configured, local demo fallback) ---------------- */
  const login = useCallback(
    async (u: string, p: string): Promise<boolean> => {
      if (sbEnabled() && u.includes("@")) {
        const res = await sbSignIn(u.trim(), p);
        if (res.ok) {
          setAuthed(true);
          localStorage.setItem("tm_admin", "1");
          sbInvalidateSnapshot();
          const remote = await sbPullAll();
          if (remote) setData((d) => mergeRemote(d, remote));
          return true;
        }
        toast(`Supabase: ${res.error}`, "warn");
      }
      // local demo / emergency fallback
      if (u.trim().toLowerCase() === "admin" && p === "mithai2026") {
        setAuthed(true);
        localStorage.setItem("tm_admin", "1");
        return true;
      }
      return false;
    },
    [toast],
  );

  const logout = useCallback(() => {
    setAuthed(false);
    localStorage.removeItem("tm_admin");
    if (sbEnabled()) void sbSignOut();
  }, []);

  /* ---------------- Supabase sync (only when keys are configured) ---------------- */
  useEffect(() => {
    if (!sbEnabled()) return;
    let cancelled = false;
    sbHasSession().then((has) => {
      if (!cancelled && has) setAuthed(true);
    });
    const unsub = sbOnAuthChange((has) => {
      if (cancelled) return;
      if (!has) setAuthed(false);
    });
    sbPullAll().then((remote) => {
      if (!cancelled && remote) setData((d) => mergeRemote(d, remote));
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  useEffect(() => {
    if (sbEnabled()) sbPushAll(data);
  }, [data]);

  const value: StoreValue = {
    products: data.products,
    orders: data.orders,
    reviews: data.reviews,
    offer: data.offer,
    ledger: data.ledger,
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    setQty,
    inc,
    dec,
    removeItem,
    clearCart,
    cartCount,
    totals,
    location,
    saveLocation: setLocation,
    clearLocation: () => setLocation(null),
    locationOpen,
    setLocationOpen,
    menuCat,
    setMenuCat,
    hasOrdered,
    markOrdered: () => setHasOrdered(true),
    authed,
    login,
    logout,
    toasts,
    toast,
    placeOrder,
    setOrderStatus,
    upsertProduct,
    deleteProduct,
    updateOffer,
    addReview,
    reviewAction,
    cloudConnected: sbEnabled(),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
