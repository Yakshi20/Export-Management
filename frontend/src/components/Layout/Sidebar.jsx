import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ links }) {
  const { user } = useAuth();
  const fullName = user?.companyName || user?.name || user?.farmerName || user?.email?.split('@')[0] || 'User';
  const firstName = fullName.split(' ')[0];
  const initial = firstName[0].toUpperCase();

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-[#16213e] border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {initial}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">Hello, {firstName}</p>
        </div>
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
