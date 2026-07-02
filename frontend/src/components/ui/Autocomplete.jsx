import { useEffect, useRef, useState } from 'react';

export default function Autocomplete({ label, value, onChange, options = [], placeholder, required, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const query = value || '';
  const matches = (query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.trim().toLowerCase()))
    : options
  ).slice(0, 8);

  const select = (opt) => { onChange(opt); setOpen(false); };

  return (
    <div className="relative flex flex-col gap-1" ref={ref}>
      {label && <label className="text-sm text-[#a8b2d8] font-medium">{label}</label>}
      <input
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#e94560] transition-colors disabled:opacity-50"
      />
      {open && !disabled && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-[#16213e] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {matches.map(opt => (
            <button key={opt} type="button" onClick={() => select(opt)}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-all">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
