import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import ShipmentsListPage from './shipments/ShipmentsListPage';
import CreateShipmentPage from './shipments/CreateShipmentPage';
import PreShipmentPage from './PreShipmentPage';
import PostShipmentPage from './PostShipmentPage';
import BuyersPage from './BuyersPage';
import DocumentationPage from './DocumentationPage';
import api from '../../api/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const links = [
  { label: 'Docs', path: '/exporter/docs', icon: '🗂️', end: true },
  { label: 'Shipments', path: '/exporter/shipments', icon: '📦' },
  { label: 'Buyers', path: '/exporter/buyers', icon: '👥' },
];

function ExporterHome() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/exporter/shipments').then(r => setShipments(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Shipments', value: shipments.length, icon: '📦', color: 'text-blue-400' },
    { label: 'In Transit', value: shipments.filter(s => s.status === 'In Transit').length, icon: '✈️', color: 'text-yellow-400' },
    { label: 'Delivered', value: shipments.filter(s => s.status === 'Delivered').length, icon: '✅', color: 'text-green-400' },
    { label: 'Created', value: shipments.filter(s => s.status === 'Created').length, icon: '🆕', color: 'text-gray-400' },
  ];

  return (
    <div className="space-y-6">
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-[#a8b2d8] text-xs">{stat.label}</div>
            </Card>
          ))}
        </div>
      )}

      <p className="text-[#a8b2d8] text-xs font-semibold uppercase tracking-widest">Shipment Management</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => navigate('/exporter/pre-shipment')} className="text-left w-full">
          <Card className="flex items-center gap-4 hover:border-[#6366f1]/50 transition-all cursor-pointer">
            <span className="text-3xl">🚢</span>
            <div>
              <p className="text-white font-bold text-base">Pre-Shipment</p>
              <p className="text-[#a8b2d8] text-sm">Compliance check, documents, quotation</p>
            </div>
            <span className="ml-auto text-[#6366f1] text-2xl">›</span>
          </Card>
        </button>
        <button onClick={() => navigate('/exporter/post-shipment')} className="text-left w-full">
          <Card className="flex items-center gap-4 hover:border-[#6366f1]/50 transition-all cursor-pointer">
            <span className="text-3xl">📊</span>
            <div>
              <p className="text-white font-bold text-base">Post-Shipment</p>
              <p className="text-[#a8b2d8] text-sm">Track shipment, LC, currency rates</p>
            </div>
            <span className="ml-auto text-[#6366f1] text-2xl">›</span>
          </Card>
        </button>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.companyName || user?.name || user?.email?.split('@')[0] || 'User';
  const initial = name[0].toUpperCase();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <div className="bg-[#16213e] rounded-xl p-6 border border-white/10 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-3xl">
          {initial}
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg">{name}</p>
          <p className="text-[#a8b2d8] text-sm">{user?.email}</p>
          {user?.role && <p className="text-[#6366f1] text-xs mt-1 capitalize">{user.role}</p>}
        </div>
      </div>
      {user && (
        <div className="bg-[#16213e] rounded-xl p-5 border border-white/10 space-y-3">
          {Object.entries(user)
            .filter(([k]) => !['password', '__v', '_id', 'token', 'role'].includes(k))
            .map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#a8b2d8] text-sm capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-white text-sm font-medium">{String(v)}</span>
              </div>
            ))}
        </div>
      )}
      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-all"
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default function ExporterDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route path="/" element={<ExporterHome />} />
        <Route path="/shipments" element={<ShipmentsListPage />} />
        <Route path="/shipments/create" element={<CreateShipmentPage />} />
        <Route path="/pre-shipment" element={<PreShipmentPage />} />
        <Route path="/post-shipment" element={<PostShipmentPage />} />
        <Route path="/buyers" element={<BuyersPage />} />
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </DashboardLayout>
  );
}
