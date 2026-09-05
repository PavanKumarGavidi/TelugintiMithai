import { useEffect } from "react";
import Admin from "./admin/Admin";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LocationModal from "./components/LocationModal";
import { IconCheck, IconX } from "./components/ui";
import { useRoute } from "./lib/router";
import { StoreProvider, useStore } from "./lib/store";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import { ConfirmationPage, TrackPage } from "./pages/OrderPages";

function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="fixed top-20 right-4 z-[95] space-y-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-in flex items-center gap-2.5 rounded-xl shadow-warm px-4 py-3 text-sm font-bold border max-w-[320px] ${
            t.kind === "ok"
              ? "bg-maroon-800 text-cream-100 border-gold-500/40"
              : "bg-saffron-500 text-maroon-900 border-saffron-600"
          }`}
        >
          <span className={`grid place-items-center w-6 h-6 rounded-full shrink-0 ${t.kind === "ok" ? "bg-saffron-500 text-maroon-900" : "bg-maroon-900 text-saffron-400"}`}>
            {t.kind === "ok" ? <IconCheck size={13} /> : <IconX size={13} />}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function Shell() {
  const { path, parts } = useRoute();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [path]);

  const isAdmin = parts[0] === "admin";

  if (isAdmin) {
    return (
      <>
        <Admin />
        <Toasts />
        <div className="noise-overlay" aria-hidden="true" />
      </>
    );
  }

  let page = <Home />;
  if (parts[0] === "menu") page = <Menu />;
  else if (parts[0] === "checkout") page = <Checkout />;
  else if (parts[0] === "order" && parts[1]) page = <ConfirmationPage id={parts[1]} />;
  else if (parts[0] === "track") page = <TrackPage id={parts[1]} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">{page}</main>
      <Footer />
      <CartDrawer />
      <LocationModal />
      <Toasts />
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
