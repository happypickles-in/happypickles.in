import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CartItem } from './CartContext';

export type Address = {
  id: string;
  label?: string;
  name: string;
  phone: string;
  house: string;
  mandal?: string;
  district?: string;
  state?: string;
  pincode?: string;
  lat?: number | null;
  lng?: number | null;
  isDefault?: boolean;
  isServiceable?: boolean | null;
};

export type Order = {
  id: string;
  items: CartItem[];
  pricing: {
    subtotal: number;
    delivery: number;
    discount: number;
    gst: number;
    total: number;
  };
  coupon?: string | null;
  addressSnapshot?: {
    name?: string;
    phone?: string;
    house?: string;
    mandal?: string;
    district?: string;
    state?: string;
    pincode?: string;
  } | null;
  payment?: {
    method?: string;
    gatewayRef?: string | null;
    status?: 'PAID' | 'PENDING' | 'FAILED' | string;
  } | null;
  status?: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  notes?: string;
};

export type UserProfile = {
  name?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
};

type UserContextType = {
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;

  addresses: Address[];
  addOrUpdateAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  orders: Order[];
  addOrder: (order: Omit<Order, 'createdAt'> | Order) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;

  clearAllUserData: () => void;
};

const STORAGE_KEY = 'hp_user_v1';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
};

function normalizeOrder(raw: any): Order {
  return {
    id: String(raw?.id ?? Date.now()),
    items: Array.isArray(raw?.items) ? raw.items : [],
    pricing: {
      subtotal: Number(raw?.pricing?.subtotal ?? 0),
      delivery: Number(raw?.pricing?.delivery ?? 0),
      discount: Number(raw?.pricing?.discount ?? 0),
      gst: Number(raw?.pricing?.gst ?? 0),
      total: Number(raw?.pricing?.total ?? 0),
    },
    coupon: raw?.coupon ?? null,
    addressSnapshot: raw?.addressSnapshot ?? null,
    payment: raw?.payment ?? null,
    status: raw?.status ?? 'PLACED',
    createdAt: raw?.createdAt ?? new Date().toISOString(),
    notes: raw?.notes ?? '',
  };
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setProfile(parsed.profile || {});
      setAddresses(parsed.addresses || []);
      setWishlist(parsed.wishlist || []);
      setOrders((parsed.orders || []).map(normalizeOrder));
      console.log('[UserContext] loaded', parsed);
    } catch (e) {
      console.warn('[UserContext] load failed', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile, addresses, wishlist, orders })
    );
    console.log('[UserContext] saved', { orders: orders.length });
  }, [profile, addresses, wishlist, orders]);

  const updateProfile = (p: Partial<UserProfile>) =>
    setProfile(prev => ({ ...prev, ...p }));

  const addOrUpdateAddress = (a: Address) =>
    setAddresses(prev => {
      const exists = prev.find(x => x.id === a.id);
      if (exists) return prev.map(x => (x.id === a.id ? { ...x, ...a } : x));
      if (a.isDefault) {
        return [...prev.map(p => ({ ...p, isDefault: false })), a];
      }
      return [...prev, a];
    });

  const removeAddress = (id: string) =>
    setAddresses(prev => prev.filter(a => a.id !== id));

  const setDefaultAddress = (id: string) =>
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));

  const addToWishlist = (productId: string) =>
    setWishlist(prev => (prev.includes(productId) ? prev : [productId, ...prev]));

  const removeFromWishlist = (productId: string) =>
    setWishlist(prev => prev.filter(id => id !== productId));

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addOrder = (orderPartial: Omit<Order, 'createdAt'> | Order) => {
    const order = normalizeOrder(orderPartial);
    setOrders(prev => [order, ...prev]);
    console.log('[UserContext] ORDER ADDED', order);
  };

  const updateOrder = (id: string, patch: Partial<Order>) =>
    setOrders(prev =>
      prev.map(o => (o.id === id ? normalizeOrder({ ...o, ...patch }) : o))
    );

  const clearAllUserData = () => {
    setProfile({});
    setAddresses([]);
    setWishlist([]);
    setOrders([]);
    localStorage.removeItem(STORAGE_KEY);
    console.log('[UserContext] cleared');
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        addresses,
        addOrUpdateAddress,
        removeAddress,
        setDefaultAddress,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        orders,
        addOrder,
        updateOrder,
        clearAllUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
