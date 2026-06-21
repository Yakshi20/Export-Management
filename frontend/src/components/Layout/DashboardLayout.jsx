import { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ links, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex">
      <Sidebar links={links} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center gap-4 p-4 bg-[#16213e] border-b border-white/10">
          <button onClick={() => setMobileOpen(true)} className="text-white text-xl">☰</button>
          <span className="text-white font-bold">ExportPro</span>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
