import { useState } from 'react';
import {
    X,
    Pencil,
    CreditCard,
    Leaf,
    Drumstick,
    Sparkles,
    Cookie,
    CakeSlice,
    ShoppingCart,
    Navigation,
} from 'lucide-react';
import { useCart } from './CartContext';
import AddressModal from './AdressModal';

const CAT = {
    veg: { icon: Leaf, bg: 'bg-green-600' },
    'non-veg': { icon: Drumstick, bg: 'bg-red-600' },
    powder: { icon: Sparkles, bg: 'bg-orange-600' },
    snack: { icon: Cookie, bg: 'bg-yellow-600' },
    sweet: { icon: CakeSlice, bg: 'bg-pink-600' },
};

export default function CartDrawer() {
    const {
        open,
        toggleCart,
        items,
        addOne,
        removeOne,
        address,
        subtotal,
        delivery,
        discount,
        total,
        couponCode,
        applyCoupon,
    } = useCart();

    const [addrOpen, setAddrOpen] = useState(false);
    const [animDirMap, setAnimDirMap] = useState<Record<string, 'up' | 'down'>>({});

    return (
        <>
            <div
                className={`fixed inset-0 z-50 ${open ? 'visible' : 'invisible'}`}
                aria-hidden={!open}
            >
                {/* BACKDROP */}
                <div
                    onClick={toggleCart}
                    className={`absolute inset-0 bg-black/40 transition ${open ? 'opacity-100' : 'opacity-0'
                        }`}
                />

                {/* DRAWER */}
                <aside
                    className={`absolute overflow-y-scroll right-0 top-0 h-full w-full sm:w-[420px] bg-[#FAF7F2] shadow-xl transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* HEADER */}
                    <div className="sticky top-0 z-20 backdrop-blur-md bg-[#FAF7F2]/90">
                        <div className="h-16 px-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full bg-[#E67E22]/10 flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-[#E67E22]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-[#2D1F14]">
                                        Your Cart
                                    </h2>
                                    <p className="text-xs text-[#6B5A4A]">
                                        {items.length} item{items.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={toggleCart}
                                className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="h-px bg-black/10" />
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                        {/* EMPTY CART */}
                        {items.length === 0 && (
                            <div className="flex flex-col items-center justify-center text-center py-20 gap-0">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full bg-[#E67E22]/10 flex items-center justify-center animate-pulse">
                                        <ShoppingCart className="w-12 h-12 text-[#E67E22]" />
                                    </div>
                                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#E67E22] text-white text-xs flex items-center justify-center animate-bounce">
                                        0
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-[#2D1F14] mb-2">
                                    Your cart feels lonely 🥺
                                </h3>

                                <p className="text-sm text-[#6B5A4A] max-w-xs mb-2">
                                    ✨ Add some authentic flavors to your cart.
                                </p>
                                <p className="text-sm text-[#6B5A4A] max-w-xs mb-6">
                                    Our bestsellers are waiting to spice things up 🌶️
                                </p>

                                <button
                                    onClick={toggleCart}
                                    className="px-6 py-3 rounded-full bg-[#E67E22] text-white font-semibold text-sm hover:scale-105 transition shadow-md"
                                >
                                    Start Shopping
                                </button>

                                <p className="text-xs text-[#6B5A4A]/70 mt-4">
                                    Tip: Bestsellers come with instant discounts 😉
                                </p>
                            </div>
                        )}

                        {/* CART ITEMS */}
                        {items.length > 0 && (
                            <div className="space-y-4">
                                {items.map((item) => {
                                    const C = CAT[item.category];
                                    const animDir = animDirMap[item.id] || 'up';

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-xl p-3 flex gap-3 shadow-sm items-center"
                                        >
                                            <div className="w-16 h-16 relative">
                                                <img
                                                    src={item.image}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <span
                                                    className={`absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center ${C.bg}`}
                                                >
                                                    <C.icon className="w-3 h-3 text-white" />
                                                </span>
                                            </div>

                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className="text-xs text-[#6B5A4A]">{item.weight}</p>
                                            </div>

                                            <div className="h-8 w-[80px] border rounded-lg grid grid-cols-3 items-center text-[#D35400]">
                                                <button
                                                    onClick={() => {
                                                        setAnimDirMap((p) => ({ ...p, [item.id]: 'down' }));
                                                        removeOne(item.id);
                                                    }}
                                                >
                                                    −
                                                </button>

                                                <div className="relative h-5 overflow-hidden">
                                                    <div
                                                        key={item.quantity}
                                                        className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${animDir === 'up'
                                                            ? 'translate-y-0 opacity-100'
                                                            : 'translate-y-0 opacity-100'
                                                            }`}
                                                    >
                                                        {item.quantity}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setAnimDirMap((p) => ({ ...p, [item.id]: 'up' }));
                                                        addOne(item);
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <span className="font-bold">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* SUMMARY */}
                    {items.length > 0 && (
                        <div className="border-t p-4 space-y-4">
                            <div className="bg-white rounded-2xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Delivery</span>
                                    <span>₹{delivery}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-700">
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Offer {couponCode && `(${couponCode})`}
                                    </span>
                                    <span>-₹{discount}</span>
                                </div>

                                <div className="h-px bg-black/10 my-2" />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>
                            {/* COUPON */}
                            <div className="bg-white rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-[#6B5A4A]">Have a coupon?</p>
                                    <p className="text-sm font-medium">Apply coupon at checkout</p>
                                </div>
                                {couponCode ? (
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                                        {couponCode}
                                    </span>
                                ) : (
                                    <span className="text-sm text-[#E67E22]">BESTSELLERS</span>
                                )}
                            </div>

                            {/* ADDRESS */}
                            <div className="bg-white rounded-2xl p-4 flex justify-between items-start gap-3">
                                <div className="flex flex-col gap-1 items-start">
                                    <div className="rounded-full flex gap-2 flex-row items-center justify-center">
                                        <Navigation className="w-4 h-4 text-[#E67E22]" />
                                        <p className="text-xs text-[#6B5A4A]">Deliver to</p>
                                    </div>
                                    <p className="text-sm font-medium whitespace-pre-line">
                                        {address || 'Add delivery address'}
                                    </p>
                                </div>
                                <Pencil
                                    className="cursor-pointer mt-1"
                                    onClick={() => setAddrOpen(true)}
                                />
                            </div>

                            {/* PAYMENT */}
                            <div className="bg-white rounded-2xl p-4 space-y-3">
                                <p className="font-semibold text-sm">Payment Method</p>

                                <div className="flex justify-between items-center border rounded-xl p-3">
                                    <span className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> UPI
                                    </span>
                                    <span className="text-green-600 text-sm">Selected</span>
                                </div>

                                <div className="flex justify-between items-center border rounded-xl p-3">
                                    <span className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Card
                                    </span>
                                </div>

                                <div className="flex justify-between items-center border rounded-xl p-3">
                                    <span className="flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" /> Cash on Delivery
                                    </span>
                                </div>
                            </div>

                            <button className="w-full h-12 rounded-2xl bg-[#E67E22] text-white font-semibold text-lg">
                                Place Order
                            </button>
                        </div>
                    )}
                </aside>
            </div>

            <AddressModal open={addrOpen} onClose={() => setAddrOpen(false)} />
        </>
    );
}
