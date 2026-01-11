// src/pages/PaymentPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IndianRupee,
  CreditCard,
  QrCode,
} from 'lucide-react';

import { useCart } from '../contexts/CartContext';
import { usePayment } from '../contexts/PaymentContext';
import { useUser } from '../contexts/UserContext';

/* IMAGES */
import upiLogo from '../assets/design/upi.png';
import phonepeLogo from '../assets/design/phonepe.png';
import googlepayLogo from '../assets/design/googlepay.png';
import paytmLogo from '../assets/design/paytm.png';
import supermoneyLogo from '../assets/design/supermoney.png';

type CardInfo = {
  last4: string;
  brand: string;
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    items,
    address,
    subtotal,
    delivery,
    discount,
    total,
    couponCode,
    clearCart,
  } = useCart();
  // before: const { addOrder, updateOrder } = useUser();
  const { addOrder, updateOrder, addresses, addOrUpdateAddress } = useUser();

  const { startPayment, markSuccess } = usePayment();

  const [upiId, setUpiId] = useState('');
  const [savedCard, setSavedCard] = useState<CardInfo | null>(null);

  // If the user clicked "Pay Now" from an existing COD order,
  // the order is passed via location.state.orderToPay
  const existingOrder = (location.state as any)?.orderToPay as any | undefined;

  /* ================= INIT ================= */
  useEffect(() => {
    localStorage.setItem('payment_amount', String(total));
    const card = localStorage.getItem('card_info');
    if (card) setSavedCard(JSON.parse(card));
  }, [total]);

  /* helper for generating txn id */
  const genTxn = () => 'TXN-' + Date.now();

  /* ================= CORE FIX ================= */
  // inside src/pages/PaymentPage.tsx
  const createOrderAndRedirect = (method: string) => {
    type OrderStatus =
      | 'PLACED'
      | 'CONFIRMED'
      | 'OUT_FOR_DELIVERY'
      | 'DELIVERED'
      | 'CANCELLED';

    const gatewayRef = method === 'cod' ? null : genTxn();
    const paymentStatus: 'PAID' | 'PENDING' | 'FAILED' =
      method === 'cod' ? 'PENDING' : 'PAID';

    // If this is a pay-for-existing-order flow:
    if (existingOrder) {
      // update the existing order with payment info and set status to PLACED/CONFIRMED
      updateOrder(existingOrder.id, {
        payment: { method, status: paymentStatus, gatewayRef },
        status: paymentStatus === 'PAID' ? 'CONFIRMED' : existingOrder.status,
      });

      const updated = {
        ...existingOrder,
        payment: { method, status: paymentStatus, gatewayRef },
        status: paymentStatus === 'PAID' ? 'CONFIRMED' : existingOrder.status,
      };

      // navigate back to order detail with the updated order in nav state
      navigate(`/orders/${existingOrder.id}`, {
        replace: true,
        state: { order: updated },
      });
      return;
    }

    // NEW order flow (checkout)
    const orderId = 'ORD-' + Date.now();

    const order = {
      id: orderId,
      items: [...items],
      pricing: {
        subtotal,
        delivery,
        discount,
        gst: Math.round(subtotal * 0.05),
        total,
      },
      coupon: couponCode || null,
      addressSnapshot: address
        ? {
          name: address.name,
          phone: address.phone,
          house: address.house,
          mandal: address.mandal,
          district: address.district,
          state: address.state,
          pincode: address.pincode,
        }
        : null,
      payment: {
        method,
        status: paymentStatus,
        gatewayRef,
      },
      status: 'PLACED' as OrderStatus,
      createdAt: new Date().toISOString(),
    };

    // <<< IMPORTANT: persist the order to UserContext (and localStorage) BEFORE clearing cart
    console.log('[PaymentPage] ORDER OBJECT BEFORE addOrder()', order);
    
    // If user has no saved addresses, save this checkout address to their profile
    try {
      if ((!addresses || addresses.length === 0) && address) {
        const newAddr = {
          id: 'ADDR-' + Date.now(),
          label: address.type, // maps to Home/Work/Other label used by profile
          name: address.name,
          phone: address.phone,
          house: address.house,
          mandal: address.mandal,
          district: address.district,
          state: address.state,
          pincode: address.pincode,
          lat: address.coords?.lat ?? null,
          lng: address.coords?.lng ?? null,
          isDefault: true,
          isServiceable: address.isServiceable ?? null,
        };
        addOrUpdateAddress(newAddr);
        console.log('[PaymentPage] saved checkout address to user profile', newAddr);
      }
    } catch (e) {
      console.warn('[PaymentPage] failed to persist checkout address to profile', e);
    }

    addOrder(order);

    console.log('[PaymentPage] ORDER SENT TO UserContext');

    clearCart();

    console.log('[PaymentPage] CART CLEARED');

    console.log('---------------- PAYMENT END ----------------');

    // navigate to order details with the order in nav state (no data loss)
    navigate(`/orders/${orderId}`, {
      replace: true,
      state: { order },
    });
  };


  /* ================= COMMON COMPLETE ================= */
  const finishAndGoUser = (method: string) => {
    localStorage.setItem('payment_method', method);
    startPayment();

    setTimeout(() => {
      markSuccess();
      createOrderAndRedirect(method);
    }, 800);
  };

  /* ================= UPI ================= */
  const redirectUPIApp = (app: string) => {
    if (!upiId) return;

    localStorage.setItem('upi_id', upiId);
    localStorage.setItem('selected_upi_app', app);

    // This simulates deep-linking to UPI app. Real integrations are more complex.
    window.location.href = `upi://pay?pa=${upiId}&pn=Merchant&am=${total}&cu=INR`;

    finishAndGoUser(`upi-${app}`);
  };

  const generateQR = () => {
    if (!upiId) return;
    localStorage.setItem('upi_id', upiId);
    finishAndGoUser('upi-qr');
  };

  /* ================= CARD ================= */
  const addNewCard = () => {
    const card = { brand: 'VISA', last4: '4242' };
    localStorage.setItem('card_info', JSON.stringify(card));
    setSavedCard(card);
  };

  /* ================= COD ================= */
  const cashOnDelivery = () => {
    finishAndGoUser('cod');
  };

  return (
    <div className="max-w-md mx-auto p-5 space-y-6">
      {/* HEADER */}
      <div className="text-center">
        <p className="text-sm text-gray-500">To pay</p>
        <h1 className="text-2xl font-bold flex items-center justify-center gap-1">
          <IndianRupee className="w-5 h-5" />
          {existingOrder ? existingOrder.pricing.total : total}
        </h1>
      </div>

      {/* ================= UPI ================= */}
      <div className="bg-white rounded-2xl p-4 space-y-4 border">
        <div className="flex items-center justify-between gap-2 font-semibold">
          <img src={upiLogo} className="w-auto h-6" />
          <button
            onClick={generateQR}
            className="flex items-center justify-center gap-2 border rounded-xl px-4 py-2 text-sm"
          >
            Generate<QrCode className="ml-1 w-4 h-4" />
          </button>
        </div>

        <input
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="Enter UPI ID"
          className="w-full border rounded-xl px-3 py-2 text-sm"
        />

        <div className="grid grid-cols-4 gap-3">
          <button onClick={() => redirectUPIApp('phonepe')}>
            <img src={phonepeLogo} className="w-10 h-10 mx-auto rounded-xl bg-white p-1.5 shadow ring-1 ring-black/5 hover:scale-105" />
          </button>
          <button onClick={() => redirectUPIApp('googlepay')}>
            <img src={googlepayLogo} className="w-10 h-10 mx-auto rounded-xl bg-white p-1.5 shadow ring-1 ring-black/5 hover:scale-105" />
          </button>
          <button onClick={() => redirectUPIApp('paytm')}>
            <img src={paytmLogo} className="w-10 h-10 mx-auto rounded-xl bg-white p-1.5 shadow ring-1 ring-black/5 hover:scale-105" />
          </button>
          <button onClick={() => redirectUPIApp('supermoney')}>
            <img src={supermoneyLogo} className="w-10 h-10 mx-auto rounded-xl bg-white p-1.5 shadow ring-1 ring-black/5 hover:scale-105" />
          </button>
        </div>
      </div>

      {/* ================= CARD ================= */}
      <div className="bg-white rounded-2xl p-4 space-y-3 border">
        <div className="flex items-center gap-2 font-semibold">
          <CreditCard className="w-5 h-5" />
          Card
        </div>

        {savedCard && (
          <button
            onClick={() => finishAndGoUser('card')}
            className="w-full border rounded-xl p-3 flex justify-between"
          >
            {savedCard.brand} •••• {savedCard.last4}
            <span className="text-green-600">Pay</span>
          </button>
        )}

        <button
          onClick={addNewCard}
          className="w-full border-dashed border rounded-xl p-3 text-sm"
        >
          + Add New Card
        </button>
      </div>

      {/* ================= COD ================= */}
      <div className="bg-white rounded-2xl p-4 border">
        <button
          onClick={cashOnDelivery}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2 font-semibold">
            <IndianRupee className="w-5 h-5" />
            Cash on Delivery
          </div>
          <span className="text-sm text-gray-500">Pay later</span>
        </button>
      </div>
    </div>
  );
}
