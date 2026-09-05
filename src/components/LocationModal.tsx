import { useEffect, useState } from "react";
import { SERVICEABLE_PINCODES } from "../lib/seed";
import { useStore } from "../lib/store";
import { IconCheck, IconPin, IconX, Spinner } from "./ui";

const AREA_PINCODES = [
  { area: "Kukatpally", pin: "500072" },
  { area: "KPHB Colony", pin: "500072" },
  { area: "Allwyn Colony", pin: "500072" },
  { area: "Miyapur", pin: "500049" },
  { area: "JNTU Road", pin: "500085" },
  { area: "Nizampet", pin: "500090" },
  { area: "Pragathi Nagar", pin: "500090" },
  { area: "Bachupally", pin: "500090" },
  { area: "Kompally", pin: "500014" },
  { area: "Habsiguda", pin: "500007" },
  { area: "Bolarum", pin: "500010" },
];

export default function LocationModal() {
  const { locationOpen, setLocationOpen, location, saveLocation, toast } = useStore();
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [area, setArea] = useState("Kukatpally");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "no">("idle");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (locationOpen && location) {
      setAddress(location.address);
      setLandmark(location.landmark);
      setPincode(location.pincode);
      setArea(location.area || "Kukatpally");
      setPhone(location.phone);
      setStatus("ok");
    }
  }, [locationOpen, location]);

  useEffect(() => {
    if (!locationOpen) return;
    if (pincode.length === 6) {
      setStatus("checking");
      const t = window.setTimeout(
        () => setStatus(SERVICEABLE_PINCODES.includes(pincode) ? "ok" : "no"),
        550,
      );
      return () => window.clearTimeout(t);
    }
    setStatus("idle");
  }, [pincode, locationOpen]);

  if (!locationOpen) return null;

  const useGps = () => {
    if (!navigator.geolocation) {
      toast("Geolocation not supported — please enter manually", "warn");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false);
        setArea("Kukatpally (GPS)");
        setPincode("500072");
        setStatus("ok");
        toast("Location detected — Kukatpally zone ✓");
      },
      () => {
        setLocating(false);
        toast("Couldn't access location — please enter it manually", "warn");
      },
      { timeout: 6000 },
    );
  };

  const valid =
    address.trim().length >= 8 &&
    pincode.length === 6 &&
    phone.replace(/\D/g, "").length >= 10 &&
    status === "ok";

  const save = () => {
    if (!valid) return;
    saveLocation({ address: address.trim(), landmark: landmark.trim(), pincode, area, phone, mode: "manual" });
    setLocationOpen(false);
    toast(`Delivery location saved — ${area}`);
  };

  return (
    <div
      className="fixed inset-0 z-[85] bg-maroon-950/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
      onClick={() => setLocationOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Set delivery location"
    >
      <div
        className="bg-cream-50 rounded-2xl border border-gold-500/30 shadow-warm w-full max-w-lg my-8 pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-maroon-800 pattern-maroon rounded-t-2xl px-6 py-5 flex items-start justify-between">
          <div>
            <p className="font-telugu text-saffron-400 text-sm">డెలివరీ చిరునామా</p>
            <h2 className="font-display text-2xl text-cream-100 mt-0.5">Set Your Delivery Location</h2>
          </div>
          <button
            onClick={() => setLocationOpen(false)}
            className="text-cream-200 hover:text-saffron-400 transition-colors"
            aria-label="Close"
          >
            <IconX size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={useGps}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gold-500/60 bg-cream-100 hover:bg-cream-200/70 rounded-xl py-3 font-bold text-maroon-700 transition-colors disabled:opacity-60"
          >
            {locating ? <Spinner size={18} /> : <IconPin size={18} />}
            {locating ? "Locating you…" : "Use my current location"}
          </button>

          <div className="flex items-center gap-3 text-[13px] text-ink-400 font-semibold">
            <span className="h-px grow bg-gold-500/30" /> or enter manually <span className="h-px grow bg-gold-500/30" />
          </div>

          <div>
            <label className="text-[13px] font-bold text-ink-700 block mb-1">Area</label>
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                const found = AREA_PINCODES.find((a) => a.area === e.target.value);
                if (found) setPincode(found.pin);
              }}
              className="w-full border border-gold-500/40 bg-cream-100 rounded-xl px-3.5 py-2.5 font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
            >
              {AREA_PINCODES.map((a) => (
                <option key={a.area} value={a.area}>
                  {a.area} — {a.pin}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[13px] font-bold text-ink-700 block mb-1">Full address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="H.No, street, apartment / colony…"
              className="w-full border border-gold-500/40 bg-cream-100 rounded-xl px-3.5 py-2.5 text-ink-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[13px] font-bold text-ink-700 block mb-1">Landmark</label>
              <input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Near metro station…"
                className="w-full border border-gold-500/40 bg-cream-100 rounded-xl px-3.5 py-2.5 text-ink-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
              />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-700 block mb-1">Pincode</label>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="500072"
                inputMode="numeric"
                className="w-full border border-gold-500/40 bg-cream-100 rounded-xl px-3.5 py-2.5 text-ink-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-bold text-ink-700 block mb-1">Phone number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9XXXX XXXXX"
              inputMode="tel"
              className="w-full border border-gold-500/40 bg-cream-100 rounded-xl px-3.5 py-2.5 text-ink-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
            />
          </div>

          {status === "checking" && (
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-500 bg-cream-200/70 rounded-xl px-4 py-3">
              <Spinner size={16} className="text-saffron-600" /> Checking delivery availability…
            </p>
          )}
          {status === "ok" && (
            <p className="flex items-center gap-2 text-sm font-bold text-leaf-700 bg-leaf-600/10 border border-leaf-600/30 rounded-xl px-4 py-3 pop-in">
              <IconCheck size={17} /> Great news! We deliver to {pincode} — usually within 45–60 min.
            </p>
          )}
          {status === "no" && (
            <p className="text-sm font-bold text-maroon-700 bg-maroon-700/10 border border-maroon-700/30 rounded-xl px-4 py-3 pop-in">
              Sorry, {pincode} is outside our delivery zone today. You can still order for store
              pickup at Kukatpally, Kompally, Habsiguda or Bolarum.
            </p>
          )}

          <button
            onClick={save}
            disabled={!valid}
            className="btn-sweep w-full bg-maroon-700 text-cream-50 font-bold rounded-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
          >
            Confirm Delivery Location
          </button>
        </div>
      </div>
    </div>
  );
}
