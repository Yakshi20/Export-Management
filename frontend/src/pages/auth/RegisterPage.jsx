import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const roleFields = {
  exporter: [{ name: 'companyName', label: 'Company Name' }, { name: 'iecCode', label: 'IEC Code' }, { name: 'gstNumber', label: 'GST Number' }],
  farmer: [{ name: 'farmerName', label: 'Farmer Name' }, { name: 'farmLocation', label: 'Farm Location' }, { name: 'farmSize', label: 'Farm Size' }, { name: 'cropType', label: 'Crop Type' }, { name: 'aadhaarNumber', label: 'Aadhaar Number' }],
  cha: [{ name: 'customBrokerLicense', label: 'Custom Broker License' }, { name: 'portCode', label: 'Port Code' }],
  forwarder: [{ name: 'mtoLicenseNumber', label: 'MTO License Number' }],
  adviser: [{ name: 'name', label: 'Full Name' }, { name: 'specialization', label: 'Specialization' }, { name: 'yearsOfExperience', label: 'Years of Experience', type: 'number' }],
  beginner: [],
};

export default function RegisterPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', mobile: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP flow commented out — using direct registration instead
  // const sendOtp = async (e) => { ... api.post(`/${role}/send-otp`) ... }
  // const verifyOtp = async (e) => { ... api.post(`/${role}/verify-otp`) ... }

  const register = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await api.post(`/${role}/register`, form);
      navigate(`/${role}/login`);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    setLoading(false);
  };

  const extraFields = roleFields[role] || [];

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-white">Export<span className="text-[#e94560]">Pro</span></Link>
        </div>
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#e94560]/20 text-[#e94560] border border-[#e94560]/30 px-3 py-1 rounded-full text-sm font-medium capitalize">{role}</span>
            <span className="text-[#a8b2d8] text-sm">Register</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Create your account</h2>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={register} className="space-y-4">
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" required />
            <Input label="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="+91 9999999999" required />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <Input label="Re-enter Password" type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required />
            {extraFields.map(f => (
              <Input key={f.name} label={f.label} type={f.type || 'text'} value={form[f.name] || ''} onChange={e => setForm({...form, [f.name]: e.target.value})} required />
            ))}
            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>
          <p className="text-center text-[#a8b2d8] text-sm mt-4">
            Already have an account? <Link to={`/${role}/login`} className="text-[#e94560] hover:underline">Login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
