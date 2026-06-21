import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Profile from '../../components/Profile';
import ShipmentsListPage from './shipments/ShipmentsListPage';
import CreateShipmentPage from './shipments/CreateShipmentPage';
import PreShipmentPage from './PreShipmentPage';
import PostShipmentPage from './PostShipmentPage';
import BuyersPage from './BuyersPage';
import api from '../../api/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const links = [
  { label: 'Dashboard', path: '/exporter/dashboard', icon: '🏠' },
  { label: 'All Shipments', path: '/exporter/shipments', icon: '📦' },
  { label: 'Create Shipment', path: '/exporter/shipments/create', icon: '➕' },
  { label: 'Pre-Shipment', path: '/exporter/pre-shipment', icon: '📋' },
  { label: 'Post-Shipment', path: '/exporter/post-shipment', icon: '📮' },
  { label: 'Buyers', path: '/exporter/buyers', icon: '👥' },
  { label: 'Profile', path: '/exporter/profile', icon: '👤' },
];

function ExporterHome() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
      <h1 className="text-2xl font-bold text-white">Welcome, {user.companyName || user.email?.split('@')[0]}!</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-[#a8b2d8] text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>
      )}
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
        <Route path="/profile" element={<Profile role="exporter" />} />
      </Routes>
    </DashboardLayout>
  );
}
