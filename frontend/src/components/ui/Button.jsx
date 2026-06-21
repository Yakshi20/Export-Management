export default function Button({ variant = 'primary', children, onClick, disabled, loading, type = 'button', className = '' }) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#e94560] hover:bg-[#c73652] text-white',
    secondary: 'border border-white/20 text-white hover:bg-white/10',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${className}`}>
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}
