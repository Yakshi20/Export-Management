import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BeginnerDashboard from './pages/beginner/BeginnerDashboard';
import ExporterDashboard from './pages/exporter/ExporterDashboard';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import CHADashboard from './pages/cha/CHADashboard';
import ForwarderDashboard from './pages/forwarder/ForwarderDashboard';
import AdviserDashboard from './pages/adviser/AdviserDashboard';
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:role/login" element={<LoginPage />} />
          <Route path="/:role/register" element={<RegisterPage />} />
          <Route path="/beginner/*" element={<ProtectedRoute role="beginner"><BeginnerDashboard /></ProtectedRoute>} />
          <Route path="/exporter/*" element={<ProtectedRoute role="exporter"><ExporterDashboard /></ProtectedRoute>} />
          <Route path="/farmer/*" element={<ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/cha/*" element={<ProtectedRoute role="cha"><CHADashboard /></ProtectedRoute>} />
          <Route path="/forwarder/*" element={<ProtectedRoute role="forwarder"><ForwarderDashboard /></ProtectedRoute>} />
          <Route path="/adviser/*" element={<ProtectedRoute role="adviser"><AdviserDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
