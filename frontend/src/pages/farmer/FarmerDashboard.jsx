import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Profile from '../../components/Profile';
import ProductsPage from './ProductsPage';
import Card from '../../components/ui/Card';

const links = [
  { label: 'Dashboard', path: '/farmer/dashboard', icon: '🏠' },
  { label: 'Products', path: '/farmer/products', icon: '🌱' },
  { label: 'Profile', path: '/farmer/profile', icon: '👤' },
];

function FarmerHome() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome, {user.farmerName || user.email?.split('@')[0]}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-4xl mb-3">🌱</div>
          <h3 className="text-lg font-semibold text-white mb-2">Manage Products</h3>
          <p className="text-[#a8b2d8] text-sm">List your agricultural products for export buyers.</p>
        </Card>
        <Card>
          <div className="text-4xl mb-3">💰</div>
          <h3 className="text-lg font-semibold text-white mb-2">Set Your Price</h3>
          <p className="text-[#a8b2d8] text-sm">Set competitive prices and manage product availability.</p>
        </Card>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route path="/" element={<FarmerHome />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/profile" element={<Profile role="farmer" />} />
      </Routes>
    </DashboardLayout>
  );
}
