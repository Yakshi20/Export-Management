import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ links, mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">Export</span>
          <span className="text-2xl font-bold text-[#e94560]">Pro</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive ? 'bg-[#e94560]/20 text-[#e94560] border border-[#e94560]/30' : 'text-[#a8b2d8] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {link.icon && <span className="text-lg">{link.icon}</span>}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        {user && (
          <div className="mb-3">
            <p className="text-white font-medium text-sm truncate">{user.name || user.farmerName || user.companyName || user.email}</p>
            <p className="text-[#a8b2d8] text-xs truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#16213e] border-r border-white/10 h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>
      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="relative w-64 bg-[#16213e] border-r border-white/10 h-full flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
