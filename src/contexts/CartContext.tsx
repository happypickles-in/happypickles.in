// src/contexts/CartContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

export type Address = {
  type: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  house: string;
  pincode: string;
  mandal: string;
  district: string;
  state: string;
  isServiceable: boolean | null;
  coords: { lat: number; lng: number } | null;
};

type CartContextType = {
  open: boolean;
  items: CartItem[];
  address: Address | null;

  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  addOne: (item: Omit<CartItem, 'quantity'>) => void;
  removeOne: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  buyNow: (item: Omit<CartItem, 'quantity'>, qty: number) => void;

  setAddress: (a: Address) => void;

  clearCart: (skipNavigation?: boolean) => void;

  couponCode?: string | null;
  couponPercent: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
};

const CartContext = createContext<CartContextType>(null as any);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);

  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponPercent, setCouponPercent] = useState<number>(0);

  const toggleCart = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next && location.pathname !== '/cart') navigate('/cart');
      if (!next && location.pathname === '/cart') navigate('/');
      return next;
    });
  };

  const openCart = () => {
    setOpen(true);
    if (location.pathname !== '/cart') navigate('/cart');
  };

  const closeCart = () => {
    setOpen(false);
    if (location.pathname === '/cart') navigate('/');
  };

  const addOne = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeOne = (id: string) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === id);
      if (!found) return prev;
      if (found.quantity === 1) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p));
    });
  };

  const setQty = (id: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p));
    });
  };

  const buyNow = (item: Omit<CartItem, 'quantity'>, qty: number) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);

      // if item already in cart → update quantity
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: qty } : p
        );
      }

      // else → add alongside existing items
      return [...prev, { ...item, quantity: qty }];
    });

    openCart();
  };

  const clearCart = (skipNavigation = false) => {
    console.log('[CartContext] clearCart called', { skipNavigation, items, address });
    setItems([]);
    setAddress(null);
    setCouponCode(null);
    setCouponPercent(0);
    if (!skipNavigation) closeCart();
  };

  const BESTSELLER_IDS = useMemo(() => {
    return [...products].sort((a, b) => (b.orders || 0) - (a.orders || 0)).slice(0, 3).map((p) => p.id);
  }, []);

  const hasBestsellerCombo = (itemsToCheck: CartItem[]) => BESTSELLER_IDS.every((id) => itemsToCheck.some((it) => it.id === id && it.quantity > 0));

  const applyCoupon = (code: string) => {
    if (code.toUpperCase() === 'BESTSELLERS' && hasBestsellerCombo(items)) {
      setCouponCode('BESTSELLERS');
      setCouponPercent(15);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponPercent(0);
  };

  useEffect(() => {
    if (location.pathname !== '/cart') setOpen(false);
  }, [location.pathname]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = items.length ? 40 : 0;
  const discount = Math.round((subtotal * couponPercent) / 100);
  const total = subtotal + delivery - discount;

  useEffect(() => {
    console.log('[CartContext] cart state changed', { items, subtotal, total });
  }, [items, subtotal, total]);
  // --- sync cart address with UserContext saved addresses (localStorage) ---
  useEffect(() => {
    const syncFromUserStorage = () => {
      try {
        const raw = localStorage.getItem('hp_user_v1');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const userAddrs = parsed?.addresses || [];
        const defaultAddr = userAddrs.find((a: any) => a.isDefault) || userAddrs[0];
        if (!defaultAddr) return;

        // map UserContext address -> CartContext Address shape
        const mapped = {
          type:
            defaultAddr.label && ['Home', 'Work', 'Other'].includes(defaultAddr.label)
              ? defaultAddr.label
              : 'Home',
          name: defaultAddr.name || '',
          phone: defaultAddr.phone || '',
          house: defaultAddr.house || '',
          pincode: defaultAddr.pincode || '',
          mandal: defaultAddr.mandal || '',
          district: defaultAddr.district || '',
          state: defaultAddr.state || '',
          isServiceable: defaultAddr.isServiceable ?? null,
          coords:
            defaultAddr.lat != null && defaultAddr.lng != null
              ? { lat: defaultAddr.lat, lng: defaultAddr.lng }
              : null,
        };

        setAddress((prev) => {
          try {
            if (JSON.stringify(prev) === JSON.stringify(mapped)) return prev;
          } catch (e) { /* ignore */ }
          return mapped;
        });
      } catch (e) {
        console.warn('[CartContext] failed to sync address from user storage', e);
      }
    };

    // initial sync
    syncFromUserStorage();

    // sync when other tabs or parts of app update user storage
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'hp_user_v1') syncFromUserStorage();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <CartContext.Provider
      value={{
        open,
        items,
        address,
        toggleCart,
        openCart,
        closeCart,
        addOne,
        removeOne,
        setQty,
        buyNow,
        setAddress,
        clearCart,
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
