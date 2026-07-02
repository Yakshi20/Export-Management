import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ChaPage from './ChaPage';

const links = [
  { label: 'Dashboard', path: '/exporter/dashboard', icon: '🏠' },
  { label: 'CHA', path: '/cha-agents', icon: '📑', end: true },
];

export default function ChaAgentsDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route index element={<ChaPage />} />
      </Routes>
    </DashboardLayout>
  );
}
