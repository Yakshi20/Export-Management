import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext(null);
function getUserThemeKey() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.email ? `theme_${user.email}` : 'theme_guest';
  } catch { return 'theme_guest'; }
}
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const key = getUserThemeKey();
    return localStorage.getItem(key) || 'dark';
  });
  useEffect(() => {
    const key = getUserThemeKey();
    const saved = localStorage.getItem(key);
    if (saved) setTheme(saved); else setTheme('dark');
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light-theme');
    else root.classList.remove('light-theme');
  }, [theme]);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const key = getUserThemeKey();
    localStorage.setItem(key, next);
    setTheme(next);
  };
  const applyUserTheme = (email) => {
    const key = `theme_${email}`;
    const saved = localStorage.getItem(key) || 'dark';
    setTheme(saved);
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, applyUserTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
