import { useTheme } from '../../context/ThemeContext';
export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  if (compact) {
    return (
      <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
        <span className="text-sm">{isDark ? '🌙' : '☀️'}</span>
        <span className="text-xs font-medium text-[#a8b2d8]">{isDark ? 'Dark' : 'Light'}</span>
      </button>
    );
  }
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{isDark ? '🌙' : '☀️'}</span>
        <div>
          <p className="text-white font-semibold text-sm">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
          <p className="text-[#a8b2d8] text-xs">{isDark ? 'Switch to light theme' : 'Switch to dark theme'}</p>
        </div>
      </div>
      <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isDark ? 'bg-[#6366f1]' : 'bg-gray-300'}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isDark ? 'left-7' : 'left-1'}`}></span>
      </button>
    </div>
  );
}
