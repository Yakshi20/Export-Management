import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ links, profilePath }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fullName = user?.companyName || user?.name || user?.farmerName || user?.email?.split('@')[0] || 'User';
  const firstName = fullName.split(' ')[0];
  const initial = firstName[0].toUpperCase();

  const bottomLinks = links.filter(l => l.label !== 'Profile');

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-[#16213e] border-b border-white/10">
        {/* Left: avatar + name — clickable to profile */}
        <button
          onClick={() => navigate(profilePath || '/exporter/profile')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            {initial}
          </div>
          <div className="text-left">
            <p className="text-[#a8b2d8] text-xs leading-none mb-0.5">Hello,</p>
            <p className="text-white text-sm font-semibold">{firstName}</p>
          </div>
        </button>
        {/* Right: app name */}
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-white">Export</span>
          <span className="text-sm font-bold text-[#e94560]">Pro</span>
        </div>
      </header>

      {/* Bottom navigation bar — no Profile tab */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#16213e] border-t border-white/10 flex items-center justify-around px-2 py-2">
        {bottomLinks.map(link => (
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
