import {
    Truck,
    Package,
    Bookmark,
    Pen,
    Plus,
    Home,
    Briefcase,
    Navigation,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import EditProfileModal from '../components/EditProfileModal';
import AdressModal from '../components/AdressModal';

const BRAND = '#E67E22';

export default function UserProfile() {
    const {
        profile,
        addresses,
        setDefaultAddress,
        orders,
        wishlist,
    } = useUser();

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [addressModalOpen, setAddressModalOpen] = useState(false);

    const avatar = (profile as any).photo ? (
        <img
            src={(profile as any).photo}
            className="w-14 h-14 rounded-full object-cover"
        />
    ) : (
        <div className="w-14 h-14 rounded-full bg-[#E67E22] text-white flex items-center justify-center text-xl font-bold">
            {profile.name?.[0]?.toUpperCase() || 'U'}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 bg-[#FAFAFA]">

            {/* PROFILE CARD */}
            <div className="max-w-sm mx-auto bg-white rounded-2xl border p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {avatar}
                    <div>
                        <div className="font-semibold text-lg">{profile.name || 'Your Name'}</div>
                        <div className="text-sm text-[#6B5A4A]">{profile.phone}</div>
                        <div className="text-sm text-[#6B5A4A]">{profile.email}</div>
                    </div>
                </div>

                <button
                    onClick={() => setEditProfileOpen(true)}
                    className="p-2 rounded-lg hover:bg-[#F9F9F9] text-[#E67E22]"
                >
                    <Pen size={18} />
                </button>
            </div>

            {/* ================= QUICK STATS ================= */}
            <section className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <Link to="/orders?type=active" className="flex-1 bg-white rounded-2xl border p-4 flex items-center justify-between hover:shadow-md transition">
                        <div>
                            <div className="text-sm text-[#6B5A4A]">Active</div>
                            <div className="font-semibold text-lg">{orders.length}</div>
                        </div>
                        <Truck className='min-w-6 aspect-square' />
                    </Link>

                    <Link to="/profile/wishlist" className="flex-1 bg-white rounded-2xl border p-4 flex items-center justify-between hover:shadow-md transition">
                        <div>
                            <div className="text-sm text-[#6B5A4A]">Wishlist</div>
                            <div className="font-semibold text-lg">{wishlist.length}</div>
                        </div>
                        <Bookmark className='min-w-6 aspect-square' />
                    </Link>

                    <Link to="/orders" className="flex-1 bg-white rounded-2xl border p-4 flex items-center justify-between hover:shadow-md transition">
                        <div>
                            <div className="text-sm text-[#6B5A4A]">History</div>
                            <div className="font-semibold text-lg">2</div>
                        </div>
                        <Package className='min-w-6 aspect-square' />
                    </Link>
                </div>
            </section>

            {/* ================= ADDRESSES ================= */}
            <section className="bg-white rounded-2xl border p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Saved Addresses</h3>
                    <button
                        onClick={() => setAddressModalOpen(true)}
                        className="flex items-center gap-1 text-sm text-[#E67E22] font-medium"
                    ><Plus size={16} /> Add
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {addresses.map((a) => (
                        <div
                            key={a.id}
                            className={`relative group rounded-2xl border bg-white p-4 transition-all
            hover:shadow-md hover:border-[#E67E22]/40`}
                        >
                            {/* DEFAULT BUTTON */}
                            <button
                                onClick={() => setDefaultAddress(a.id)}
                                className={`absolute top-3 right-3 text-[11px] px-3 py-1 rounded-full font-medium transition
                ${a.isDefault
                                        ? 'bg-[#E67E22] text-white'
                                        : 'border border-[#E67E22] text-[#E67E22] hover:bg-[#E67E22]/10'
                                    }`}
                            >
                                {a.isDefault ? 'Default' : 'Set Default'}
                            </button>

                            {/* HEADER */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 font-semibold text-sm">
                                    {a.label === 'Home' && <Home size={18} color={BRAND} />}
                                    {a.label === 'Work' && <Briefcase size={18} color={BRAND} />}
                                    {a.label === 'Other' && <Navigation size={18} color={BRAND} />}
                                    <span>{a.label}</span>
                                </div>

                                <Pen
                                    size={16}
                                    onClick={() => {
                                        setAddressModalOpen(true);
                                    }}
                                    className="text-[#E67E22] cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                />
                            </div>

                            {/* ADDRESS BODY */}
                            <div className="text-sm text-[#6B5A4A] leading-relaxed">
                                {a ? (
                                    <p className="mt-1">
                                        <span className="font-medium text-[#3D2F25]">
                                            {a.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {' '}• {a.phone}
                                        </span>
                                        <br />
                                        <span className="block mt-1">
                                            {a.house},
                                            {a.mandal ? ` ${a.mandal},` : ''}
                                            {' '}{a.district}, {a.state} – {a.pincode}
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400">No address</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </section >

            <EditProfileModal
                open={editProfileOpen}
                onClose={() => setEditProfileOpen(false)}
            />

            <AdressModal
                open={addressModalOpen}
                onClose={() => setAddressModalOpen(false)}
            />
        </div >
    );
}
