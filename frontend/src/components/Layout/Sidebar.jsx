import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const emailName = user?.email?.split('@')[0] || '';
  const fullName = user?.companyName || user?.name || user?.farmerName || emailName || 'User';
  const displayName = emailName || fullName.split(' ')[0];
  const initial = displayName[0]?.toUpperCase() || 'U';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center px-4 py-3 bg-[#16213e] border-b border-white/10">
        {/* Left: avatar only — opens drawer */}
        <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0 hover:opacity-80 transition-opacity">
          {initial}
        </button>

        {/* Center: Hello + name */}
        <div className="flex-1 text-center">
          <p className="text-white text-sm font-semibold">Hello, {displayName}</p>
        </div>

        {/* Right: app name */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-sm font-bold text-white">Export</span>
          <span className="text-sm font-bold text-[#e94560]">Pro</span>
        </div>
      </header>

      {/* Drawer — no dark backdrop */}
      <div className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#16213e] border-r border-white/10 shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <button onClick={() => setDrawerOpen(false)} className="self-end text-[#a8b2d8] hover:text-white text-xl mb-6">✕</button>

          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-2xl">
              {initial}
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-base">{fullName}</p>
              <p className="text-[#a8b2d8] text-xs mt-1">{user?.email}</p>
              {user?.role && <p className="text-[#6366f1] text-xs mt-1 capitalize">{user.role}</p>}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {user && Object.entries(user)
              .filter(([k]) => !['password', '__v', '_id', 'token', 'role', 'email'].includes(k))
              .map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#a8b2d8] text-xs capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white text-xs font-medium text-right max-w-[140px]">{String(v)}</span>
                </div>
              ))}
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full py-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-all"
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
