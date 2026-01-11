// src/pages/AdminMenu.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit3, Trash2, Search, Filter, Grid, List } from 'lucide-react';
import ProductCard, { Product } from '../components/ProductCard';
import AdminProductModal from '../components/AdminProductModal';
import defaultProducts from '../data/products'; // ensure this exists
import { useUser } from '../contexts/UserContext'; // for quick stats / ties to users/orders
// Citation: admin & user context shape used as reference. :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}

const STORAGE_KEY = 'hp_products_v1';
const BRAND = '#E67E22';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function AdminMenu() {
  const { orders } = useUser(); // for useful quick stats on product pages
  const [products, setProducts] = useState<Product[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // load from localStorage (fallback to bundled defaultProducts)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProducts(JSON.parse(raw));
      } else {
        setProducts(defaultProducts as Product[]);
      }
    } catch (e) {
      console.warn('Failed to load products from storage, using default', e);
      setProducts(defaultProducts as Product[]);
    }
  }, []);

  useEffect(() => {
    // persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products
      .filter((p) => (categoryFilter === 'all' ? true : p.category === categoryFilter))
      .filter((p) => !term || `${p.name} ${p.teluguName || ''}`.toLowerCase().includes(term));
  }, [products, q, categoryFilter]);

  const openAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setOpenModal(true);
  };

  const handleSave = (p: Product) => {
    if (!p.id) {
      // new
      p.id = uid();
      setProducts((s) => [p, ...s]);
    } else {
      // update
      setProducts((s) => s.map((x) => (x.id === p.id ? p : x)));
    }
    setOpenModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setProducts((s) => s.filter((p) => p.id !== id));
  };

  const handleAddCategory = (cat: string) => {
    // adding a category is simply setting it on a product flow in this frontend-only manager;
    // We provide a quick helper to create a placeholder product for new category so admin can fill it.
    const placeholder: Product = {
      id: uid(),
      name: `New ${cat}`,
      price: 0,
      weight: '',
      image: '',
      category: cat as any,
      rating: 0,
      ratingCount: 0,
      teluguName: '',
      popularity: 0,
      orders: 0,
      comments: 0,
      trendingScore: 0,
    };
    setEditing(placeholder);
    setOpenModal(true);
  };

  const bulkDelete = () => {
    if (!confirm('Delete ALL products currently visible?')) return;
    const ids = new Set(filtered.map((p) => p.id));
    setProducts((s) => s.filter((p) => !ids.has(p.id)));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin — Menu Manager</h1>
          <p className="text-sm text-[#6B5A4A] mt-1">Edit products, categories, filters — all in one place. Brand accent applied everywhere.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 text-right">
            <div>Orders total</div>
            <div className="font-semibold">{orders.length}</div>
          </div>

          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E67E22] text-white shadow">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 border">
          <Search className="w-4 h-4 text-[#6B5A4A]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or telugu name" className="outline-none text-sm" />
        </div>

        <div className="flex items-center gap-2">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-full border bg-white text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-white shadow' : 'bg-white/90'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-white shadow' : 'bg-white/90'}`}><List className="w-4 h-4" /></button>

          <button onClick={bulkDelete} className="px-3 py-2 rounded-full border text-sm text-red-600">Delete Visible</button>
        </div>
      </div>

      {/* category quick-actions */}
      <div className="flex gap-2 flex-wrap">
        {categories.filter(c => c !== 'all').map((c) => (
          <button key={c} onClick={() => setCategoryFilter(c)} className={`px-3 py-1 rounded-full border text-sm ${categoryFilter === c ? 'bg-[#FFF3E8] text-[#E67E22]' : 'bg-white'}`}>
            {c}
          </button>
        ))}

        <div className="border-l pl-3 ml-2">
          <small className="text-xs text-[#6B5A4A]">Quick add category:</small>
          <button onClick={() => {
            const newCat = prompt('Category name');
            if (newCat) handleAddCategory(newCat.trim());
          }} className="ml-2 text-sm text-[#E67E22]">+ add</button>
        </div>
      </div>

      {/* Product list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="relative">
              <div className="absolute top-2 right-2 z-20 flex gap-1">
                <button onClick={() => openEdit(p)} className="bg-white p-1 rounded-full shadow"><Edit3 className="w-4 h-4 text-[#E67E22]" /></button>
                <button onClick={() => handleDelete(p.id)} className="bg-white p-1 rounded-full shadow"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>

              <ProductCard
                product={p}
                quantity={0}
                animDir="up"
                onAdd={() => {}}
                onIncrease={() => {}}
                onDecrease={() => {}}
                onBuyNow={() => {}}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-4 flex items-center justify-between border">
              <div className="flex gap-4 items-center">
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded object-cover" />
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-[#6B5A4A]">{p.teluguName}</div>
                  <div className="text-sm mt-1">₹{p.price} • {p.weight} • {p.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(p)} className="px-3 py-2 rounded-md border text-sm text-[#E67E22]">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-2 rounded-md border text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminProductModal
        open={openModal}
        initialProduct={editing ?? undefined}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
