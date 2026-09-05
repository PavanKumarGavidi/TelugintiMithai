import type {
  Branch,
  DB,
  LedgerMonth,
  Offer,
  Order,
  OrderItem,
  OrderStatus,
  Payment,
  Product,
  Review,
} from "./types";

export const IMG = {
  thali:
    "https://image.qwenlm.ai/generated-images/237e98ba-23cb-426e-88b0-08d74c6a12f0/_result.png",
  laddus:
    "https://image.qwenlm.ai/generated-images/23e4dccb-fc24-49eb-8de6-fed5611dd26d/_result.png",
  kaja: "https://image.qwenlm.ai/generated-images/67223518-a6c1-4186-901b-a87e6b2b2028/_result.png",
  katli:
    "https://image.qwenlm.ai/generated-images/ab5865d1-83e8-4a10-9e44-d6522d419d1a/_result.png",
  halwa:
    "https://image.qwenlm.ai/generated-images/ae0486e3-9300-4026-bd25-ae10f6abe6da/_result.png",
  snacks:
    "https://image.qwenlm.ai/generated-images/614df67f-4391-4d5b-84ed-92007f38c3a8/_result.png",
  bobbatlu:
    "https://image.qwenlm.ai/generated-images/ccaa3423-63e3-4068-8bed-9d755fc98cd1/_result.png",
  store:
    "https://image.qwenlm.ai/generated-images/f0d3b1ea-eb3f-4532-944c-0ec616e4e298/_result.png",
};

export const GALLERY: { src: string; caption: string; cat: string }[] = [
  { src: IMG.thali, caption: "The Teluginti grand thali — our festive platter", cat: "Sweets" },
  { src: IMG.laddus, caption: "Boorelu, fresh from the kadai every morning", cat: "Laddus" },
  { src: IMG.kaja, caption: "Madatha kaja — 24 flaky layers, one bite", cat: "Kajas" },
  { src: IMG.katli, caption: "Kaju katli cut to order, silver-leafed", cat: "Products" },
  { src: IMG.halwa, caption: "Ghee halwa, caramelised over slow flame", cat: "Halwa" },
  { src: IMG.snacks, caption: "Janthikalu & karappusa in the evening rush", cat: "Snacks" },
  { src: IMG.bobbatlu, caption: "Bobbatlu rolled by hand, the old way", cat: "Traditional" },
  { src: IMG.store, caption: "Our Kukatpally store at Rythubazar Road", cat: "Store" },
];

export const BRANCHES: Branch[] = [
  {
    name: "Teluginti Mithai — Kukatpally",
    area: "Kukatpally",
    address:
      "H-207, Phase I & II, H.No. 15-29-1000, Rythubazar Road, Near Post Office & Maharashtra Bank, Kukatpally Housing Board Colony, Hyderabad, Telangana 500072",
    phone: "+91 79482 28100",
    main: true,
  },
  {
    name: "Teluginti Mithai — Kompally",
    area: "Kompally",
    address: "Plot 12, Kompally Main Road, Near Bus Depot Circle, Kompally, Hyderabad, Telangana 500014",
    phone: "+91 79482 28100",
  },
  {
    name: "Teluginti Mithai — Habsiguda",
    area: "Habsiguda",
    address: "1-98/2, NGRI Road, Near Habsiguda X Roads, Habsiguda, Hyderabad, Telangana 500007",
    phone: "+91 79482 28100",
  },
  {
    name: "Teluginti Mithai — Bolarum",
    area: "Bolarum",
    address: "Plot 45, Bolarum Main Road, Near Railway Gate, Secunderabad, Telangana 500010",
    phone: "+91 79482 28100",
  },
];

export const SERVICEABLE_PINCODES = [
  "500072",
  "500085",
  "500071",
  "500076",
  "500078",
  "500079",
  "500038",
  "500014",
  "500007",
  "500010",
  "500043",
  "500070",
  "500090",
  "500049",
];

const P = (
  id: string,
  name: string,
  telugu: string,
  desc: string,
  price: number,
  unit: string,
  category: Product["category"],
  img: string,
  rating: number,
  reviews: number,
  tag?: Product["tag"],
): Product => ({ id, name, telugu, desc, price, unit, category, img, rating, reviews, tag, available: true });

