import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/axios';

export default function LoginPage() {
  const { role } = useParams();
  const { login } = useAuth();
  const { applyUserTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post(`/${role}/login`, { ...form, role });
      login(res.data.data.token, res.data.data.user);
      applyUserTheme(form.email);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-[#1a1a2e]">Export<span className="text-[#6366f1]">Pro</span></Link>
          <p className="text-[#4a5280] text-sm mt-2">India's Export Management Platform</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-[#e0e4f0] p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 px-3 py-1 rounded-full text-sm font-semibold capitalize">{role}</span>
            <span className="text-[#4a5280] text-sm">Login</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Welcome back 👋</h1>
          <p className="text-[#4a5280] text-sm mb-6">Sign in to your account</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1a1a2e] mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com" required
                className="w-full border border-[#d0d5ee] rounded-xl px-4 py-2.5 text-[#1a1a2e] placeholder-[#9099c0] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all bg-white text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1a1a2e] mb-1 block">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required
                className="w-full border border-[#d0d5ee] rounded-xl px-4 py-2.5 text-[#1a1a2e] placeholder-[#9099c0] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all bg-white text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#6366f1] text-white font-bold rounded-xl hover:bg-[#5254cc] transition-all disabled:opacity-60 mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-[#4a5280] text-sm mt-5">
            Don't have an account? <Link to={`/${role}/register`} className="text-[#6366f1] font-semibold hover:underline">Register</Link>
          </p>
          <p className="text-center mt-3">
            <Link to="/" className="text-[#9099c0] text-sm hover:text-[#6366f1]">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
