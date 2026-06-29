import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 bg-[#16213e] border-b border-white/10">
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-white">Export</span>
          <span className="text-xl font-bold text-[#e94560]">Pro</span>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium truncate max-w-[150px]">{user.name || user.farmerName || user.companyName || user.email}</p>
              <p className="text-[#a8b2d8] text-xs truncate max-w-[150px]">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium border border-red-400/20"
            >
              🚪 <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#16213e] border-t border-white/10 flex items-center justify-around px-2 py-2">
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium min-w-[60px] ${
                isActive ? 'text-[#e94560] bg-[#e94560]/10' : 'text-[#a8b2d8] hover:text-white'
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
