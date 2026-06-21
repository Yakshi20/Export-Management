import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

export default function ForwarderShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ currentLocation: '', eta: '', status: 'In Transit' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchShipments = useCallback(() => {
    api.get('/forwarder/shipments').then(r => setShipments(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchShipments(); }, [fetchShipments]);

  const update = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/forwarder/shipments/${selected._id}/update`, form);
      setToast({ message: 'Shipment updated!', type: 'success' });
      setSelected(null); fetchShipments();
    } catch { setToast({ message: 'Failed to update', type: 'error' }); }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Assigned Shipments</h1>
      {shipments.length === 0 ? (
        <Card className="text-center py-12"><div className="text-4xl mb-3">🚚</div><p className="text-[#a8b2d8]">No assigned shipments.</p></Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {['Shipment #', 'Product', 'Destination', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[#a8b2d8] text-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shipments.map(s => (
                  <tr key={s._id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white font-mono text-sm">{s.shipmentNumber}</td>
                    <td className="px-4 py-3 text-white">{s.productName}</td>
                    <td className="px-4 py-3 text-[#a8b2d8]">{s.destinationCountry}</td>
                    <td className="px-4 py-3"><Badge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <Button variant="secondary" className="text-xs py-1 px-3" onClick={() => { setSelected(s); setForm({ currentLocation: s.currentLocation || '', eta: s.eta ? s.eta.split('T')[0] : '', status: s.status || 'In Transit' }); }}>
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Update Shipment">
        <form onSubmit={update} className="space-y-4">
          <Input label="Current Location" value={form.currentLocation} onChange={e => setForm({...form, currentLocation: e.target.value})} placeholder="Port/City name" />
          <Input label="ETA" type="date" value={form.eta} onChange={e => setForm({...form, eta: e.target.value})} />
          <div>
            <label className="text-[#a8b2d8] text-sm block mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-[#e94560]">
              <option value="In Transit" className="bg-[#16213e]">In Transit</option>
              <option value="Customs Clearance" className="bg-[#16213e]">Customs Clearance</option>
              <option value="Delivered" className="bg-[#16213e]">Delivered</option>
            </select>
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
