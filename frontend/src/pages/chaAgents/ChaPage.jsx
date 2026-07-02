import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

const PORTS = ['Mumbai Port', 'Chennai Port', 'Mangalore Port'];
const emptyCha = { chaName: '', licenseNumber: '', port: PORTS[0], phone: '', email: '', specialization: 'Sea', customsCharges: '' };
const SPEC_COLORS = { Air: 'text-blue-400 bg-blue-400/10', Sea: 'text-cyan-400 bg-cyan-400/10', Both: 'text-purple-400 bg-purple-400/10' };

export default function ChaPage() {
  const [chas, setChas] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCha, setSelectedCha] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [form, setForm] = useState(emptyCha);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const menuRef = useRef();

  const fetchChas = useCallback(() => {
    api.get('/exporter/cha-agents').then(r => setChas(r.data?.data || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fetchShipments = useCallback(() => {
    api.get('/exporter/shipments').then(r => setShipments(r.data?.data || r.data || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchChas(); fetchShipments(); }, [fetchChas, fetchShipments]);
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addCha = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/exporter/cha-agents', form);
      setToast({ message: 'CHA added!', type: 'success' });
      setAddModal(false); setForm(emptyCha); fetchChas();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Failed to add CHA';
      setToast({ message: msg, type: 'error' });
    }
    setSaving(false);
  };

  const updateCha = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/exporter/cha-agents/${editModal._id}`, form);
      setToast({ message: 'CHA updated!', type: 'success' });
      setEditModal(false); setForm(emptyCha); fetchChas();
    } catch { setToast({ message: 'Failed to update CHA', type: 'error' }); }
    setSaving(false);
  };

  const deleteCha = async (id) => {
    if (!confirm('Delete this CHA?')) return;
    try {
      await api.delete(`/exporter/cha-agents/${id}`);
      setToast({ message: 'CHA deleted', type: 'success' });
      setMenuOpen(null); fetchChas();
    } catch { setToast({ message: 'Failed to delete', type: 'error' }); }
  };

  const assignToShipment = async (shipmentId) => {
    try {
      await api.put(`/exporter/shipments/${shipmentId}`, { chaAgentId: assignModal._id });
      setToast({ message: 'CHA assigned to shipment!', type: 'success' });
      setAssignModal(null); fetchShipments();
    } catch (e) {
      setToast({ message: e?.response?.data?.message || 'Failed to assign', type: 'error' });
    }
  };

  const openEdit = (c) => { setForm({ ...c }); setEditModal(c); setMenuOpen(null); };

  const chaShipments = (cha) => shipments.filter(s => (s.chaAgentId?._id || s.chaAgentId) === cha._id);

  if (loading) return <LoadingSpinner />;

  const ChaForm = ({ onSubmit, title }) => (
    <Modal isOpen={true} onClose={() => { setAddModal(false); setEditModal(false); }} title={title}>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="CHA Name *" value={form.chaName} onChange={e => setForm({ ...form, chaName: e.target.value })} required />
        <Input label="License Number *" value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} required />
        <div>
          <label className="text-sm text-[#a8b2d8] font-medium block mb-1">Port / Location *</label>
          <select value={form.port} onChange={e => setForm({ ...form, port: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
            {PORTS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <Input label="Contact Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
        <Input label="Contact Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <div>
          <label className="text-sm text-[#a8b2d8] font-medium block mb-1">Specialization</label>
          <select value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
            {['Air', 'Sea', 'Both'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <Input label="Customs Charges" value={form.customsCharges} onChange={e => setForm({ ...form, customsCharges: e.target.value })} placeholder="e.g. 2% of shipment value" />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={saving}>Save CHA</Button>
          <Button variant="secondary" onClick={() => { setAddModal(false); setEditModal(false); }}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">CHA (Customs House Agents)</h1>
        <Button onClick={() => { setForm(emptyCha); setAddModal(true); }}>+ Add CHA</Button>
      </div>

      {chas.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">📑</div>
          <p className="text-[#a8b2d8]">No CHAs yet. Add your first customs house agent!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chas.map(c => (
            <Card key={c._id} className="relative cursor-pointer hover:border-[#6366f1]/50 transition-all" onClick={() => setSelectedCha(c)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {(c.chaName || 'C')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{c.chaName}</p>
                  {c.port && <p className="text-[#6366f1] text-xs truncate">{c.port}</p>}
                </div>
                <div className="relative" ref={menuOpen === c._id ? menuRef : null}>
                  <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === c._id ? null : c._id); }}
                    className="text-[#a8b2d8] hover:text-white px-2 py-1 rounded text-lg leading-none">⋮</button>
                  {menuOpen === c._id && (
                    <div className="absolute right-0 top-8 z-50 bg-[#16213e] border border-white/10 rounded-xl shadow-xl min-w-[180px] overflow-hidden">
                      {[
                        { label: '📌 Assign to Shipment', action: () => { setMenuOpen(null); setAssignModal(c); } },
                        { label: '✏️ Edit', action: () => openEdit(c) },
                        { label: '🕐 View History', action: () => { setMenuOpen(null); setHistoryModal(c); } },
                        { label: '🗑️ Delete', action: () => deleteCha(c._id), danger: true },
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

              <div className="space-y-1 text-xs mb-3">
                {c.licenseNumber && <p className="text-[#a8b2d8]">🪪 License: {c.licenseNumber}</p>}
                {c.phone && <p className="text-[#a8b2d8]">📞 {c.phone}</p>}
                {c.email && <p className="text-[#a8b2d8]">✉️ {c.email}</p>}
                {c.customsCharges && <p className="text-[#a8b2d8]">💰 {c.customsCharges}</p>}
              </div>

              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${SPEC_COLORS[c.specialization] || SPEC_COLORS.Sea}`}>
                {c.specialization || 'Sea'}
              </span>
            </Card>
          ))}
        </div>
      )}

      {/* CHA Details Modal */}
      {selectedCha && (
        <Modal isOpen={!!selectedCha} onClose={() => setSelectedCha(null)} title="CHA Details">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-lg">
              {(selectedCha.chaName || 'C')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-base">{selectedCha.chaName}</p>
              {selectedCha.port && <p className="text-[#6366f1] text-sm">{selectedCha.port}</p>}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SPEC_COLORS[selectedCha.specialization] || SPEC_COLORS.Sea}`}>
                {selectedCha.specialization || 'Sea'}
              </span>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            {[
              { label: 'License Number', value: selectedCha.licenseNumber },
              { label: 'Phone', value: selectedCha.phone },
              { label: 'Email', value: selectedCha.email },
              { label: 'Customs Charges', value: selectedCha.customsCharges },
            ].filter(r => r.value).map(row => (
              <div key={row.label} className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#a8b2d8] text-sm">{row.label}</span>
                <span className="text-white text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => { setSelectedCha(null); setAssignModal(selectedCha); }}>📌 Assign to Shipment</Button>
            <Button variant="secondary" onClick={() => { openEdit(selectedCha); setSelectedCha(null); }}>✏️ Edit CHA</Button>
            <Button variant="secondary" onClick={() => setSelectedCha(null)}>Close</Button>
          </div>
        </Modal>
      )}

      {/* Assign to Shipment Modal */}
      {assignModal && (
        <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title={`Assign ${assignModal.chaName} to Shipment`}>
          {shipments.length === 0 ? (
            <p className="text-[#a8b2d8] text-sm text-center py-6">No shipments available. Create a shipment first.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {shipments.map(s => (
                <button key={s._id} onClick={() => assignToShipment(s._id)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">{s.productName}</p>
                      <p className="text-[#a8b2d8] text-xs">#{s.shipmentNumber}</p>
                    </div>
                    <span className="text-xs text-[#a8b2d8]">{s.status || 'Created'}</span>
                  </div>
                  {(s.chaAgentId?._id || s.chaAgentId) === assignModal._id && (
                    <span className="text-xs text-green-400">✓ Already assigned</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* History Modal */}
      {historyModal && (
        <Modal isOpen={!!historyModal} onClose={() => setHistoryModal(null)} title={`${historyModal.chaName} — Shipment History`}>
          {chaShipments(historyModal).length === 0 ? (
            <p className="text-[#a8b2d8] text-sm text-center py-6">No shipments assigned to this CHA yet.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chaShipments(historyModal).map(s => (
                <div key={s._id} className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">{s.productName}</p>
                      <p className="text-[#a8b2d8] text-xs">#{s.shipmentNumber}</p>
                    </div>
                    <span className="text-xs text-[#a8b2d8]">{s.status || 'Created'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {addModal && <ChaForm onSubmit={addCha} title="Add New CHA" />}
      {editModal && <ChaForm onSubmit={updateCha} title="Edit CHA" />}
    </div>
  );
}
