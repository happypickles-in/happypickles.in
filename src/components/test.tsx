import {
    Truck,
    Package,
    Bookmark,
    Edit3,
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
    const tempaddresses = [
        { id: 1, label: 'Home', address: '12-4-56, Main Road, Rajahmundry' },
        { id: 2, label: 'Work', address: 'IT Park, Madhapur, Hyderabad' },
        { id: 3, label: 'Other', address: 'Near Bus Stand, Kakinada' },
    ];

    const {
        profile,
        addresses,
        orders,
        wishlist,
        setDefaultAddress,
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
                    <Edit3 size={18} />
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
                    <button className="flex items-center gap-1 text-sm text-[#E67E22] font-medium">
                        <Plus size={16} /> Add
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {tempaddresses.map((a) => (
                        <div
                            key={a.id}
                            className="group border rounded-xl p-4 space-y-2 hover:border-[#E67E22]/40 transition"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-medium">
                                    {a.label === 'Home' && <Home size={18} color={BRAND} />}
                                    {a.label === 'Work' && <Briefcase size={18} color={BRAND} />}
                                    {a.label === 'Other' && <Navigation size={18} color={BRAND} />}
                                    {a.label}
                                </div>

                                <Edit3
                                    size={16}
                                    className="text-[#E67E22] opacity-0 group-hover:opacity-100 transition"
                                />
                            </div>

                            <div className="text-sm text-[#6B5A4A] leading-relaxed">
                                {a.address}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <EditProfileModal
                open={editProfileOpen}
                onClose={() => setEditProfileOpen(false)}
            />

            <AdressModal
                open={addressModalOpen}
                onClose={() => setAddressModalOpen(false)}
            />
        </div>
    );
}
