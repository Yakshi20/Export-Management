import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

export default function ForwarderBookingPage() {
  const [forwarders, setForwarders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookModal, setBookModal] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchForwarders = useCallback(() => {
    api.get('/exporter/forwarder-directory').then(r => setForwarders(r.data?.data || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fetchShipments = useCallback(() => {
    api.get('/exporter/shipments').then(r => setShipments(r.data?.data || r.data || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchForwarders(); fetchShipments(); }, [fetchForwarders, fetchShipments]);

  const bookForShipment = async (shipmentId) => {
    try {
      await api.put(`/exporter/shipments/${shipmentId}`, { assignedForwarderId: bookModal._id });
      setToast({ message: 'Freight forwarder booked for shipment!', type: 'success' });
      setBookModal(null); fetchShipments();
    } catch (e) {
      setToast({ message: e?.response?.data?.message || 'Failed to book forwarder', type: 'error' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-white">Book a Freight Forwarder</h1>
        <p className="text-[#a8b2d8] text-sm mt-1">Browse registered freight forwarders and book one to handle logistics for your shipment.</p>
      </div>

      {forwarders.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">🚚</div>
          <p className="text-[#a8b2d8]">No freight forwarders are registered on the platform yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forwarders.map(f => (
            <Card key={f._id} className="hover:border-[#6366f1]/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {(f.email || 'F')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{f.email?.split('@')[0]}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs mb-4">
                {f.mtoLicenseNumber && <p className="text-[#a8b2d8]">🪪 MTO License: {f.mtoLicenseNumber}</p>}
                {f.mobile && <p className="text-[#a8b2d8]">📞 {f.mobile}</p>}
                {f.email && <p className="text-[#a8b2d8]">✉️ {f.email}</p>}
              </div>

              <Button className="w-full" onClick={() => setBookModal(f)}>📌 Book for Shipment</Button>
            </Card>
          ))}
        </div>
      )}

      {bookModal && (
        <Modal isOpen={!!bookModal} onClose={() => setBookModal(null)} title={`Book ${bookModal.email?.split('@')[0]} for Shipment`}>
          {shipments.length === 0 ? (
            <p className="text-[#a8b2d8] text-sm text-center py-6">No shipments available. Create a shipment first.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {shipments.map(s => (
                <button key={s._id} onClick={() => bookForShipment(s._id)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">{s.productName}</p>
                      <p className="text-[#a8b2d8] text-xs">#{s.shipmentNumber}</p>
                    </div>
                    <span className="text-xs text-[#a8b2d8]">{s.status || 'Created'}</span>
                  </div>
                  {(s.assignedForwarderId?._id || s.assignedForwarderId) === bookModal._id && (
                    <span className="text-xs text-green-400">✓ Already booked</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