export const PRODUCTS: Product[] = [
  // ---- Sweets ----
  P("p1", "Kaju Katli", "కాజూ కట్లి", "Silky cashew fudge diamonds finished with edible silver leaf.", 480, "500 g", "sweets", IMG.katli, 4.9, 412, "Bestseller"),
  P("p2", "Kaju Barfi", "కాజూ బర్ఫీ", "Slow-roasted cashews and milk solids, cut into soft squares.", 440, "500 g", "sweets", IMG.katli, 4.8, 268),
  P("p3", "Dry Fruit Barfi", "డ్రై ఫ్రూట్ బర్ఫీ", "Almonds, pistachios and figs pressed into a rich, royal barfi.", 520, "500 g", "sweets", IMG.katli, 4.7, 96, "New"),
  P("p4", "Ariselu", "అరిసెలు", "Rice-flour and jaggery patties deep-fried in ghee — a Telugu festival classic.", 280, "500 g", "sweets", IMG.thali, 4.9, 351, "Signature"),
  P("p5", "Pootharekulu", "పూతారెకులు", "Paper-thin rice sheets layered with ghee and jaggery, Atreyapuram style.", 350, "250 g", "sweets", IMG.thali, 4.8, 189, "Signature"),
  // ---- Laddus ----
  P("p6", "Boorelu", "బూరెలు", "Crisp urad-dal shells filled with jaggery and coconut, fried golden.", 260, "500 g", "laddus", IMG.laddus, 4.9, 524, "Bestseller"),
  P("p7", "Motichoor Laddu", "మోతీచూర్ లడ్డూ", "Fine boondi pearls bound in saffron syrup with melon seeds.", 240, "500 g", "laddus", IMG.laddus, 4.7, 301),
  P("p8", "Bellam Sunundalu", "బెల్లం సున్నుండలు", "Sesame and peanut laddus sweetened with palm jaggery.", 250, "500 g", "laddus", IMG.laddus, 4.8, 176),
  P("p9", "Dry Fruit Laddu", "డ్రై ఫ్రూట్ లడ్డూ", "Dates, cashews and almonds rolled without a grain of sugar.", 420, "500 g", "laddus", IMG.laddus, 4.8, 88, "New"),
  // ---- Kajas ----
  P("p10", "Madatha Kaja", "మడత కాజా", "Our signature: flaky folded layers soaked in a light sugar syrup.", 240, "500 g", "kajas", IMG.kaja, 4.9, 487, "Bestseller"),
  P("p11", "Pakam Kaja", "పాకం కాజా", "Soft-centred kaja with a crisp outer crust and jaggery notes.", 230, "500 g", "kajas", IMG.kaja, 4.8, 214),
  P("p12", "Kaju Kaja", "కాజూ కాజా", "Traditional crispy sweet layered with premium cashew paste.", 380, "500 g", "kajas", IMG.kaja, 4.8, 143, "Signature"),
  P("p13", "Ghee Kaja", "నెయ్యి కాజా", "Kaja laminated with pure cow ghee for an extra-flaky bite.", 270, "500 g", "kajas", IMG.kaja, 4.7, 167),
  // ---- Halwa ----
  P("p14", "Ghee Halwa", "నెయ్యి హల్వా", "Wheat halwa caramelised in pure ghee with cashews and raisins.", 260, "500 g", "halwa", IMG.halwa, 4.9, 398, "Bestseller"),
  P("p15", "Carrot Halwa", "క్యారట్ హల్వా", "Grated carrots slow-cooked with khoya and green cardamom.", 250, "500 g", "halwa", IMG.halwa, 4.7, 152),
  P("p16", "Apricot Halwa", "జల్లూడు హల్వా", "Tangy-sweet apricot halwa — a Hyderabadi wedding favourite.", 290, "500 g", "halwa", IMG.halwa, 4.8, 121),
  P("p17", "Sooji Halwa", "సూజి హల్వా", "Roasted semolina folded with ghee, sugar and a hint of saffron.", 220, "500 g", "halwa", IMG.halwa, 4.6, 98),
  // ---- Snacks ----
  P("p18", "Janthikalu (Murukku)", "జంతికలు", "Spiral rice-flour crisps pressed and fried to a golden crunch.", 200, "500 g", "snacks", IMG.snacks, 4.8, 356, "Bestseller"),
  P("p19", "Karappusa", "కారప్పూస", "Fine crunchy sev with curry leaf and a gentle chilli heat.", 190, "500 g", "snacks", IMG.snacks, 4.7, 203),
  P("p20", "Chegodilu", "చేగోడిలు", "Crunchy sesame rings of rice flour, fried in small batches.", 180, "500 g", "snacks", IMG.snacks, 4.6, 117),
  P("p21", "Bellam Garelu", "బెల్లం గారెలు", "Sweet vadas of urad dal and jaggery, fried till mahogany.", 220, "500 g", "snacks", IMG.snacks, 4.8, 149),
  P("p22", "Garelu", "గారెలు", "Feather-light savoury vadas — crisp outside, cloud-soft within.", 160, "500 g", "snacks", IMG.snacks, 4.7, 231),
  // ---- Mixtures ----
  P("p23", "Karam Mixture", "కారం మిక్చర్", "Fiery boondi, sev and peanuts tossed with house spice dust.", 190, "500 g", "mixtures", IMG.snacks, 4.8, 287, "Bestseller"),
  P("p24", "Boondi Mixture", "బూందీ మిక్చర్", "Classic boondi blend with cashews, raisins and curry leaves.", 180, "500 g", "mixtures", IMG.snacks, 4.6, 132),
  P("p25", "Navratna Mixture", "నవరత్న మిక్చర్", "Nine crunchy treasures in one jar — sweet, salted and spicy.", 210, "500 g", "mixtures", IMG.snacks, 4.7, 76, "New"),
  // ---- Homemade ----
  P("p26", "Bobbatlu", "బొబ్బట్లు", "Hand-rolled puran poli with chana-dal jaggery filling, served with ghee.", 240, "6 pieces", "homemade", IMG.bobbatlu, 4.9, 445, "Bestseller"),
  P("p27", "Bellam Paramannam", "బెల్లం పరమాన్నం", "Rice kheer simmered in jaggery and milk, tempered with ghee.", 180, "500 g", "homemade", IMG.bobbatlu, 4.8, 198, "Signature"),
  P("p28", "Sannakayalu", "సన్నకాయలు", "Banana-shaped khoya sweets dipped in syrup — a wedding classic.", 260, "500 g", "homemade", IMG.bobbatlu, 4.7, 104),
  P("p29", "Kajjikayalu", "కాజ్జికాయలు", "Crescent pastry pockets stuffed with coconut and dry fruits.", 250, "500 g", "homemade", IMG.bobbatlu, 4.8, 167),
];

