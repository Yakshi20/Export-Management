import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

const emptyBuyer = { buyerName: '', companyName: '', email: '', phone: '', country: '', address: '', productInterested: '', status: 'Interested' };
const STATUS_COLORS = { Interested: 'text-blue-400 bg-blue-400/10', Negotiating: 'text-yellow-400 bg-yellow-400/10', Confirmed: 'text-green-400 bg-green-400/10' };

function BuyerForm({ form, setForm, onSubmit, onClose, title, saving }) {
  return (
    <Modal isOpen={true} onClose={onClose} title={title}>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="Buyer Name *" value={form.buyerName} onChange={e => setForm({...form, buyerName: e.target.value})} required />
        <Input label="Company Name" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
        <Input label="Email *" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <Input label="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
        <Input label="Country *" value={form.country} onChange={e => setForm({...form, country: e.target.value})} required />
        <Input label="Product Interested" value={form.productInterested} onChange={e => setForm({...form, productInterested: e.target.value})} placeholder="e.g. Mango, Spices" />
        <div>
          <label className="text-sm text-[#a8b2d8] font-medium block mb-1">Status</label>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
            {['Interested', 'Negotiating', 'Confirmed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <Input label="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={saving}>Save Buyer</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [form, setForm] = useState(emptyBuyer);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef();

  const fetchBuyers = useCallback(() => {
    api.get('/exporter/buyers').then(r => setBuyers(r.data?.data || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBuyers(); }, [fetchBuyers]);
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addBuyer = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/exporter/buyers', form);
      setToast({ message: 'Buyer added!', type: 'success' });
      setAddModal(false); setForm(emptyBuyer); fetchBuyers();
    } catch(e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Failed to add buyer';
      setToast({ message: msg, type: 'error' });
    }
    setSaving(false);
  };

  const updateBuyer = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/exporter/buyers/${editModal._id}`, form);
      setToast({ message: 'Buyer updated!', type: 'success' });
      setEditModal(false); setForm(emptyBuyer); fetchBuyers();
    } catch { setToast({ message: 'Failed to update buyer', type: 'error' }); }
    setSaving(false);
  };

  const deleteBuyer = async (id) => {
    if (!confirm('Delete this buyer?')) return;
    try {
      await api.delete(`/exporter/buyers/${id}`);
      setToast({ message: 'Buyer deleted', type: 'success' });
      setMenuOpen(null); fetchBuyers();
    } catch { setToast({ message: 'Failed to delete', type: 'error' }); }
  };

  const openEdit = (b) => { setForm({ ...b }); setEditModal(b); setMenuOpen(null); };

  if (loading) return <LoadingSpinner />;

  const closeModals = () => { setAddModal(false); setEditModal(false); };

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Buyers</h1>
        <Button onClick={() => { setForm(emptyBuyer); setAddModal(true); }}>+ Add Buyer</Button>
      </div>

      {buyers.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-[#a8b2d8]">No buyers yet. Add your first buyer!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyers.map(b => (
            <Card key={b._id} className="relative cursor-pointer hover:border-[#6366f1]/50 transition-all" onClick={() => setSelectedBuyer(b)}>
              {/* Header row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {(b.buyerName || 'B')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{b.buyerName}</p>
                  {b.companyName && <p className="text-[#6366f1] text-xs truncate">{b.companyName}</p>}
                </div>
                {/* 3-dot menu */}
                <div className="relative" ref={menuOpen === b._id ? menuRef : null}>
                  <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === b._id ? null : b._id); }}
                    className="text-[#a8b2d8] hover:text-white px-2 py-1 rounded text-lg leading-none">⋮</button>
                  {menuOpen === b._id && (
                    <div className="absolute right-0 top-8 z-50 bg-[#16213e] border border-white/10 rounded-xl shadow-xl min-w-[160px] overflow-hidden">
                      {[
                        { label: '📦 Create Shipment', action: () => { setMenuOpen(null); navigate('/exporter/shipments/create', { state: { buyer: b } }); } },
                        { label: '✏️ Edit Buyer', action: () => openEdit(b) },
                        { label: '🗑️ Delete Buyer', action: () => deleteBuyer(b._id), danger: true },
                      ].map(item => (
                        <button key={item.label} onClick={e => { e.stopPropagation(); item.action(); }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-all ${item.danger ? 'text-red-400' : 'text-white'}`}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 text-xs mb-3">
                {b.email && <p className="text-[#a8b2d8]">✉️ {b.email}</p>}
                {b.phone && <p className="text-[#a8b2d8]">📞 {b.phone}</p>}
                {b.country && <p className="text-[#a8b2d8]">🌍 {b.country}</p>}
                {b.productInterested && <p className="text-[#a8b2d8]">🛒 {b.productInterested}</p>}
              </div>

              {/* Status badge */}
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[b.status] || STATUS_COLORS.Interested}`}>
                {b.status || 'Interested'}
              </span>
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
              <p className="text-white font-bold text-base">{selectedBuyer.buyerName}</p>
              {selectedBuyer.companyName && <p className="text-[#6366f1] text-sm">{selectedBuyer.companyName}</p>}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[selectedBuyer.status] || STATUS_COLORS.Interested}`}>
                {selectedBuyer.status || 'Interested'}
              </span>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            {[
              { label: 'Email', value: selectedBuyer.email },
              { label: 'Phone', value: selectedBuyer.phone },
              { label: 'Country', value: selectedBuyer.country },
              { label: 'Product Interested', value: selectedBuyer.productInterested },
              { label: 'Address', value: selectedBuyer.address },
            ].filter(r => r.value).map(row => (
              <div key={row.label} className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#a8b2d8] text-sm">{row.label}</span>
                <span className="text-white text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => { setSelectedBuyer(null); navigate('/exporter/shipments/create', { state: { buyer: selectedBuyer } }); }}>
              📦 Create Shipment
            </Button>
            <Button variant="secondary" onClick={() => { openEdit(selectedBuyer); setSelectedBuyer(null); }}>✏️ Edit Buyer</Button>
            <Button variant="secondary" onClick={() => setSelectedBuyer(null)}>Close</Button>
          </div>
        </Modal>
      )}

      {addModal && <BuyerForm form={form} setForm={setForm} onSubmit={addBuyer} onClose={closeModals} title="Add New Buyer" saving={saving} />}
      {editModal && <BuyerForm form={form} setForm={setForm} onSubmit={updateBuyer} onClose={closeModals} title="Edit Buyer" saving={saving} />}
    </div>
  );
}
