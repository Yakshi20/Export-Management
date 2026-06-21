import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Profile from '../../components/Profile';
import { Routes, Route } from 'react-router-dom';

const links = [
  { label: 'Dashboard', path: '/beginner/dashboard', icon: '🏠' },
  { label: 'Profile', path: '/beginner/profile', icon: '👤' },
];

function BeginnerHome() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome, {user.name || user.email?.split('@')[0] || 'Beginner'}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-lg font-semibold text-white mb-2">Start Your Export Journey</h3>
          <p className="text-[#a8b2d8] text-sm">Learn about exporting, connect with advisers, and get expert guidance.</p>
        </Card>
        <Card>
          <div className="text-4xl mb-3">💡</div>
          <h3 className="text-lg font-semibold text-white mb-2">Get Expert Advice</h3>
          <p className="text-[#a8b2d8] text-sm">Connect with export advisers who can help you navigate global trade.</p>
        </Card>
      </div>
    </div>
  );
}

export default function BeginnerDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route path="/" element={<BeginnerHome />} />
        <Route path="/profile" element={<Profile role="beginner" />} />
      </Routes>
    </DashboardLayout>
  );
}
