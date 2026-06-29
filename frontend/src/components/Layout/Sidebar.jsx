import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Sidebar({ links }) {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState('profile');
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  // Name update
  const [newName, setNewName] = useState('');
  // Password update
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  // Photo
  const [photo, setPhoto] = useState(user?.photo || null);
  const fileRef = useRef();

  const emailName = user?.email?.split('@')[0] || '';
  const fullName = user?.name || user?.companyName || user?.farmerName || emailName || 'User';
  const displayName = user?.name || emailName || fullName.split(' ')[0];
  const initial = photo ? null : displayName[0]?.toUpperCase() || 'U';
  const role = user?.role || 'exporter';

  const handleLogout = () => { logout(); navigate('/'); };

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const saveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await api.put(`/${role}/profile`, { name: newName.trim() });
      const updated = { ...user, name: newName.trim() };
      login(localStorage.getItem('token'), updated);
      setNewName('');
      showMsg('Name updated!');
    } catch { showMsg('Failed to update name', 'error'); }
    setSaving(false);
  };

  const savePassword = async () => {
    if (pw.next !== pw.confirm) { showMsg('Passwords do not match', 'error'); return; }
    if (!pw.current || !pw.next) { showMsg('Fill all fields', 'error'); return; }
    setSaving(true);
    try {
      await api.post(`/${role}/change-password`, { currentPassword: pw.current, newPassword: pw.next });
      setPw({ current: '', next: '', confirm: '' });
      showMsg('Password changed!');
    } catch (e) { showMsg(e.response?.data?.message || 'Failed', 'error'); }
    setSaving(false);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      const updated = { ...user, photo: ev.target.result };
      login(localStorage.getItem('token'), updated);
      showMsg('Photo updated!');
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'name', label: '✏️ Name' },
    { id: 'password', label: '🔒 Password' },
  ];

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center px-4 py-3 bg-[#16213e] border-b border-white/10">
        <button onClick={() => { setDrawerOpen(true); setTab('profile'); }} className="w-9 h-9 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0 hover:opacity-80 transition-opacity overflow-hidden">
          {photo ? <img src={photo} alt="avatar" className="w-full h-full object-cover" /> : initial}
        </button>
        <div className="flex-1 text-center">
          <p className="text-white text-sm font-semibold">Hello, {displayName}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-sm font-bold text-white">Export</span>
          <span className="text-sm font-bold text-[#e94560]">Pro</span>
        </div>
      </header>

      {/* Drawer */}
      <div className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#16213e] border-r border-white/10 shadow-2xl transition-transform duration-300 flex flex-col ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="text-white font-bold text-base">My Profile</p>
          <button onClick={() => setDrawerOpen(false)} className="text-[#a8b2d8] hover:text-white text-lg">✕</button>
        </div>

        {/* Avatar + info */}
        <div className="flex flex-col items-center gap-2 pt-6 pb-4 px-5">
          <button onClick={() => fileRef.current.click()} className="relative group">
            <div className="w-16 h-16 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
              {photo ? <img src={photo} alt="avatar" className="w-full h-full object-cover" /> : initial}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white">📷</div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <p className="text-white font-bold text-sm">{displayName}</p>
          <p className="text-[#a8b2d8] text-xs">{user?.email}</p>
          {user?.role && <span className="text-[#6366f1] text-xs capitalize bg-[#6366f1]/10 px-2 py-0.5 rounded-full">{user.role}</span>}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold transition-all ${tab === t.id ? 'text-[#6366f1] border-b-2 border-[#6366f1]' : 'text-[#a8b2d8]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {msg && (
            <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-medium ${msg.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {msg.text}
            </div>
          )}

          {tab === 'profile' && (
            <div className="space-y-3">
              {user && Object.entries(user)
                .filter(([k]) => !['password', '__v', '_id', 'token', 'photo'].includes(k))
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-[#a8b2d8] text-xs capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white text-xs font-medium text-right max-w-[130px] truncate">{String(v)}</span>
                  </div>
                ))}
            </div>
          )}

          {tab === 'name' && (
            <div className="space-y-3">
              <p className="text-[#a8b2d8] text-xs mb-1">Current: <span className="text-white">{displayName}</span></p>
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">New Name</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Enter new name"
                  className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]"
                />
              </div>
              <button
                onClick={saveName}
                disabled={saving || !newName.trim()}
                className="w-full py-2.5 rounded-lg bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#5254cc] disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Update Name'}
              </button>
            </div>
          )}

          {tab === 'password' && (
            <div className="space-y-3">
              {['current', 'next', 'confirm'].map((field, i) => (
                <div key={field}>
                  <label className="text-[#a8b2d8] text-xs block mb-1">
                    {i === 0 ? 'Current Password' : i === 1 ? 'New Password' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    value={pw[field]}
                    onChange={e => setPw(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              ))}
              <button
                onClick={savePassword}
                disabled={saving}
                className="w-full py-2.5 rounded-lg bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#5254cc] disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="px-5 pb-6">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#16213e] border-t border-white/10 flex items-center justify-around px-2 py-2">
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium min-w-[56px] ${
                isActive ? 'text-[#6366f1] bg-[#6366f1]/10' : 'text-[#a8b2d8] hover:text-white'
              }`
            }
          >
            {link.icon && <span className="text-xl">{link.icon}</span>}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
