import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Profile from '../../components/Profile';
import CustomsClearancePage from './CustomsClearancePage';
import AgentsPage from './AgentsPage';
import Card from '../../components/ui/Card';

const links = [
  { label: 'Dashboard', path: '/cha/dashboard', icon: '🏠' },
  { label: 'Customs Clearance', path: '/cha/customs', icon: '🛡️' },
  { label: 'Agents', path: '/cha/agents', icon: '📑' },
  { label: 'Profile', path: '/cha/profile', icon: '👤' },
];

function CHAHome() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome, {user.name || user.email?.split('@')[0]}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card><div className="text-4xl mb-3">🛡️</div><h3 className="text-lg font-semibold text-white mb-2">Customs Clearance</h3><p className="text-[#a8b2d8] text-sm">Manage assigned shipments for customs processing.</p></Card>
        <Card><div className="text-4xl mb-3">📋</div><h3 className="text-lg font-semibold text-white mb-2">Shipping Bills</h3><p className="text-[#a8b2d8] text-sm">Verify and process shipping bill documentation.</p></Card>
      </div>
    </div>
  );
}

export default function CHADashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route path="/" element={<CHAHome />} />
        <Route path="/customs" element={<CustomsClearancePage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/profile" element={<Profile role="cha" />} />
      </Routes>
    </DashboardLayout>
  );
}
