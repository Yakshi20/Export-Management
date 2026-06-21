import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Profile from '../../components/Profile';
import ConsultationsPage from './ConsultationsPage';
import Card from '../../components/ui/Card';

const links = [
  { label: 'Dashboard', path: '/adviser/dashboard', icon: '🏠' },
  { label: 'Consultations', path: '/adviser/consultations', icon: '⭐' },
  { label: 'Profile', path: '/adviser/profile', icon: '👤' },
];

function AdviserHome() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome, {user.name || user.email?.split('@')[0]}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card><div className="text-4xl mb-3">⭐</div><h3 className="text-lg font-semibold text-white mb-2">Consultations</h3><p className="text-[#a8b2d8] text-sm">Manage consultation requests from beginners seeking guidance.</p></Card>
        <Card><div className="text-4xl mb-3">📚</div><h3 className="text-lg font-semibold text-white mb-2">Share Expertise</h3><p className="text-[#a8b2d8] text-sm">Help beginners navigate the complexities of international trade.</p></Card>
      </div>
    </div>
  );
}

export default function AdviserDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route path="/" element={<AdviserHome />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
        <Route path="/profile" element={<Profile role="adviser" />} />
      </Routes>
    </DashboardLayout>
  );
}
