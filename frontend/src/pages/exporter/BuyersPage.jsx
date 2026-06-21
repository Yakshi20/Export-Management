import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

const emptyBuyer = { buyerName: '', companyName: '', email: '', phone: '', country: '', address: '' };

export default function BuyersPage() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyBuyer);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchBuyers = useCallback(() => {
    api.get('/exporter/buyers').then(r => setBuyers(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBuyers(); }, [fetchBuyers]);

  const addBuyer = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/exporter/buyers', form);
      setToast({ message: 'Buyer added!', type: 'success' });
      setModal(false); setForm(emptyBuyer); fetchBuyers();
    } catch { setToast({ message: 'Failed to add buyer', type: 'error' }); }
    setSaving(false);
  };

  const deleteBuyer = async (id) => {
    if (!confirm('Delete this buyer?')) return;
    try {
      await api.delete(`/exporter/buyers/${id}`);
      setToast({ message: 'Buyer deleted', type: 'success' });
      fetchBuyers();
    } catch { setToast({ message: 'Failed to delete', type: 'error' }); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Buyers</h1>
        <Button onClick={() => setModal(true)}>+ Add Buyer</Button>
      </div>
      {buyers.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-[#a8b2d8]">No buyers yet. Add your first buyer!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyers.map(b => (
            <Card key={b._id} className="relative">
              <button onClick={() => deleteBuyer(b._id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-lg">🗑️</button>
              <h3 className="text-white font-semibold pr-8">{b.buyerName}</h3>
              {b.companyName && <p className="text-[#a8b2d8] text-sm">{b.companyName}</p>}
              <div className="mt-3 space-y-1 text-sm">
                {b.email && <p className="text-[#a8b2d8]">✉️ {b.email}</p>}
                {b.phone && <p className="text-[#a8b2d8]">📞 {b.phone}</p>}
                {b.country && <p className="text-[#a8b2d8]">🌍 {b.country}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Buyer">
        <form onSubmit={addBuyer} className="space-y-3">
          <Input label="Buyer Name" value={form.buyerName} onChange={e => setForm({...form, buyerName: e.target.value})} required />
          <Input label="Company Name" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <Input label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <Input label="Country" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
          <Input label="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>Add Buyer</Button>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
