import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

export default function CustomsClearancePage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: 'Under Review', notes: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchShipments = useCallback(() => {
    api.get('/cha/shipments').then(r => setShipments(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchShipments(); }, [fetchShipments]);

  const updateStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/cha/shipments/${selected._id}/status`, statusForm);
      setToast({ message: 'Status updated!', type: 'success' });
      setSelected(null); fetchShipments();
    } catch { setToast({ message: 'Failed to update', type: 'error' }); }
    setSaving(false);
  };

  const verify = async (id) => {
    try {
      await api.post(`/cha/shipments/${id}/verify`);
      setToast({ message: 'Shipping bill verified!', type: 'success' }); fetchShipments();
    } catch { setToast({ message: 'Verification failed', type: 'error' }); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Customs Clearance</h1>
      {shipments.length === 0 ? (
        <Card className="text-center py-12"><div className="text-4xl mb-3">🛡️</div><p className="text-[#a8b2d8]">No assigned shipments.</p></Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {['Shipment #', 'Exporter', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[#a8b2d8] text-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shipments.map(s => (
                  <tr key={s._id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white font-mono text-sm">{s.shipmentNumber}</td>
                    <td className="px-4 py-3 text-[#a8b2d8]">{s.exporterName || s.exporter?.companyName || '-'}</td>
                    <td className="px-4 py-3"><Badge status={s.customsStatus || s.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="secondary" className="text-xs py-1 px-3" onClick={() => { setSelected(s); setStatusForm({ status: s.customsStatus || 'Under Review', notes: '' }); }}>Update Status</Button>
                        <Button variant="secondary" className="text-xs py-1 px-3" onClick={() => verify(s._id)}>Verify Bill</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Update Customs Status">
        <form onSubmit={updateStatus} className="space-y-4">
          <div>
            <label className="text-[#a8b2d8] text-sm block mb-1">Status</label>
            <select value={statusForm.status} onChange={e => setStatusForm({...statusForm, status: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-[#e94560]">
              <option value="Under Review" className="bg-[#16213e] text-white">Under Review</option>
              <option value="Cleared" className="bg-[#16213e] text-white">Cleared</option>
              <option value="Rejected" className="bg-[#16213e] text-white">Rejected</option>
            </select>
          </div>
          <div>
            <label className="text-[#a8b2d8] text-sm block mb-1">Notes</label>
            <textarea value={statusForm.notes} onChange={e => setStatusForm({...statusForm, notes: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white w-full h-24 focus:outline-none focus:border-[#e94560] resize-none" />
          </div>
          <div className="flex gap-3">
            <Button type="submit" loading={saving}>Update</Button>
            <Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
