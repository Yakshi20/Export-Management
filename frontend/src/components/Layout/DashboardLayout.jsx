import Sidebar from './Sidebar';

export default function DashboardLayout({ links, children }) {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <Sidebar links={links} />
      <main className="pt-16 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
