import { useNavigate } from 'react-router-dom';

const roles = [
  { id: 'beginner', icon: '🚀', name: 'Beginner', desc: 'Start your export journey' },
  { id: 'exporter', icon: '🚢', name: 'Exporter', desc: 'Manage your shipments' },
  { id: 'farmer', icon: '🌱', name: 'Farmer', desc: 'List your products' },
  { id: 'cha', icon: '🛡️', name: 'CHA', desc: 'Handle customs clearance' },
  { id: 'forwarder', icon: '🚚', name: 'Forwarder', desc: 'Manage logistics' },
  { id: 'adviser', icon: '⭐', name: 'Adviser', desc: 'Provide expert guidance' },
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-24 px-4 text-center">
        <div className="absolute inset-0 bg-[#e94560]/5 opacity-50" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Export<span className="text-[#e94560]">Pro</span>
          </h1>
          <p className="text-2xl md:text-3xl text-[#a8b2d8] mb-4">Simplify Global Trade</p>
          <p className="text-[#a8b2d8]/70 max-w-xl mx-auto">
            A comprehensive platform for exporters, farmers, customs agents, forwarders, advisers, and beginners to manage the entire export lifecycle.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-center text-xl text-[#a8b2d8] mb-10 font-medium">Select your role to get started</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => navigate(`/${role.id}/login`)}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center hover:scale-105 hover:border-[#e94560]/50 hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="text-5xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#e94560] transition-colors">{role.name}</h3>
              <p className="text-[#a8b2d8] text-sm">{role.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
