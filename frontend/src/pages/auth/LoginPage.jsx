import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const { role } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/${role}/login`, { ...form, role });
      login(res.data.data.token, res.data.data.user);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-white">Export<span className="text-[#e94560]">Pro</span></Link>
        </div>
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#e94560]/20 text-[#e94560] border border-[#e94560]/30 px-3 py-1 rounded-full text-sm font-medium capitalize">{role}</span>
            <span className="text-[#a8b2d8] text-sm">Login</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-6">Welcome back</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" required />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
            <Button type="submit" loading={loading} className="w-full">Sign In</Button>
          </form>
          <p className="text-center text-[#a8b2d8] text-sm mt-4">
            Don't have an account? <Link to={`/${role}/register`} className="text-[#e94560] hover:underline">Register</Link>
          </p>
          <p className="text-center mt-2">
            <Link to="/" className="text-[#a8b2d8] text-sm hover:text-white">← Back to home</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
