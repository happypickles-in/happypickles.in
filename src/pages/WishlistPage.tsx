import { useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import products from '../data/products';
import ProductCard from '../components/ProductCard';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
    const navigate = useNavigate();
    const { wishlist } = useUser();
    const { items, addOne, removeOne, buyNow } = useCart();

    // ✅ get quantity from cart (SAME as FullMenu / Bestsellers)
    const qtyOf = (id: string) =>
        items.find(i => i.id === id)?.quantity || 0;

    // ✅ convert Product → CartItem shape
    const toCartItem = (product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        weight: product.weight,
        category: product.category,
    });

    const wishlistProducts = useMemo(() => {
        return products.filter(p => wishlist.includes(p.id));
    }, [wishlist]);

    if (wishlistProducts.length === 0) {
        return (

            <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
                        <Bookmark className="w-12 h-12 text-orange-500" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center animate-bounce">
                        0
                    </span>
                </div>

                <h3 className="text-xl font-bold text-[#2D1F14] mb-2">
                    Your wishlist is empty 💔
                </h3>

                <p className="text-sm text-[#6B5A4A] max-w-xs mb-2">
                    Save your favorites before they disappear!
                </p>
                <p className="text-sm text-[#6B5A4A] max-w-xs mb-6">
                    Tap the '🔖' on products you love ✨
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:scale-105 transition shadow-md"
                >
                    Explore Products
                </button>

                <p className="text-xs text-[#6B5A4A]/70 mt-4">
                    Tip: Wishlists make checkout faster 😉
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold">Your Wishlist</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {wishlistProducts.map(product => {
                    const qty = qtyOf(product.id);

                    return (
                        <div key={product.id}>
                            <ProductCard
                                product={product}
                                quantity={qty}
                                animDir="up"
                                onAdd={() => addOne(toCartItem(product))}
                                onIncrease={() => addOne(toCartItem(product))}
                                onDecrease={() => removeOne(product.id)}
                                onBuyNow={() => buyNow(toCartItem(product), qty || 1)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