export const SEED_OFFER: Offer = {
  title: "Flat 10% OFF on All Items",
  code: "TELUGU10",
  pct: 10,
  start: "2026-01-01",
  end: "2026-12-31",
  active: true,
};

export const SEED_REVIEWS: Review[] = [
  { id: "r1", name: "Ravi Teja Kolli", rating: 5, text: "Fresh sweets and authentic Telugu taste. The boorelu took me straight back to my grandmother's kitchen. Highly recommended!", date: "2026-01-12", approved: true, hidden: false },
  { id: "r2", name: "Lakshmi Prasanna", rating: 5, text: "Ordered for Sankranti — ariselu and madatha kaja were a hit with the whole family. Delivery was right on time.", date: "2026-01-08", approved: true, hidden: false },
  { id: "r3", name: "Mohan Rao Vemula", rating: 4, text: "The ghee halwa is dangerously good. Packaging could be a little sturdier, but the taste is five stars from me.", date: "2025-12-28", approved: true, hidden: false },
  { id: "r4", name: "Sneha Reddy", rating: 5, text: "Kaju katli melts in the mouth. Packaging was neat and festive-looking. My go-to sweets shop in Kukatpally now.", date: "2025-12-19", approved: true, hidden: false },
  { id: "r5", name: "Abdul Kareem", rating: 5, text: "Best janthikalu in Hyderabad — still crisp after a full week. The staff is warm and courteous too.", date: "2025-12-11", approved: true, hidden: false },
  { id: "r6", name: "Divya Sree", rating: 4, text: "Bellam paramannam tasted exactly like home. Would love to see a few sugar-free options soon!", date: "2025-11-30", approved: true, hidden: false },
  { id: "r7", name: "Karthik Chandra", rating: 5, text: "Ordered at 9:40 PM and it reached Bolarum in 45 minutes. Incredible service for a traditional shop.", date: "2025-11-21", approved: true, hidden: false },
  { id: "r8", name: "Anitha Devi", rating: 5, text: "The pootharekulu is authentic Atreyapuram style — thin, buttery, perfect with a little ghee.", date: "2025-11-14", approved: true, hidden: false },
  { id: "r9", name: "Naveen Kumar", rating: 5, text: "Tried the navratna mixture on a friend's suggestion. Finished half the jar before the evening serial ended.", date: "2026-01-15", approved: false, hidden: false },
  { id: "r10", name: "Sravani Goud", rating: 4, text: "Kajas were fresh and delivery was quick. Slight delay on the second order, but they called to update me.", date: "2026-01-14", approved: false, hidden: false },
];

/* ---------- deterministic history ---------- */

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Ananya Sharma", "Ravi Teja Kolli", "Lakshmi Prasanna", "Srikanth Varma",
  "Deepika Naidu", "Venkat Rao", "Sneha Reddy", "Abdul Kareem",
  "Karthik Chandra", "Divya Sree", "Mohan Rao", "Anitha Devi",
  "Naveen Kumar", "Sravani Goud", "Pranavi Rao", "Harsha Vardhan",
  "Meera Joshi", "Srinivas Achari", "Padma Latha", "Rohith Krishna",
];

