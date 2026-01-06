import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard, { Product } from './ProductCard';
import FilterDropdown from './FilterDropdown';
import { useCart } from './CartContext';
import {
  LayoutGrid, Leaf, Drumstick, Sparkles, Cookie, CakeSlice,
  ArrowUp, ArrowDown, ArrowUpAZ, ArrowDownAZ,
  TrendingUp, ShoppingBag, CalendarClock, Star,
} from 'lucide-react';

import products from '../data/products';

/* ---------------- CATEGORY OPTIONS ---------------- */
const CATEGORY_OPTIONS = [
  { label: 'All', value: 'all', icon: LayoutGrid, iconColor: 'text-[#6B5A4A]' },
  { label: 'Veg Pickles', value: 'veg', icon: Leaf, iconColor: 'text-green-600' },
  { label: 'Non Veg Pickles', value: 'non-veg', icon: Drumstick, iconColor: 'text-red-600' },
  { label: 'Powders', value: 'powder', icon: Sparkles, iconColor: 'text-orange-500' },
  { label: 'Snacks', value: 'snack', icon: Cookie, iconColor: 'text-yellow-600' },
  { label: 'Sweets', value: 'sweet', icon: CakeSlice, iconColor: 'text-pink-500' },
];

/* ---------------- SORT OPTIONS ---------------- */
type SortKey =
  | 'newest-desc'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'popularity-desc'
  | 'orders-desc';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest-desc', icon: CalendarClock, iconColor: 'text-sky-600' },
  { label: 'Name (A → Z)', value: 'name-asc', icon: ArrowDownAZ, iconColor: 'text-indigo-600' },
  { label: 'Name (Z → A)', value: 'name-desc', icon: ArrowUpAZ, iconColor: 'text-indigo-600' },
  { label: 'Price (Low → High)', value: 'price-asc', icon: ArrowDown, iconColor: 'text-emerald-600' },
  { label: 'Price (High → Low)', value: 'price-desc', icon: ArrowUp, iconColor: 'text-emerald-600' },
  { label: 'Rating (High → Low)', value: 'rating-desc', icon: Star, iconColor: 'text-amber-500' },
  { label: 'Popularity', value: 'popularity-desc', icon: TrendingUp, iconColor: 'text-rose-500' },
  { label: 'Orders', value: 'orders-desc', icon: ShoppingBag, iconColor: 'text-blue-600' },
];

function sortProducts(list: Product[], sort: SortKey) {
  const copy = [...list];
  switch (sort) {
    case 'newest-desc': return copy.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
    case 'name-asc': return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc': return copy.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc': return copy.sort((a, b) => a.price - b.price);
    case 'price-desc': return copy.sort((a, b) => b.price - a.price);
    case 'rating-desc': return copy.sort((a, b) => b.rating - a.rating);
    case 'popularity-desc': return copy.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    case 'orders-desc': return copy.sort((a, b) => (b.orders || 0) - (a.orders || 0));
    default: return copy;
  }
}

/* ---------------- COMPONENT ---------------- */
export default function FullMenu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';

  const { items, addOne, removeOne, buyNow } = useCart();

  const [activeFilter, setActiveFilter] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState<SortKey>('newest-desc');
  const [isExiting, setIsExiting] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [animDir, setAnimDir] = useState<'up' | 'down'>('up');

  const qtyOf = (id: string) =>
    items.find(i => i.id === id)?.quantity || 0;

  useEffect(() => {
    if (searchParams.get('category')) {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveFilter(categoryFromUrl);
  }, [categoryFromUrl, searchParams]);

  const handleCategoryChange = (value: string) => {
    if (value === activeFilter) return;
    setIsExiting(true);
    setTimeout(() => {
      setSearchParams(value === 'all' ? {} : { category: value });
      setIsExiting(false);
    }, 220);
  };

  const handleSortChange = (value: SortKey) => {
    if (value === sortBy) return;
    setIsSorting(true);
    setTimeout(() => {
      setSortBy(value);
      setIsSorting(false);
    }, 180);
  };

  const filtered =
    activeFilter === 'all'
      ? products
      : products.filter(p => p.category === activeFilter);

  const visible = sortProducts(filtered, sortBy);

  const isAnimatingOut = isExiting || isSorting;

  return (
    <section id="menu" className="py-20 lg:py-32 bg-[#FFF9F3]">
          <div className="max-w-7xl mx-auto px-2 md:px-5 lg:px-20">
            <div className="flex flex-col md:flex-row justify-center items-center md:justify-between gap-6 mb-10">
              <div>
                <h2 className="text-4xl font-semibold text-[#2D1F14] text-center md:text-left">
                  Fresh From Our Kitchen
                </h2>
                <p className="text-[#6B5A4A] text-center md:text-left">
                  Small-batch, homemade Andhra flavors
                </p>
              </div>
    
              <div className="flex flex-wrap items-center justify-center gap-3">
                <FilterDropdown
                  label="Category"
                  value={activeFilter}
                  options={CATEGORY_OPTIONS}
                  onChange={handleCategoryChange}
                  align="left"
                />
                <FilterDropdown
                  label="Sort By"
                  value={sortBy}
                  options={SORT_OPTIONS}
                  onChange={v => handleSortChange(v as SortKey)}
                  align="right"
                />
              </div>
            </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-2 lg:gap-4">
          {visible.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: !isAnimatingOut ? `${index * 40}ms` : '0ms' }}
              className={isAnimatingOut ? 'product-card-exit' : 'product-card-enter'}
            >
              <ProductCard
                product={product}
                quantity={qtyOf(product.id)}
                animDir={animDir}
                onAdd={() => {
                  setAnimDir('up');
                  addOne(product);
                }}
                onIncrease={() => {
                  setAnimDir('up');
                  addOne(product);
                }}
                onDecrease={() => {
                  setAnimDir('down');
                  removeOne(product.id);
                }}
                onBuyNow={() => {
                  const qty = qtyOf(product.id) || 1;
                  buyNow(product, qty);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}