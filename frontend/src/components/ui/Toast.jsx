import { useEffect } from 'react';
export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${colors[type]} text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white/70 hover:text-white">&times;</button>
    </div>
  );
}
