import { useUser } from '../contexts/UserContext';
import {
    Bookmark,
    ShoppingCart,
    Star,
    Leaf,
    Drumstick,
    Sparkles,
    Cookie,
    CakeSlice,
} from 'lucide-react';
import MarqueeText from './MarqueeText';

export type Product = {
    id: string;
    name: string;
    teluguName?: string;
    price: number;
    weight: string;
    image: string;
    category: 'veg' | 'non-veg' | 'powder' | 'snack' | 'sweet';
    rating: number;
    ratingCount: number;
    popularity?: number;
    orders?: number;
    comments?: number;
    trendingScore?: number;
};

type Props = {
    product: Product;
    quantity: number;
    animDir: 'up' | 'down';
    onAdd: () => void;
    onIncrease: () => void;
    onDecrease: () => void;
    onBuyNow: () => void;
};

const CATEGORY_OPTIONS = [
    { value: 'veg', icon: Leaf, iconBg: 'bg-green-600' },
    { value: 'non-veg', icon: Drumstick, iconBg: 'bg-red-600' },
    { value: 'powder', icon: Sparkles, iconBg: 'bg-orange-600' },
    { value: 'snack', icon: Cookie, iconBg: 'bg-yellow-600' },
    { value: 'sweet', icon: CakeSlice, iconBg: 'bg-pink-600' },
];

export default function ProductCard({
    product,
    quantity,
    animDir,
    onAdd,
    onIncrease,
    onDecrease,
    onBuyNow,
}: Props) {
    const categoryData = CATEGORY_OPTIONS.find(
        (cat) => cat.value === product.category
    );

    const { addToWishlist, removeFromWishlist, isInWishlist } = useUser();

    const liked = isInWishlist(product.id);

    const toggleWishlist = () => {
        if (liked) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product.id);
        }
    };


    return (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
            {/* IMAGE */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {categoryData && (
                    <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2">
                        <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${categoryData.iconBg}`}
                        >
                            <categoryData.icon className="w-3.5 h-3.5 text-white" />
                        </span>
                    </div>
                )}

                <button
                    onClick={toggleWishlist}
                    className="absolute bottom-1 md:bottom-2 right-1 md:right-1 w-6 h-6
        flex items-center justify-center rounded-full
        active:scale-90 transition-transform"
                >
                    <Bookmark
                        className={`relative z-10 w-6 h-6 transition-all duration-300
            ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${liked
                                ? 'fill-[#E67E22] text-[#E67E22] scale-110'
                                : 'fill-transparent text-white'
                            }`}
                    />
                </button>

            </div>

            {/* CONTENT */}
            <div className="w-full h-full py-2 lg:py-4">
                <div className='px-2 lg:px-4'>
                    <MarqueeText text={product.name} />
                    {product.teluguName && (
                        <MarqueeText
                            text={product.teluguName}
                            variant="secondary"
                        />
                    )}
                </div>

                <div className="w-full px-2 lg:px-4 flex flex-col flex-wrap items-center justify-items-center gap-2">

                    <div className='w-full flex flex-row justify-around items-center'>
                        {/* RATING */}
                        <div>
                            {product.rating && (
                                <div className="w-full flex flex-row flex-wrap text-xs md:text-sm text-[#6B5A4A]">
                                    <div className="flex items-center gap-">
                                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                                        <span className="font-semibold text-[#2D1F14]">
                                            {product.rating}
                                        </span>
                                    </div>
                                    <span className="text-[#6B5A4A]/70">
                                        ({product.ratingCount}+)
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* PRICE */}
                        <div className='flex flex-col gap-0'>
                            <p className="text-base md:text-lg lg:text-xl font-bold text-[#D35400] leading-none">
                                ₹{product.price}
                            </p>
                            <span className="text-xs md:text-sm text-[#6B5A4A]">{product.weight}</span>
                        </div>
                    </div>

                </div>

                <div className='flex flex-row gap-1 md:gap-2 justify-center'>
                    {/* ADD / QTY */}
                    <div className="flex justify-end">
                        {quantity > 0 ? (
                            <div className="h-7 md:h-9 w-[55px] md:w-[80px] rounded-xl border border-[#E8E0D6] grid grid-cols-3 items-center overflow-hidden">
                                <button className="h-full text-lg qty-minus-anim" onClick={onDecrease}>
                                    −
                                </button>

                                <div className="relative h-5 overflow-hidden text-xs md:text-sm font-semibold text-center">
                                    <span
                                        key={`${product.id}-${quantity}`}
                                        className={`absolute inset-0 ${animDir === 'up' ? 'qty-up' : 'qty-down'
                                            }`}
                                    >
                                        {quantity}
                                    </span>
                                </div>

                                <button className="h-full text-lg qty-plus-anim" onClick={onIncrease}>
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onAdd}
                                className="h-7 md:h-9 w-[55px] md:w-[80px] rounded-xl bg-[#E67E22] text-white text-xs md:text-sm font-semibold flex items-center justify-center gap-1"
                            >
                                Add <span className='hidden md:flex flex-row items-center'>to <ShoppingCart className="w-4 h-4" /></span>
                            </button>
                        )}
                    </div>

                    {/* BUY NOW */}
                    <div className="flex justify-end">
                        <button
                            onClick={onBuyNow}
                            className="h-7 md:h-9 w-[55px] md:w-[80px] rounded-xl border border-[#E67E22] text-[#E67E22] text-xs md:text-sm font-semibold flex items-center justify-center gap-1"
                        >
                            Buy <span className='hidden md:flex flex-row items-center'>Now</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
