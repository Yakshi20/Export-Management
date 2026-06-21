import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Profile from '../../components/Profile';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const links = [
  { label: 'Dashboard', path: '/adviser/dashboard', icon: '🏠' },
  { label: 'Consultations', path: '/adviser/consultations', icon: '💬' },
  { label: 'Profile', path: '/adviser/profile', icon: '👤' },
];

const STATUS_COLORS = { Pending: 'text-yellow-400 bg-yellow-400/10', Confirmed: 'text-blue-400 bg-blue-400/10', Completed: 'text-green-400 bg-green-400/10', Cancelled: 'text-red-400 bg-red-400/10' };

function ConsultationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/adviser/consultations').then(r => setItems(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const update = async (id, status, scheduledAt) => {
    setUpdating(id);
    try {
      await api.put(`/adviser/consultations/${id}/status`, { status, scheduledAt });
      setToast({ message: `Marked as ${status}`, type: 'success' });
      load();
    } catch { setToast({ message: 'Update failed', type: 'error' }); }
    setUpdating(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Consultation Requests</h1>
      {items.length === 0
        ? <Card className="text-center py-12"><div className="text-4xl mb-3">💬</div><p className="text-[#a8b2d8]">No consultation requests yet.</p></Card>
        : <div className="space-y-4">
            {items.map(c => (
              <Card key={c._id}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{c.topic}</h3>
                    <p className="text-[#a8b2d8] text-sm mt-0.5">From: {c.requesterId?.email || 'Unknown'} ({c.requesterRole})</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                </div>
                <p className="text-[#a8b2d8] text-sm mb-4">{c.description}</p>
                {c.scheduledAt && <p className="text-[#a8b2d8] text-xs mb-3">📅 Scheduled: {new Date(c.scheduledAt).toLocaleString()}</p>}
                {c.status === 'Pending' && (
                  <div className="flex gap-2">
                    <Button loading={updating === c._id} onClick={() => update(c._id, 'Confirmed')} className="text-xs px-3 py-1.5">Confirm</Button>
                    <Button variant="danger" loading={updating === c._id} onClick={() => update(c._id, 'Cancelled')} className="text-xs px-3 py-1.5">Cancel</Button>
                  </div>
                )}
                {c.status === 'Confirmed' && (
                  <Button loading={updating === c._id} onClick={() => update(c._id, 'Completed')} className="text-xs px-3 py-1.5">Mark Complete</Button>
                )}
              </Card>
            ))}
          </div>
      }
    </div>
  );
}

function AdviserHome() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Adviser Dashboard</h1>
      <p className="text-[#a8b2d8]">Welcome, <span className="text-white">{user?.name || user?.email?.split('@')[0]}</span></p>
      {user?.specialization && <p className="text-[#e94560] font-medium">Specialization: {user.specialization}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card><div className="text-4xl mb-3">⭐</div><h3 className="text-white font-semibold mb-1">Expert Guidance</h3><p className="text-[#a8b2d8] text-sm">Help beginners and exporters navigate global trade.</p></Card>
        <Card><div className="text-4xl mb-3">💬</div><h3 className="text-white font-semibold mb-1">Consultation Requests</h3><p className="text-[#a8b2d8] text-sm">Review and respond to consultation bookings.</p></Card>
      </div>
    </div>
  );
}

export default function AdviserDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route path="dashboard" element={<AdviserHome />} />
        <Route path="consultations" element={<ConsultationsPage />} />
        <Route path="profile" element={<Profile role="adviser" />} />
        <Route path="*" element={<Navigate to="/adviser/dashboard" />} />
      </Routes>
    </DashboardLayout>
  );
}
