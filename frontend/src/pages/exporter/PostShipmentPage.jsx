import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

export default function PostShipmentPage() {
  const [shipments, setShipments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [tracking, setTracking] = useState(null);
  const [rates, setRates] = useState(null);
  const [lcNumber, setLcNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/exporter/shipments').then(r => setShipments(r.data || [])).catch(() => {});
    api.get('/exporter/currency-rates').then(r => setRates(r.data)).catch(() => {});
  }, []);

  const loadTracking = async (id) => {
    setSelectedId(id); setTracking(null);
    if (!id) return;
    try {
      const res = await api.get(`/exporter/shipments/${id}/tracking`);
      setTracking(res.data);
    } catch { setTracking({ status: 'Unknown', timeline: [] }); }
  };

  const saveLC = async () => {
    setLoading(true);
    try {
      await api.post(`/exporter/shipments/${selectedId}/lc`, { lcNumber });
      setToast({ message: 'LC saved!', type: 'success' });
    } catch { setToast({ message: 'Failed to save LC', type: 'error' }); }
    setLoading(false);
  };

  const selected = shipments.find(s => s._id === selectedId);

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Post-Shipment</h1>

      <Card>
        <label className="text-[#a8b2d8] text-sm font-medium block mb-2">Select Shipment</label>
        <select value={selectedId} onChange={e => loadTracking(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#e94560] w-full max-w-sm">
          <option value="" className="bg-[#16213e] text-white">-- Select Shipment --</option>
          {shipments.map(s => <option key={s._id} value={s._id} className="bg-[#16213e] text-white">{s.shipmentNumber} - {s.productName}</option>)}
        </select>
      </Card>

      {selectedId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">📍 Track Shipment</h2>
            {!tracking ? <LoadingSpinner /> : (
              <div className="space-y-3">
                <div><span className="text-[#a8b2d8] text-sm">Status: </span><span className="text-white font-medium">{tracking.status}</span></div>
                {tracking.currentLocation && <div><span className="text-[#a8b2d8] text-sm">Location: </span><span className="text-white">{tracking.currentLocation}</span></div>}
                {tracking.eta && <div><span className="text-[#a8b2d8] text-sm">ETA: </span><span className="text-white">{new Date(tracking.eta).toLocaleDateString()}</span></div>}
                {tracking.timeline?.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {tracking.timeline.map((t, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-[#e94560] mt-1" />
                          {i < tracking.timeline.length - 1 && <div className="w-px h-8 bg-white/10 mt-1" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{t.status}</p>
                          <p className="text-[#a8b2d8] text-xs">{t.location} {t.date && `· ${new Date(t.date).toLocaleDateString()}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">💳 Letter of Credit</h2>
            <div className="space-y-3">
              <Input label="LC Number" value={lcNumber} onChange={e => setLcNumber(e.target.value)} placeholder="LC number" />
              <Button onClick={saveLC} loading={loading}>Save LC Number</Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">💱 Currency Exchange</h2>
            {rates ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-[#a8b2d8] text-xs mb-1">USD/INR</div>
                  <div className="text-2xl font-bold text-green-400">{rates.USD || '83.25'}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-[#a8b2d8] text-xs mb-1">EUR/INR</div>
                  <div className="text-2xl font-bold text-blue-400">{rates.EUR || '89.50'}</div>
                </div>
              </div>
            ) : <p className="text-[#a8b2d8]">Loading rates...</p>}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">👤 Buyer Details</h2>
            {selected?.buyer ? (
              <div className="space-y-2">
                {Object.entries(selected.buyer).map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="text-[#a8b2d8] text-sm capitalize w-32">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-white text-sm">{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-[#a8b2d8]">No buyer info for this shipment.</p>}
          </Card>
        </div>
      )}
    </div>
  );
}
