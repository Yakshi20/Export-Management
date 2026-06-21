import { Navigate } from 'react-router-dom';
export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to={`/${role}/login`} replace />;
  return children;
}
