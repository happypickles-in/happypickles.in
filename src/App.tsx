// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import { PaymentProvider } from './contexts/PaymentContext';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';

import HomePage from './pages/HomePage';
import UserPage from './pages/UserProfile';
import AdminPage from './pages/AdminPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccess from './pages/OrderSuccess';
import AdminMenu from './pages/AdminMenu';


export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <UserProvider>
        <CartProvider>
          <PaymentProvider>
            <CartDrawer />
            <Navbar />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile/*" element={<UserPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/menu" element={<AdminMenu />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/profile/wishlist" element={<WishlistPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-success" element={<OrderSuccess />} />
              </Routes>
            </main>
          </PaymentProvider>
        </CartProvider>
      </UserProvider>
    </div>
  );
}
