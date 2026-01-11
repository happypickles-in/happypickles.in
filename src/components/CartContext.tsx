import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import products from '../data/products';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  weight: string;
  category: 'veg' | 'non-veg' | 'powder' | 'snack' | 'sweet';
  quantity: number;
};

type CartContextType = {
  open: boolean;
  items: CartItem[];
  address: string;

  // actions
  toggleCart: () => void;
  addOne: (item: Omit<CartItem, 'quantity'>) => void;
  removeOne: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  buyNow: (item: Omit<CartItem, 'quantity'>, qty: number) => void;
  setAddress: (a: string) => void;

  // coupons / totals
  couponCode?: string | null;
  couponPercent: number;
  applyCoupon: (code: string) => boolean; // returns whether applied
  removeCoupon: () => void;

  // derived totals (convenience)
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
};

const CartContext = createContext<CartContextType>(null as any);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('');

  // coupon state
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponPercent, setCouponPercent] = useState<number>(0);

  const toggleCart = () => setOpen((v) => !v);

  // +1 only
  const addOne = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // -1 or remove
  const removeOne = (id: string) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === id);
      if (!found) return prev;
      if (found.quantity === 1) {
        return prev.filter((p) => p.id !== id); // remove
      }
      return prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity - 1 } : p
      );
    });
  };

  // used for syncing
  const setQty = (id: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((p) => p.id !== id);
      const found = prev.find((p) => p.id === id);
      if (!found) return prev;
      return prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p));
    });
  };

  // buy now → set exact qty, open cart
  const buyNow = (item: Omit<CartItem, 'quantity'>, qty: number) => {
    setItems((prev) => {
      const others = prev.filter((p) => p.id !== item.id);
      return [...others, { ...item, quantity: qty }];
    });
    setOpen(true);
  };

  // ---------- coupon logic ----------
  // define bestsellers ids (same process used in Bestsellers component)
  const BESTSELLER_IDS = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.orders || 0) - (a.orders || 0))
      .slice(0, 3)
      .map((p) => p.id);
  }, []);

  // helper to detect if cart contains the full bestseller combo (1+ of each)
  const hasBestsellerCombo = (itemsToCheck: CartItem[]) =>
    BESTSELLER_IDS.every((id) => itemsToCheck.some((it) => it.id === id && it.quantity > 0));

  // applyCoupon API: returns true if valid+applied
  const applyCoupon = (code: string) => {
    const normalized = (code || '').trim().toUpperCase();
    if (!normalized) return false;

    // support only BESTSELLERS for now
    if (normalized === 'BESTSELLERS') {
      // only apply if combo present
      if (hasBestsellerCombo(items)) {
        setCouponCode('BESTSELLERS');
        setCouponPercent(15);
        return true;
      } else {
        // don't apply if combo not present
        return false;
      }
    }

    // unknown coupon
    return false;
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponPercent(0);
  };

  // auto-apply BESTSELLERS when combo appears (and remove when not present)
  useEffect(() => {
    if (hasBestsellerCombo(items)) {
      // if combo is present but coupon not set, auto-apply
      if (couponCode !== 'BESTSELLERS') {
        setCouponCode('BESTSELLERS');
        setCouponPercent(15);
      }
    } else {
      // if coupon is BESTSELLERS but combo not present, remove it
      if (couponCode === 'BESTSELLERS') {
        setCouponCode(null);
        setCouponPercent(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // ---------- totals ----------
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = items.length > 0 ? 40 : 0;
  const discount = Math.round((subtotal * couponPercent) / 100);
  const total = subtotal + delivery - discount;

  return (
    <CartContext.Provider
      value={{
        open,
        items,
        address,

        toggleCart,
        addOne,
        removeOne,
        setQty,
        buyNow,
        setAddress,

        couponCode,
        couponPercent,
        applyCoupon,
        removeCoupon,

        subtotal,
        delivery,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
