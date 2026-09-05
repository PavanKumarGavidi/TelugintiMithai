export type Category =
  | "sweets"
  | "laddus"
  | "kajas"
  | "halwa"
  | "snacks"
  | "mixtures"
  | "homemade";

export const CATEGORIES: { id: Category; label: string; telugu: string }[] = [
  { id: "sweets", label: "Sweets", telugu: "మిఠాయి" },
  { id: "laddus", label: "Laddus", telugu: "లడ్డూలు" },
  { id: "kajas", label: "Kajas", telugu: "కాజాలు" },
  { id: "halwa", label: "Halwa", telugu: "హల్వా" },
  { id: "snacks", label: "Snacks", telugu: "కారం పలహారాలు" },
  { id: "mixtures", label: "Mixtures", telugu: "మిక్చర్లు" },
  { id: "homemade", label: "Homemade Specialties", telugu: "ఇంటి రుచులు" },
];

export type ProductTag = "Bestseller" | "Signature" | "New" | "Chef's Pick";

export interface Product {
  id: string;
  name: string;
  telugu: string;
  desc: string;
  price: number;
  unit: string;
  category: Category;
  img: string;
  tag?: ProductTag;
  rating: number;
  reviews: number;
  available: boolean;
}

export interface CartItem {
  id: string;
  qty: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
}

export const STATUS_FLOW = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
] as const;

export type OrderStatus = (typeof STATUS_FLOW)[number] | "Cancelled";
export const ALL_STATUSES: OrderStatus[] = [
  ...STATUS_FLOW,
  "Cancelled",
];

export type Payment = "Cash on Delivery" | "UPI" | "Online Payment";

export interface Order {
  id: string;
  createdAt: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  instructions: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  payment: Payment;
  status: OrderStatus;
  adminSet: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
  hidden: boolean;
}

export interface Offer {
  title: string;
  code: string;
  pct: number;
  start: string;
  end: string;
  active: boolean;
}

export interface SavedLocation {
  address: string;
  landmark: string;
  phone: string;
  pincode: string;
  area: string;
  mode: "manual" | "gps";
}

export interface LedgerMonth {
  m: string;
  sales: number;
  orders: number;
}

export interface DB {
  v: number;
  products: Product[];
  orders: Order[];
  reviews: Review[];
  offer: Offer;
  ledger: LedgerMonth[];
}

export interface Branch {
  name: string;
  area: string;
  address: string;
  phone: string;
  main?: boolean;
}
