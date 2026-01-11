import { Flame } from 'lucide-react';
import { useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import { useCart } from '../contexts/CartContext';

import products from '../data/products';

const BESTSELLERS: Product[] = [...products]
  .sort((a, b) => b.orders - a.orders)
  .slice(0, 3);

/* ---------------- COMPONENT ---------------- */
export default function Bestsellers() {
  const { items, addOne, removeOne, buyNow } = useCart();

  const [animDirMap, setAnimDirMap] = useState<
    Record<string, 'up' | 'down'>
  >({});

  const qtyOf = (id: string) =>
    items.find((i) => i.id === id)?.quantity || 0;

  return (
    <section id="bestsellers" className="py-20 lg:py-32 bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-2 md:px-5 lg:px-20">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <Flame className="w-6 h-6 text-[#D35400]" />
            <span className="text-sm font-semibold text-[#D35400] uppercase tracking-wider">
              Most Loved
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#2D1F14] mb-3">
            Our Bestsellers
          </h2>
          <p className="text-[#6B5A4A] max-w-2xl mx-auto">
            The flavors our customers keep coming back for.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-3 gap-1 md:gap-2 md:gap-4 max-w-4xl mx-auto">
          {BESTSELLERS.map((product, index) => {
            const qty = qtyOf(product.id);
            const animDir = animDirMap[product.id] || 'up';

            return (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 40}ms` }}
                className="product-card-enter"
              >
                <ProductCard
                  product={product}
                  quantity={qty}
                  animDir={animDir}
                  onAdd={() => {
                    setAnimDirMap((p) => ({
                      ...p,
                      [product.id]: 'up',
                    }));
                    addOne(product);
                  }}
                  onIncrease={() => {
                    setAnimDirMap((p) => ({
                      ...p,
                      [product.id]: 'up',
                    }));
                    addOne(product);
                  }}
                  onDecrease={() => {
                    setAnimDirMap((p) => ({
                      ...p,
                      [product.id]: 'down',
                    }));
                    removeOne(product.id);
                  }}
                  onBuyNow={() => {
                    buyNow(product, qty || 1);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
