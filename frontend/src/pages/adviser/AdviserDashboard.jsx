import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import ChatPage from '../chat/ChatPage';
import api from '../../api/axios';

const links = [
  { label: 'Home', path: '/adviser/dashboard', icon: '🏠', end: true },
  { label: 'Bookings', path: '/adviser/bookings', icon: '📅' },
  { label: 'Services', path: '/adviser/services', icon: '💼' },
  { label: 'Earnings', path: '/adviser/earnings', icon: '💰' },
  { label: 'Docs', path: '/adviser/docs', icon: '📋' },
  { label: 'Chat', path: '/adviser/chat', icon: '💬' },
];

function AdviserHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.name || user.email?.split('@')[0] || 'Adviser';
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, earnings: 0 });

  useEffect(() => {
    api.get('/adviser/consultations').then(r => {
      const list = r.data?.data || r.data || [];
      setStats({
        total: list.length,
        pending: list.filter(c => c.status === 'Pending').length,
        completed: list.filter(c => c.status === 'Completed').length,
        earnings: list.filter(c => c.status === 'Completed').length * 500,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { icon: '📅', title: 'Bookings', sub: 'Manage consultation requests', path: '/adviser/bookings', badge: stats.pending > 0 ? stats.pending : null },
    { icon: '💼', title: 'Services', sub: 'Set your expertise & rates', path: '/adviser/services' },
    { icon: '💰', title: 'Earnings', sub: 'Track your consultation revenue', path: '/adviser/earnings' },
    { icon: '📋', title: 'Documents', sub: 'Verify client documents', path: '/adviser/docs' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hello, {name}! 👋</h1>
        <p className="text-[#a8b2d8] text-sm mt-1">Your expert consultation dashboard.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Bookings', value: stats.total, color: 'text-[#6366f1]' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
          { label: 'Completed', value: stats.completed, color: 'text-green-400' },
          { label: 'Earnings', value: `₹${stats.earnings}`, color: 'text-green-400' },
        ].map(s => (
          <Card key={s.label} className="text-center py-3">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[#a8b2d8] text-xs mt-1">{s.label}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(c => (
          <button key={c.title} onClick={() => navigate(c.path)} className="text-left w-full">
            <Card className="flex items-center gap-4 hover:border-[#6366f1]/50 transition-all cursor-pointer">
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{c.title}</p>
                <p className="text-[#a8b2d8] text-xs">{c.sub}</p>
              </div>
              {c.badge && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{c.badge}</span>}
              <span className="text-[#6366f1] text-xl">›</span>
            </Card>
          </button>
        ))}
      </div>
      <Card>
        <p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-3">Platform Commission Info</p>
        <div className="space-y-2 text-sm">
          {[
            ['Platform commission', '10% per consultation'],
            ['Your earnings', '90% of each booking fee'],
            ['Payment cycle', 'Weekly settlements'],
            ['Min. payout', '₹500'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[#a8b2d8]">{k}</span>
              <span className="text-white font-medium">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BookingsPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [saving, setSaving] = useState({});
  const [msg, setMsg] = useState(null);

  const fetch = () => {
    api.get('/adviser/consultations').then(r => {
      setConsultations(r.data?.data || r.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const update = async (id, data) => {
    setSaving(s => ({ ...s, [id]: true }));
    try {
      await api.put(`/adviser/consultations/${id}`, data);
      setMsg({ text: 'Updated!', type: 'success' });
      fetch();
    } catch { setMsg({ text: 'Failed to update', type: 'error' }); }
    setSaving(s => ({ ...s, [id]: false }));
    setTimeout(() => setMsg(null), 3000);
  };

  const filtered = filter === 'All' ? consultations : consultations.filter(c => c.status === filter);
  const STATUS_COLOR = { Pending: 'text-yellow-400 bg-yellow-400/10', Confirmed: 'text-blue-400 bg-blue-400/10', Completed: 'text-green-400 bg-green-400/10', Cancelled: 'text-red-400 bg-red-400/10' };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📅 Consultation Bookings</h1>
      {msg && <div className={`px-4 py-2 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{msg.text}</div>}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === s ? 'bg-[#6366f1] text-white' : 'bg-white/5 text-[#a8b2d8] hover:bg-white/10'}`}>{s}</button>
        ))}
      </div>
      {loading ? <p className="text-[#a8b2d8] text-sm">Loading...</p> : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-[#a8b2d8]">No bookings found.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => (
            <Card key={c._id}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-white font-bold text-sm">{c.beginnerName || c.name || 'Client'}</p>
                  <p className="text-[#a8b2d8] text-xs">{c.email}</p>
                  {c.topic && <p className="text-[#a8b2d8] text-xs mt-1">Topic: {c.topic}</p>}
                  {c.message && <p className="text-[#a8b2d8] text-sm mt-2">{c.message}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${STATUS_COLOR[c.status || 'Pending']}`}>{c.status || 'Pending'}</span>
              </div>
              <div className="flex gap-2 flex-wrap items-center border-t border-white/5 pt-3">
                <select
                  defaultValue={c.status || 'Pending'}
                  onChange={e => update(c._id, { status: e.target.value })}
                  disabled={saving[c._id]}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#6366f1]"
                >
                  {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => <option key={s} value={s} className="bg-[#16213e]">{s}</option>)}
                </select>
                <input type="date" onChange={e => update(c._id, { scheduledDate: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#6366f1]" />
                {c.scheduledDate && <span className="text-green-400 text-xs">📅 {new Date(c.scheduledDate).toLocaleDateString()}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ServicesPage() {
  const [rates, setRates] = useState({ chat: '500', video: '1500', document: '800', market: '1000', compliance: '1200', tax: '1500' });
  const [saved, setSaved] = useState(false);

  const services = [
    { key: 'chat', icon: '💬', title: 'Live Chat Consultation', desc: 'Text-based guidance for quick queries' },
    { key: 'video', icon: '📹', title: 'Video Call Session', desc: 'Face-to-face consultation via video' },
    { key: 'document', icon: '📄', title: 'Document Verification', desc: 'Review and verify export documents' },
    { key: 'market', icon: '📊', title: 'Market Advice', desc: 'Product demand and market entry strategy' },
    { key: 'compliance', icon: '✅', title: 'Compliance Help', desc: 'Export regulations and compliance guidance' },
    { key: 'tax', icon: '🧾', title: 'Tax & GST Advice', desc: 'GST refunds, duty drawback, tax planning' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">💼 My Services & Rates</h1>
      <p className="text-[#a8b2d8] text-sm">Set your consultation fees. Platform takes 10% commission.</p>
      <div className="space-y-3">
        {services.map(s => (
          <Card key={s.key}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{s.title}</p>
                <p className="text-[#a8b2d8] text-xs">{s.desc}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-[#a8b2d8] text-sm">₹</span>
                <input
                  type="number"
                  value={rates[s.key]}
                  onChange={e => setRates(r => ({ ...r, [s.key]: e.target.value }))}
                  className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#6366f1] text-right"
                />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-[#a8b2d8] border-t border-white/5 pt-2">
              <span>Your earnings: ₹{Math.floor(rates[s.key] * 0.9)}</span>
              <span>Platform fee: ₹{Math.floor(rates[s.key] * 0.1)}</span>
            </div>
          </Card>
        ))}
      </div>
      <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className="w-full py-3 rounded-xl bg-[#6366f1] text-white font-bold hover:bg-[#5254cc] transition-all">
        {saved ? '✅ Rates Saved!' : 'Save Rates'}
      </button>
    </div>
  );
}

function EarningsPage() {
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    api.get('/adviser/consultations').then(r => setConsultations(r.data?.data || r.data || [])).catch(() => {});
  }, []);

  const completed = consultations.filter(c => c.status === 'Completed');
  const totalEarnings = completed.length * 500;
  const platformFee = completed.length * 56;
  const netEarnings = totalEarnings - platformFee;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">💰 Earnings</h1>
      <div className="grid grid-cols-1 gap-3">
        {[
          { label: 'Total Consultations Done', value: completed.length, color: 'text-[#6366f1]' },
          { label: 'Gross Earnings', value: `₹${totalEarnings}`, color: 'text-white' },
          { label: 'Platform Commission (10%)', value: `-₹${platformFee}`, color: 'text-red-400' },
          { label: 'Net Earnings', value: `₹${netEarnings}`, color: 'text-green-400' },
        ].map(s => (
          <Card key={s.label} className="flex justify-between items-center">
            <span className="text-[#a8b2d8] text-sm">{s.label}</span>
            <span className={`font-bold text-lg ${s.color}`}>{s.value}</span>
          </Card>
        ))}
      </div>
      <Card>
        <p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-3">Payment Schedule</p>
        <div className="space-y-2 text-sm">
          {[
            ['Next payout', 'Every Monday'],
            ['Minimum payout', '₹500'],
            ['Payment method', 'Bank Transfer / UPI'],
            ['Processing time', '2-3 business days'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[#a8b2d8]">{k}</span>
              <span className="text-white">{v}</span>
            </div>
          ))}
        </div>
      </Card>
      {completed.length === 0 && (
        <Card className="text-center py-10">
          <div className="text-4xl mb-3">💰</div>
          <p className="text-[#a8b2d8] text-sm">No completed consultations yet. Accept bookings to start earning.</p>
        </Card>
      )}
    </div>
  );
}

function DocsPage() {
  const [docs, setDocs] = useState([
    { id: 1, client: 'Ravi Kumar', type: 'IEC Certificate', submitted: '2024-01-15', status: 'pending' },
    { id: 2, client: 'Priya Exports', type: 'GST Registration', submitted: '2024-01-14', status: 'verified' },
    { id: 3, client: 'Sun Traders', type: 'Shipping Bill', submitted: '2024-01-13', status: 'pending' },
    { id: 4, client: 'Blue Ocean Co.', type: 'Certificate of Origin', submitted: '2024-01-12', status: 'rejected' },
  ]);

  const updateDoc = (id, status) => setDocs(d => d.map(doc => doc.id === id ? { ...doc, status } : doc));
  const STATUS = { pending: 'text-yellow-400 bg-yellow-400/10', verified: 'text-green-400 bg-green-400/10', rejected: 'text-red-400 bg-red-400/10' };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📋 Document Verification</h1>
      <p className="text-[#a8b2d8] text-sm">Review and verify documents submitted by clients.</p>
      <div className="space-y-3">
        {docs.map(d => (
          <Card key={d.id}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-white font-bold text-sm">{d.client}</p>
                <p className="text-[#a8b2d8] text-xs">{d.type}</p>
                <p className="text-[#a8b2d8] text-xs mt-1">Submitted: {d.submitted}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${STATUS[d.status]}`}>{d.status}</span>
            </div>
            {d.status === 'pending' && (
              <div className="flex gap-2 border-t border-white/5 pt-3">
                <button onClick={() => updateDoc(d.id, 'verified')} className="flex-1 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold border border-green-400/20 hover:bg-green-500/20 transition-all">✓ Verify</button>
                <button onClick={() => updateDoc(d.id, 'rejected')} className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold border border-red-400/20 hover:bg-red-500/20 transition-all">✗ Reject</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdviserDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route index element={<AdviserHome />} />
        <Route path="dashboard" element={<AdviserHome />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="chat" element={<ChatPage userRole="adviser" />} />
      </Routes>
    </DashboardLayout>
  );
}
