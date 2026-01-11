// src/components/AdminProductModal.tsx
import React, { useEffect, useState } from 'react';
import { X, Camera } from 'lucide-react';
import type { Product } from './ProductCard';

type Props = {
  open: boolean;
  onClose: () => void;
  initialProduct?: Product;
  onSave: (p: Product) => void;
};

export default function AdminProductModal({ open, onClose, initialProduct, onSave }: Props) {
  const [form, setForm] = useState<Product>(() => ({
    id: '',
    name: '',
    teluguName: '',
    price: 0,
    weight: '',
    image: '',
    category: 'veg',
    rating: 0,
    ratingCount: 0,
    popularity: 0,
    orders: 0,
    comments: 0,
    trendingScore: 0,
  }));

  useEffect(() => {
    if (initialProduct) {
      setForm(initialProduct);
    } else {
      setForm((f) => ({ ...f, id: '', name: '', price: 0 }));
    }
  }, [initialProduct]);

  if (!open) return null;

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((s) => ({ ...s, image: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl w-full max-w-2xl p-5 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{form.id ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5"><X /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">Name</label>
            <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="text-xs text-gray-600">Telugu name (optional)</label>
            <input value={form.teluguName} onChange={(e) => setForm((s) => ({ ...s, teluguName: e.target.value }))} className="w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="text-xs text-gray-600">Price</label>
            <input type="number" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))} className="w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="text-xs text-gray-600">Weight / Unit</label>
            <input value={form.weight} onChange={(e) => setForm((s) => ({ ...s, weight: e.target.value }))} className="w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="text-xs text-gray-600">Category</label>
            <select value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as any }))} className="w-full border rounded px-2 py-1">
              <option value="veg">veg</option>
              <option value="non-veg">non-veg</option>
              <option value="powder">powder</option>
              <option value="snack">snack</option>
              <option value="sweet">sweet</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600">Image (url or upload)</label>
            <div className="flex gap-2">
              <input placeholder="https://..." value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} className="flex-1 border rounded px-2 py-1" />
              <label className="flex items-center gap-2 px-3 py-1 border rounded cursor-pointer">
                <Camera />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </div>
            {form.image && <img src={form.image} alt="preview" className="w-28 h-20 object-cover rounded mt-2" />}
          </div>

          <div>
            <label className="text-xs text-gray-600">Rating</label>
            <input type="number" value={form.rating} onChange={(e) => setForm((s) => ({ ...s, rating: Number(e.target.value) }))} className="w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="text-xs text-gray-600">Orders (for popularity)</label>
            <input type="number" value={form.orders} onChange={(e) => setForm((s) => ({ ...s, orders: Number(e.target.value) }))} className="w-full border rounded px-2 py-1" />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button onClick={() => {
            // basic validation
            if (!form.name.trim()) return alert('Name required');
            onSave(form);
          }} className="px-4 py-2 rounded-md bg-[#E67E22] text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
