import ChatPage from '../chat/ChatPage';
import ThemeToggle from '../../components/ui/ThemeToggle';
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
  { label: 'Home', path: '/exporter/dashboard', icon: '🏠', end: true },
  { label: 'Docs', path: '/exporter/docs', icon: '🗂️' },
  { label: 'Shipments', path: '/exporter/shipments', icon: '📦' },
  { label: 'Buyers', path: '/exporter/buyers', icon: '👥' },
  { label: 'Chat', path: '/exporter/chat', icon: '💬' },
];

function ExporterHome() {
  const [shipments, setShipments] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try { const r = await api.get('/exporter/shipments'); setShipments(r.data?.data || r.data || []); } catch {}
      try { const r = await api.get('/exporter/buyers'); setBuyers(r.data?.data || r.data || []); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const userDocs = JSON.parse(localStorage.getItem('userDocs') || '{}');
  const docStatuses = JSON.parse(localStorage.getItem('userDocStatuses') || '{}');
  const pendingDocs = Object.values(docStatuses).filter(s => s === '⏳ Pending' || s === '❌ Missing').length;
  const activeShipments = shipments.filter(s => !['Delivered'].includes(s.status)).length;
  const revenue = shipments.reduce((sum, s) => sum + (s.shipmentValue || 0), 0);
  const revenueLabel = revenue >= 1000 ? `$${(revenue / 1000).toFixed(1)}K` : `$${revenue}`;

  const stats = [
    { label: 'Total Buyers', value: buyers.length, icon: '👥', color: 'text-purple-400', path: '/exporter/buyers' },
    { label: 'Active Shipments', value: activeShipments, icon: '🚢', color: 'text-yellow-400', path: '/exporter/shipments' },
    { label: 'Revenue (USD)', value: revenueLabel, icon: '💰', color: 'text-green-400', path: '/exporter/shipments' },
    { label: 'Pending Docs', value: pendingDocs, icon: '📋', color: pendingDocs > 0 ? 'text-red-400' : 'text-gray-400', path: '/exporter/docs' },
  ];

  const alerts = [
    pendingDocs > 0 && { type: 'warn', msg: `${pendingDocs} document(s) pending or missing` },
    !userDocs.iec && { type: 'warn', msg: 'IEC Code not added — required for all exports' },
    buyers.length === 0 && { type: 'info', msg: 'No buyers added yet — start by adding a buyer' },
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      {loading ? <LoadingSpinner /> : (<>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(stat => (
            <button key={stat.label} onClick={() => navigate(stat.path)} className="text-left">
              <Card className="text-center hover:border-[#6366f1]/50 transition-all cursor-pointer">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-[#a8b2d8] text-xs">{stat.label}</div>
              </Card>
            </button>
          ))}
        </div>

        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${a.type === 'warn' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-400/20' : 'bg-blue-500/10 text-blue-400 border border-blue-400/20'}`}>
                {a.type === 'warn' ? '⚠️' : 'ℹ️'} {a.msg}
              </div>
            ))}
          </div>
        )}
      </>)}

      <p className="text-[#a8b2d8] text-xs font-semibold uppercase tracking-widest">Quick Actions</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: '🚢', title: 'Pre-Shipment', sub: 'Compliance, documents, quotation', path: '/exporter/pre-shipment' },
          { icon: '📊', title: 'Post-Shipment', sub: 'Track shipment, LC, currency rates', path: '/exporter/post-shipment' },
          { icon: '👥', title: 'Add Buyer', sub: 'Manage your buyer relationships', path: '/exporter/buyers' },
          { icon: '📦', title: 'Create Shipment', sub: 'Start a new export shipment', path: '/exporter/shipments/create' },
          { icon: '📑', title: 'CHA', sub: 'Manage customs house agents', path: '/cha-agents' },
        ].map(item => (
          <button key={item.title} onClick={() => navigate(item.path)} className="text-left w-full">
            <Card className="flex items-center gap-4 hover:border-[#6366f1]/50 transition-all cursor-pointer">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-white font-bold text-sm">{item.title}</p>
                <p className="text-[#a8b2d8] text-xs">{item.sub}</p>
              </div>
              <span className="ml-auto text-[#6366f1] text-xl">›</span>
            </Card>
          </button>
        ))}
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
      <div className="space-y-3"><p className="text-[#a8b2d8] text-xs font-semibold uppercase tracking-widest">Appearance</p><ThemeToggle /></div>
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
        <Route index element={<ExporterHome />} />
        <Route path="dashboard" element={<ExporterHome />} />
        <Route path="/shipments" element={<ShipmentsListPage />} />
        <Route path="/shipments/create" element={<CreateShipmentPage />} />
        <Route path="/pre-shipment" element={<PreShipmentPage />} />
        <Route path="/post-shipment" element={<PostShipmentPage />} />
        <Route path="/buyers" element={<BuyersPage />} />
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatPage userRole="exporter" />} />
      </Routes>
    </DashboardLayout>
  );
}
