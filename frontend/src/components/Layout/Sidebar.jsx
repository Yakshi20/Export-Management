import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.companyName || user?.name || user?.farmerName || user?.email?.split('@')[0] || 'User';
  const initial = name[0].toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-[#16213e] border-b border-white/10">
        {/* Left: avatar + user name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-[#a8b2d8] text-xs leading-none mb-0.5">Welcome back,</p>
            <p className="text-white text-sm font-semibold truncate max-w-[180px]">{name}</p>
          </div>
        </div>
        {/* Right: logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium border border-red-400/20"
        >
          🚪 <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

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
