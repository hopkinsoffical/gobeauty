"use client";

// First-party store cart. Guest-first: lives entirely in localStorage so the
// flow works signed-out; prices are re-resolved server-side at order time so
// nothing here is trusted for money.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  priceCents: number; // display only — server reprices at checkout
  qty: number;
}

const KEY = "gb:cart";
export const MAX_QTY = 20;

export const fmtUsd = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

interface CartApi {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartApi | null>(null);

function readStored(): CartItem[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((i) => i && i.slug && i.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // localStorage only exists client-side; hydrate after mount.
  useEffect(() => setItems(readStored()), []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage blocked — cart still works for the session */
    }
  }, []);

  const add = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1) => {
      const cur = readStored();
      const existing = cur.find((i) => i.slug === item.slug);
      const next = existing
        ? cur.map((i) =>
            i.slug === item.slug
              ? { ...i, ...item, qty: Math.min(MAX_QTY, i.qty + qty) }
              : i,
          )
        : [...cur, { ...item, qty: Math.min(MAX_QTY, qty) }];
      persist(next);
    },
    [persist],
  );

  const setQty = useCallback(
    (slug: string, qty: number) => {
      const cur = readStored();
      persist(
        qty <= 0
          ? cur.filter((i) => i.slug !== slug)
          : cur.map((i) => (i.slug === slug ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
      );
    },
    [persist],
  );

  const remove = useCallback((slug: string) => setQty(slug, 0), [setQty]);
  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<CartApi>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotalCents = items.reduce((n, i) => n + i.priceCents * i.qty, 0);
    return { items, count, subtotalCents, add, setQty, remove, clear };
  }, [items, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
