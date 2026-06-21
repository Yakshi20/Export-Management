export default function Input({ label, name, type = 'text', value, onChange, placeholder, error, required }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-[#a8b2d8] font-medium">{label}{required && ' *'}</label>}
      <input
        name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#e94560] transition-colors"
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}
