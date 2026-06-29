import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [addModal, setAddModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [form, setForm] = useState(emptyBuyer);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

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
      setAddModal(false); setForm(emptyBuyer); fetchBuyers();
    } catch { setToast({ message: 'Failed to add buyer', type: 'error' }); }
    setSaving(false);
  };

  const deleteBuyer = async (id) => {
    if (!confirm('Delete this buyer?')) return;
    try {
      await api.delete(`/exporter/buyers/${id}`);
      setToast({ message: 'Buyer deleted', type: 'success' });
      setSelectedBuyer(null);
      fetchBuyers();
    } catch { setToast({ message: 'Failed to delete', type: 'error' }); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Buyers</h1>
        <Button onClick={() => setAddModal(true)}>+ Add Buyer</Button>
      </div>

      {buyers.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-[#a8b2d8]">No buyers yet. Add your first buyer!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyers.map(b => (
            <Card key={b._id} className="cursor-pointer hover:border-[#6366f1]/50 transition-all" onClick={() => setSelectedBuyer(b)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {(b.buyerName || b.name || 'B')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{b.buyerName}</p>
                  {b.companyName && <p className="text-[#6366f1] text-xs truncate">{b.companyName}</p>}
                </div>
                <button onClick={e => { e.stopPropagation(); deleteBuyer(b._id); }} className="text-red-400 hover:text-red-300 text-lg flex-shrink-0">🗑️</button>
              </div>
              <div className="space-y-1 text-sm mb-4">
                {b.email && <p className="text-[#a8b2d8]">✉️ {b.email}</p>}
                {b.phone && <p className="text-[#a8b2d8]">📞 {b.phone}</p>}
                {b.country && <p className="text-[#a8b2d8]">🌍 {b.country}</p>}
              </div>
              <button
                onClick={e => { e.stopPropagation(); navigate('/exporter/shipments/create', { state: { buyer: b } }); }}
                className="w-full py-2 rounded-lg bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#5254cc] transition-all"
              >
                📦 Create Shipment
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <Modal isOpen={!!selectedBuyer} onClose={() => setSelectedBuyer(null)} title="Buyer Details">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-lg">
              {(selectedBuyer.buyerName || 'B')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{selectedBuyer.buyerName}</p>
              {selectedBuyer.companyName && <p className="text-[#6366f1] text-sm">{selectedBuyer.companyName}</p>}
            </div>
          </div>
          <div className="space-y-3 mb-6">
            {[
              { label: 'Email', value: selectedBuyer.email },
              { label: 'Phone', value: selectedBuyer.phone },
              { label: 'Country', value: selectedBuyer.country },
              { label: 'Address', value: selectedBuyer.address },
            ].map(row => row.value && (
              <div key={row.label} className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#a8b2d8] text-sm">{row.label}</span>
                <span className="text-white text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => { setSelectedBuyer(null); navigate('/exporter/shipments/create', { state: { buyer: selectedBuyer } }); }}>
              📦 Create Shipment for this Buyer
            </Button>
            <Button variant="secondary" onClick={() => setSelectedBuyer(null)}>Close</Button>
          </div>
        </Modal>
      )}

      {/* Add Buyer Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Buyer">
        <form onSubmit={addBuyer} className="space-y-3">
          <Input label="Buyer Name *" value={form.buyerName} onChange={e => setForm({...form, buyerName: e.target.value})} required />
          <Input label="Company Name" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
          <Input label="Email *" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <Input label="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <Input label="Country *" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
          <Input label="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>Add Buyer</Button>
            <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
