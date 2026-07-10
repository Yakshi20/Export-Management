import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState(null);

  const fetchConsultations = useCallback(() => {
    api.get('/adviser/consultations').then(r => setConsultations(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchConsultations(); }, [fetchConsultations]);

  const update = async (id, data) => {
    setSaving(s => ({...s, [id]: true}));
    try {
      await api.put(`/adviser/consultations/${id}`, data);
      setToast({ message: 'Updated!', type: 'success' }); fetchConsultations();
    } catch { setToast({ message: 'Failed to update', type: 'error' }); }
    setSaving(s => ({...s, [id]: false}));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Consultations</h1>
      {consultations.length === 0 ? (
        <Card className="text-center py-12"><div className="text-4xl mb-3">⭐</div><p className="text-[#a8b2d8]">No consultation requests yet.</p></Card>
      ) : (
        <div className="space-y-4">
          {consultations.map(c => (
            <Card key={c._id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold">{c.beginnerName || c.name || 'Beginner'}</h3>
                  <p className="text-[#a8b2d8] text-sm">{c.email}</p>
                  {c.requestedDate && <p className="text-[#a8b2d8] text-xs mt-1">Requested: {new Date(c.requestedDate).toLocaleDateString()}</p>}
                  {c.scheduledDate && <p className="text-green-400 text-xs mt-1">Scheduled: {new Date(c.scheduledDate).toLocaleDateString()}</p>}
                  {c.message && <p className="text-[#a8b2d8] text-sm mt-2 max-w-md">{c.message}</p>}
                </div>
                <div className="flex flex-col sm:items-end gap-3">
                  <Badge status={c.status || 'Pending'} />
                  <div className="flex gap-2 flex-wrap">
                    <select
                      defaultValue={c.status || 'Pending'}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#e94560]"
                      onChange={e => update(c._id, { status: e.target.value })}
                    >
                      <option value="Pending" className="bg-[#16213e] text-white">Pending</option>
                      <option value="Confirmed" className="bg-[#16213e] text-white">Confirmed</option>
                      <option value="Completed" className="bg-[#16213e] text-white">Completed</option>
                      <option value="Cancelled" className="bg-[#16213e] text-white">Cancelled</option>
                    </select>
                    <input type="date" className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#e94560]"
                      onChange={e => update(c._id, { scheduledDate: e.target.value })} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
