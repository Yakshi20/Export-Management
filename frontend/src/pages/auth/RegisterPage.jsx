import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

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

  const register = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await api.post(`/${role}/register`, { ...form, role });
      navigate(`/${role}/login`);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    setLoading(false);
  };

  const ic = "w-full border border-[#d0d5ee] rounded-xl px-4 py-2.5 text-[#1a1a2e] placeholder-[#9099c0] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-all bg-white text-sm";

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-[#1a1a2e]">Export<span className="text-[#6366f1]">Pro</span></Link>
          <p className="text-[#4a5280] text-sm mt-2">India's Export Management Platform</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-[#e0e4f0] p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 px-3 py-1 rounded-full text-sm font-semibold capitalize">{role}</span>
            <span className="text-[#4a5280] text-sm">Register</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Create account ✨</h2>
          <p className="text-[#4a5280] text-sm mb-6">Fill in your details to get started</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={register} className="space-y-4">
            {[['email','Email','email','your@email.com'],['mobile','Mobile','text','+91 9999999999'],['password','Password','password','••••••••'],['confirmPassword','Re-enter Password','password','••••••••']].map(([name,label,type,ph]) => (
              <div key={name}>
                <label className="text-sm font-medium text-[#1a1a2e] mb-1 block">{label}</label>
                <input type={type} value={form[name]||''} onChange={e => setForm({...form,[name]:e.target.value})} placeholder={ph} required className={ic} />
              </div>
            ))}
            {(roleFields[role]||[]).map(f => (
              <div key={f.name}>
                <label className="text-sm font-medium text-[#1a1a2e] mb-1 block">{f.label}</label>
                <input type={f.type||'text'} value={form[f.name]||''} onChange={e => setForm({...form,[f.name]:e.target.value})} required className={ic} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#6366f1] text-white font-bold rounded-xl hover:bg-[#5254cc] transition-all disabled:opacity-60 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-[#4a5280] text-sm mt-5">
            Already have an account? <Link to={`/${role}/login`} className="text-[#6366f1] font-semibold hover:underline">Login</Link>
          </p>
          <p className="text-center mt-3">
            <Link to="/" className="text-[#9099c0] text-sm hover:text-[#6366f1]">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
