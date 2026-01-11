// src/components/CartDrawer.tsx
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
    X,
    Pen,
    Leaf,
    Drumstick,
    Sparkles,
    Cookie,
    CakeSlice,
    ShoppingCart,
    Navigation,
    Tag,
    ReceiptText,
    HandCoins,
    Check,
    Home,
    Briefcase,
    ChevronsRight,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import AddressModal from './AdressModal';

const CAT = {
    veg: { icon: Leaf, bg: 'bg-green-600' },
    'non-veg': { icon: Drumstick, bg: 'bg-red-600' },
    powder: { icon: Sparkles, bg: 'bg-orange-600' },
    snack: { icon: Cookie, bg: 'bg-yellow-600' },
    sweet: { icon: CakeSlice, bg: 'bg-pink-600' },
};

export default function CartDrawer() {
    const navigate = useNavigate();
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
        // applyCoupon,
    } = useCart();

    const ICON_START = 0.6;
    const ICON_END = 0.75;

    const [addrOpen, setAddrOpen] = useState(false);
    const [animDirMap, setAnimDirMap] = useState<Record<string, 'up' | 'down'>>({});
    const AddressIcon = ({ type }: { type: 'Home' | 'Work' | 'Other' }) => {
        if (type === 'Home') return <Home className="w-4 h-4 text-[#E67E22]" />;
        if (type === 'Work') return <Briefcase className="w-4 h-4 text-[#E67E22]" />;
        return <Navigation className="w-4 h-4 text-[#E67E22]" />;
    };
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const latestXRef = useRef(0);

    const [slideX, setSlideX] = useState(0);
    const [maxSlide, setMaxSlide] = useState(0);
    const progress = maxSlide ? slideX / maxSlide : 0;

    // const isDisabled =
    //     items.length === 0 ||
    //     !address ||
    //     address.isServiceable === false;
    // useEffect(() => {
    //     if (trackRef.current && thumbRef.current) {
    //         const trackWidth = trackRef.current.offsetWidth;
    //         const thumbWidth = thumbRef.current.offsetWidth;

    //         setMaxSlide(trackWidth - thumbWidth - 8); // 8px = padding safety
    //     }
    // }, []);
    useEffect(() => {
        if (!open) return;

        requestAnimationFrame(() => {
            if (trackRef.current && thumbRef.current) {
                const trackWidth = trackRef.current.offsetWidth;
                const thumbWidth = thumbRef.current.offsetWidth;
                setMaxSlide(Math.max(1, trackWidth - thumbWidth - 8));
            }
        });
    }, [open]);

    // normalize between 0 → 1 for icon morph window
    const iconProgress = Math.min(
        1,
        Math.max(0, (progress - ICON_START) / (ICON_END - ICON_START))
    );

    return (
        <>
            <div
                className={`fixed inset-0 z-50 ${open ? 'visible' : 'invisible'}`}
                aria-hidden={!open}
            >
                {/* BACKDROP */}
                <div
                    onClick={toggleCart}
                    className={`absolute inset-0 bg-black/40 transition ${open ? 'opacity-100' : 'opacity-0'}`}
                    style={{ pointerEvents: open ? 'auto' : 'none' }}
                />

                {/* DRAWER */}
                <aside
                    className={`absolute overflow-y-scroll right-0 top-0 min-h-[100dvh] max-h-[100dvh] w-full sm:w-[420px] bg-[#FAF7F2] shadow-xl transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'
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

                            {/* ================= COUPON ================= */}
                            <div className="bg-white rounded-2xl border p-4 w-full space-y-4">

                                {/* Header */}
                                <div className="flex items-center gap-2 text-xs text-[#6B5A4A]">
                                    <HandCoins className="w-4 h-4 text-[#E67E22]" />
                                    <span>Savings Corner</span>
                                </div>

                                {/* Apply Coupon */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Tag className="w-4 h-4 text-[#E67E22]" />
                                        <span>Have a Coupon?</span>
                                    </div>

                                    <input
                                        type="text"
                                        name="couponcode"
                                        id="couponcode"
                                        placeholder="Enter code"
                                        className="w-32 text-sm px-3 py-1.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#E67E22]/40 focus:border-[#E67E22]"
                                    />
                                </div>

                                {/* Applied State */}
                                {couponCode && (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                                        <div className="flex items-center gap-2 text-sm text-green-800">
                                            <Tag className="w-4 h-4" />
                                            <span>
                                                ₹{discount} saved with <strong>"{couponCode}"</strong>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 text-xs font-medium text-green-700">
                                            <Check className="w-4 h-4" />
                                            Applied
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Bill */}
                            <div className="bg-white rounded-2xl p-4 space-y-2">
                                <div className="rounded-full flex gap-2 flex-row items-start justify-start">
                                    <ReceiptText className="w-4 h-4 text-[#E67E22]" />
                                    <p className="text-xs text-[#6B5A4A]">Bill  </p>
                                </div>
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
                                        <Tag className="w-4 h-4" />
                                        Coupon Discount
                                    </span>
                                    <span>-₹{discount}</span>
                                </div>

                                <div className="h-px bg-black/10 my-2" />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            {/* ADDRESS */}
                            <div className="bg-white rounded-2xl p-4 flex justify-between items-start gap-3">
                                <div className="flex flex-col gap-1 items-start">
                                    <div className="rounded-full flex gap-2 flex-row items-center justify-center">
                                        {address ? <AddressIcon type={address.type} /> : <Navigation className="w-4 h-4 text-[#E67E22]" />}
                                        <p className="text-xs text-[#6B5A4A]">
                                            {address ? address.type : 'Deliver to'}
                                        </p>
                                    </div>

                                    <p className="text-sm font-medium whitespace-pre-line">
                                        {address
                                            ? `${address.name} • ${address.phone}\n${address.house}
                                            ${address.mandal}, ${address.district}
                                            ${address.state} - ${address.pincode}`
                                            : 'Add delivery address'}
                                    </p>

                                </div>
                                <Pen
                                    className="cursor-pointer mt-1"
                                    onClick={() => setAddrOpen(true)}
                                />
                            </div>

                        </div>
                    )}

                    {/* Gap */}
                    {items.length < 2 && (<div className="pb-32"></div>)}


                    {/* SLIDE TO PAY */}
                    {items.length > 0 && (<div className="sticky bottom-0 z-20 bg-white p-4">
                        <p className="font-semibold text-sm mb-1">Slide to Complete</p>

                        <div
                            ref={trackRef}
                            className="relative w-full h-14 rounded-full bg-green-600 overflow-hidden select-none"
                        >
                            {/* Text */}
                            <div
                                className="absolute inset-0 flex items-center justify-center font-semibold text-white transition-opacity duration-150"
                                style={{
                                    opacity: Math.max(0.1, 1 - progress),
                                }}
                            >
                                CONFIRM ORDER
                            </div>

                            {/* Thumb */}
                            <div
                                ref={thumbRef}
                                className="absolute top-1 left-1 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center cursor-pointer"
                                style={{ transform: `translateX(${slideX}px)` }}

                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const startX = e.clientX;

                                    const onMove = (ev: MouseEvent) => {
                                        const delta = ev.clientX - startX;
                                        const clamped = Math.max(0, Math.min(delta, maxSlide));
                                        latestXRef.current = clamped;   // ✅ ADD THIS
                                        setSlideX(clamped);
                                    };

                                    const onUp = () => {
                                        const finalProgress = latestXRef.current / maxSlide;

                                        if (finalProgress >= 0.95) {
                                            navigate('/payment');
                                            return;
                                        }

                                        setSlideX(0);

                                        window.removeEventListener('mousemove', onMove);
                                        window.removeEventListener('mouseup', onUp);
                                    };

                                    window.addEventListener('mousemove', onMove);
                                    window.addEventListener('mouseup', onUp);
                                }}

                                onTouchStart={(e) => {
                                    const startX = e.touches[0].clientX;

                                    const onMove = (ev: TouchEvent) => {
                                        ev.preventDefault();
                                        const delta = ev.touches[0].clientX - startX;
                                        const clamped = Math.max(0, Math.min(delta, maxSlide));
                                        latestXRef.current = clamped;   // ✅ ADD THIS
                                        setSlideX(clamped);
                                    };

                                    const onEnd = () => {
                                        const finalProgress = latestXRef.current / maxSlide;
                                        if (finalProgress >= 0.95) {
                                            navigate('/payment');
                                            return;
                                        }
                                        setSlideX(0);
                                        window.removeEventListener('touchmove', onMove);
                                        window.removeEventListener('touchend', onEnd);
                                    };

                                    window.addEventListener('touchmove', onMove);
                                    window.addEventListener('touchend', onEnd);
                                }}
                            >
                                {/* ICON MORPH */}
                                <div className="relative w-6 h-6">

                                    {/* Chevrons */}
                                    <ChevronsRight
                                        className="absolute inset-0 transition-all duration-200 text-green-600"
                                        style={{
                                            opacity: 1 - iconProgress,
                                            transform: `rotate(${iconProgress * 70}deg)`,
                                        }}
                                    />

                                    {/* Check */}
                                    <Check
                                        className="absolute inset-0 transition-all duration-200 text-green-600"
                                        style={{
                                            opacity: iconProgress,
                                            transform: `scale(${0.7 + iconProgress * 0.3})`,
                                        }}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>)}
                </aside>
            </div>

            <AddressModal open={addrOpen} onClose={() => setAddrOpen(false)} />
        </>
    );
}