const AREAS = [
  { area: "Kukatpally", pin: "500072" },
  { area: "KPHB Colony", pin: "500072" },
  { area: "Miyapur", pin: "500049" },
  { area: "Allwyn Colony", pin: "500072" },
  { area: "Pragathi Nagar", pin: "500090" },
  { area: "Nizampet", pin: "500090" },
  { area: "Bachupally", pin: "500090" },
  { area: "JNTU Road", pin: "500085" },
];

const PAYMENTS: Payment[] = ["Cash on Delivery", "UPI", "UPI", "Online Payment", "Cash on Delivery", "Cash on Delivery"];

export function buildTotals(items: OrderItem[], offer: Offer, now = Date.now()) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const withinDates =
    new Date(offer.start + "T00:00:00").getTime() <= now &&
    now <= new Date(offer.end + "T23:59:59").getTime();
  const discount = offer.active && withinDates ? Math.round((subtotal * offer.pct) / 100) : 0;
  const base = subtotal - discount;
  const delivery = subtotal === 0 ? 0 : base >= 499 ? 0 : 39;
  return { subtotal, discount, delivery, total: base + delivery };
}

export function seedDB(): DB {
  const rnd = mulberry32(20260117);
  const now = Date.now();
  const orders: Order[] = [];
  let seq = 100;

  const makeOrder = (daysAgo: number, status: OrderStatus, adminSet: boolean, hoursAgo = 0): Order => {
    const name = NAMES[Math.floor(rnd() * NAMES.length)];
    const loc = AREAS[Math.floor(rnd() * AREAS.length)];
    const nItems = 1 + Math.floor(rnd() * 3);
    const chosen = new Set<string>();
    while (chosen.size < nItems) chosen.add(PRODUCTS[Math.floor(rnd() * PRODUCTS.length)].id);
    const items: OrderItem[] = [...chosen].map((id) => {
      const p = PRODUCTS.find((x) => x.id === id)!;
      return { id: p.id, name: p.name, price: p.price, qty: 1 + Math.floor(rnd() * 2), unit: p.unit };
    });
    const totals = buildTotals(items, SEED_OFFER);
    const createdAt = now - daysAgo * 86400000 - Math.floor(rnd() * 10 * 3600000) - hoursAgo * 3600000;
    seq += 3 + Math.floor(rnd() * 17);
    return {
      id: `TM2026${String(seq).padStart(5, "0")}`,
      createdAt,
      name,
      phone: `+91 9${String(700000000 + Math.floor(rnd() * 299999999))}`,
      email: name.toLowerCase().replace(/[^a-z]+/g, ".") + "@gmail.com",
      address: `H.No ${3 + Math.floor(rnd() * 20)}-${Math.floor(rnd() * 200) + 10}, ${["Sri Sai Residency", "Kaveri Apartments", "Lotus Enclave", "Green Park Colony", "Vasavi Nilayam"][Math.floor(rnd() * 5)]}, ${loc.area}`,
      landmark: ["Near Metro Station", "Opp. Bus Stop", "Beside Rythu Bazar", "Near Water Tank", "Behind Big Bazaar"][Math.floor(rnd() * 5)],
      city: "Hyderabad",
      pincode: loc.pin,
      instructions: "",
      items,
      ...totals,
      payment: PAYMENTS[Math.floor(rnd() * PAYMENTS.length)],
      status,
      adminSet,
    };
  };

  // ~55 orders across the last 45 days (delivered history for charts)
  for (let d = 45; d >= 1; d--) {
    const count = 1 + Math.floor(rnd() * 3) + (d % 7 === 0 || d % 7 === 6 ? 2 : 0);
    for (let k = 0; k < count; k++) orders.push(makeOrder(d, "Delivered", true));
  }

  // today's live orders
  orders.push(makeOrder(0, "Delivered", true, 6));
  orders.push(makeOrder(0, "Delivered", true, 4));
  const preparing = makeOrder(0, "Preparing", false);
  preparing.createdAt = now - 3 * 60000;
  orders.push(preparing);
  const confirmed = makeOrder(0, "Confirmed", false);
  confirmed.createdAt = now - 70000;
  orders.push(confirmed);
  const placed = makeOrder(0, "Placed", false);
  placed.createdAt = now - 15000;
  orders.push(placed);

  orders.sort((a, b) => b.createdAt - a.createdAt);

  // ledger for months before the current one
  const ledger: LedgerMonth[] = [];
  const d0 = new Date();
  for (let i = 11; i >= 1; i--) {
    const dt = new Date(d0.getFullYear(), d0.getMonth() - i, 1);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    ledger.push({
      m: key,
      sales: 118000 + Math.floor(rnd() * 150000),
      orders: 320 + Math.floor(rnd() * 260),
    });
  }

  return { v: 3, products: PRODUCTS, orders, reviews: SEED_REVIEWS, offer: SEED_OFFER, ledger };
}
