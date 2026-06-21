import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

const emptyProd = { productName: '', category: '', quantity: '', unit: 'KG', pricePerUnit: '', description: '', available: true };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProd);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchProducts = useCallback(() => {
    api.get('/farmer/products').then(r => setProducts(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => { setEditing(null); setForm(emptyProd); setModal(true); };
  const openEdit = (p) => { setEditing(p._id); setForm({ productName: p.productName, category: p.category || '', quantity: p.quantity, unit: p.unit || 'KG', pricePerUnit: p.pricePerUnit, description: p.description || '', available: p.available }); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/farmer/products/${editing}`, form);
      else await api.post('/farmer/products', form);
      setToast({ message: editing ? 'Product updated!' : 'Product added!', type: 'success' });
      setModal(false); fetchProducts();
    } catch { setToast({ message: 'Failed to save product', type: 'error' }); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/farmer/products/${id}`);
      setToast({ message: 'Deleted', type: 'success' }); fetchProducts();
    } catch { setToast({ message: 'Failed to delete', type: 'error' }); }
  };

  const toggleAvail = async (p) => {
    try {
      await api.patch(`/farmer/products/${p._id}/availability`, { available: !p.available });
      fetchProducts();
    } catch { setToast({ message: 'Failed to update', type: 'error' }); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Button onClick={openAdd}>+ Add Product</Button>
      </div>
      {products.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">🌾</div>
          <p className="text-[#a8b2d8]">No products yet. Add your first product!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <Card key={p._id}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-semibold">{p.productName}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.available ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {p.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              {p.category && <p className="text-[#a8b2d8] text-xs mb-2">{p.category}</p>}
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div><span className="text-[#a8b2d8]">Qty: </span><span className="text-white">{p.quantity} {p.unit}</span></div>
                <div><span className="text-[#a8b2d8]">Price: </span><span className="text-white">₹{p.pricePerUnit}/{p.unit}</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="text-xs flex-1 py-1" onClick={() => openEdit(p)}>Edit</Button>
                <Button variant="secondary" className="text-xs flex-1 py-1" onClick={() => toggleAvail(p)}>{p.available ? 'Disable' : 'Enable'}</Button>
                <Button variant="danger" className="text-xs px-3 py-1" onClick={() => del(p._id)}>🗑️</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={save} className="space-y-3">
          <Input label="Product Name" value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} required />
          <Input label="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantity" type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
            <Input label="Unit" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="KG, MT" />
          </div>
          <Input label="Price per Unit (₹)" type="number" value={form.pricePerUnit} onChange={e => setForm({...form, pricePerUnit: e.target.value})} required />
          <Input label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.available} onChange={e => setForm({...form, available: e.target.checked})} className="rounded" />
            <span className="text-[#a8b2d8] text-sm">Available for sale</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>{editing ? 'Update' : 'Add Product'}</Button>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
