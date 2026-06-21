import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Profile from '../../components/Profile';
import ForwarderShipmentsPage from './ForwarderShipmentsPage';
import Card from '../../components/ui/Card';

const links = [
  { label: 'Dashboard', path: '/forwarder/dashboard', icon: '🏠' },
  { label: 'Shipments', path: '/forwarder/shipments', icon: '🚚' },
  { label: 'Profile', path: '/forwarder/profile', icon: '👤' },
];

function ForwarderHome() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome, {user.name || user.email?.split('@')[0]}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card><div className="text-4xl mb-3">🚚</div><h3 className="text-lg font-semibold text-white mb-2">Manage Shipments</h3><p className="text-[#a8b2d8] text-sm">Update locations and statuses for assigned shipments.</p></Card>
        <Card><div className="text-4xl mb-3">📍</div><h3 className="text-lg font-semibold text-white mb-2">Track Locations</h3><p className="text-[#a8b2d8] text-sm">Keep exporters informed with real-time location updates.</p></Card>
      </div>
    </div>
  );
}

export default function ForwarderDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route path="/" element={<ForwarderHome />} />
        <Route path="/shipments" element={<ForwarderShipmentsPage />} />
        <Route path="/profile" element={<Profile role="forwarder" />} />
      </Routes>
    </DashboardLayout>
  );
}
