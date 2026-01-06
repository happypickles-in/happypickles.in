import { Gift, Check, Clock, ArrowRight } from 'lucide-react';
import products from '../data/products';
import { Product } from '../types/product';
import { useCart } from './CartContext';

export default function Offer() {
  const { addOne, toggleCart } = useCart();

  // derive best sellers (top 3 by orders)
  const bestSellers: Product[] = [...products]
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 3);

  if (bestSellers.length < 3) return null;

  const [first, second, third] = bestSellers;

  const originalPrice =
    first.price + second.price + third.price;

  const offerPrice = Math.round(originalPrice * 0.85); // 15% off

  // ✅ ORDER COMBO LOGIC
  const handleOrderCombo = () => {
    bestSellers.forEach(product => {
      addOne(product); // add 1 qty of each
    });
    toggleCart(); // open cart
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-[#D35400] to-[#C0392B] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Gift className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">
                Special Combo Offer
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Try Our Bestseller Combo
            </h2>

            <p className="text-white/90 text-lg mb-8">
              A curated trio of our most-loved pickles, handpicked to give you the complete Andhra experience.
            </p>

            <div className="space-y-4 mb-8">
              {[first, second, third].map(product => (
                <div key={product.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-[#D35400]" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold mb-1">
                      {product.name} ({product.weight})
                    </p>
                    <p className="text-white/80 text-sm">
                      One of our top customer favorites
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-white/60 text-2xl line-through">
                  ₹{originalPrice}
                </span>
                <span className="text-white text-4xl font-bold">
                  ₹{offerPrice}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="bg-[#F39C12] text-white text-sm font-semibold px-3 py-1 rounded-full">
                  Save 15%
                </span>
                <span className="text-sm">• Limited weekly batch</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleOrderCombo}
                className="flex-1 bg-white hover:bg-gray-100 text-[#D35400] font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Order the Combo
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Clock className="w-5 h-5" />
                <span>Fresh batch dispatched weekly</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={first.image}
                    alt={first.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl mt-8">
                  <img
                    src={second.image}
                    alt={second.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl -mt-8 col-span-2">
                  <img
                    src={third.image}
                    alt={third.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-[#F39C12] text-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-xl rotate-12">
              <span className="text-3xl font-bold">15%</span>
              <span className="text-xs">OFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
