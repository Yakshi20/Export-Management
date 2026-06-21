export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
