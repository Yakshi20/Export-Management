import ChatPage from '../chat/ChatPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import api from '../../api/axios';

const links = [
  { label: 'Home', path: '/farmer/dashboard', icon: '🏠', end: true },
  { label: 'My Crops', path: '/farmer/crops', icon: '🌾' },
  { label: 'Market', path: '/farmer/market', icon: '📈' },
  { label: 'Exporters', path: '/farmer/exporters', icon: '🤝' },
  { label: 'Chat', path: '/farmer/chat', icon: '💬' },
  { label: 'Guide', path: '/farmer/guide', icon: '📦' },
];

const MARKET_PRICES = [
  { crop: 'Basmati Rice', price: '₹4,200/qt', change: '+2.3%', up: true, demand: 'High', countries: 'UAE, Saudi Arabia, UK' },
  { crop: 'Alphonso Mango', price: '₹8,500/qt', change: '+5.1%', up: true, demand: 'Very High', countries: 'USA, UK, Japan' },
  { crop: 'Turmeric', price: '₹7,800/qt', change: '-1.2%', up: false, demand: 'Medium', countries: 'USA, Germany, Japan' },
  { crop: 'Black Pepper', price: '₹42,000/qt', change: '+3.8%', up: true, demand: 'High', countries: 'USA, Vietnam, Germany' },
  { crop: 'Cotton', price: '₹6,500/qt', change: '-0.5%', up: false, demand: 'Medium', countries: 'China, Bangladesh, Vietnam' },
  { crop: 'Pomegranate', price: '₹5,200/qt', change: '+4.2%', up: true, demand: 'High', countries: 'Netherlands, UAE, Russia' },
  { crop: 'Onion', price: '₹1,800/qt', change: '+8.5%', up: true, demand: 'Very High', countries: 'Malaysia, Sri Lanka, Bangladesh' },
  { crop: 'Wheat', price: '₹2,400/qt', change: '-2.1%', up: false, demand: 'Medium', countries: 'Indonesia, Philippines, Kenya' },
  { crop: 'Soybean', price: '₹4,100/qt', change: '+1.4%', up: true, demand: 'High', countries: 'China, Iran, Bangladesh' },
  { crop: 'Cashew', price: '₹1,20,000/qt', change: '+6.2%', up: true, demand: 'Very High', countries: 'USA, Netherlands, UAE' },
];

function WeatherWidget() {
  const seasons = [
    { month: 'Jun–Sep', season: 'Kharif Season', crops: 'Rice, Cotton, Soybean, Maize', tip: 'Ideal for sowing. Ensure good drainage.' },
    { month: 'Oct–Mar', season: 'Rabi Season', crops: 'Wheat, Mustard, Peas, Lentils', tip: 'Cool weather. Watch for frost in north India.' },
    { month: 'Mar–Jun', season: 'Zaid Season', crops: 'Watermelon, Cucumber, Muskmelon', tip: 'Short season crops. Needs irrigation.' },
  ];
  const month = new Date().getMonth();
  const currentSeason = month >= 5 && month <= 8 ? seasons[0] : month >= 9 || month <= 2 ? seasons[1] : seasons[2];
  return (
    <Card>
      <p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-3">🌤 Current Farming Season</p>
      <div className="bg-[#6366f1]/10 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white font-bold">{currentSeason.season}</span>
          <span className="text-[#a8b2d8] text-xs">{currentSeason.month}</span>
        </div>
        <p className="text-[#a8b2d8] text-xs">Best crops: <span className="text-green-400">{currentSeason.crops}</span></p>
        <p className="text-[#a8b2d8] text-xs mt-1">💡 {currentSeason.tip}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {seasons.map(s => (
          <div key={s.season} className={`text-center p-2 rounded-lg text-xs ${s.season === currentSeason.season ? 'bg-[#6366f1]/20 border border-[#6366f1]/40' : 'bg-white/5'}`}>
            <p className="text-white font-medium text-xs">{s.season.split(' ')[0]}</p>
            <p className="text-[#a8b2d8] text-xs">{s.month}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FarmerHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.farmerName || user.name || user.email?.split('@')[0] || 'Farmer';
  const [crops, setCrops] = useState([]);
  useEffect(() => { setCrops(JSON.parse(localStorage.getItem('farmerCrops') || '[]')); }, []);
  const cards = [
    { icon: '🌾', title: 'My Crops', sub: 'Upload crop details & images', path: '/farmer/crops', badge: crops.length > 0 ? crops.length : null },
    { icon: '📈', title: 'Market Prices', sub: 'Live prices & export demand', path: '/farmer/market' },
    { icon: '🤝', title: 'Connect Exporters', sub: 'Find buyers for your produce', path: '/farmer/exporters' },
    { icon: '📦', title: 'Packaging Guide', sub: 'Export-ready packaging tips', path: '/farmer/guide' },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hello, {name}! 🌾</h1>
        <p className="text-[#a8b2d8] text-sm mt-1">Your farming & export dashboard.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Listed Crops', value: crops.length, color: 'text-green-400' },
          { label: 'Active Listings', value: crops.filter(c => c.available).length, color: 'text-[#6366f1]' },
          { label: 'Total Qty (kg)', value: crops.reduce((a, c) => a + (Number(c.quantity) || 0), 0), color: 'text-yellow-400' },
          { label: 'Avg Price/kg', value: crops.length > 0 ? `₹${Math.round(crops.reduce((a, c) => a + (Number(c.price) || 0), 0) / crops.length)}` : '₹0', color: 'text-white' },
        ].map(s => (
          <Card key={s.label} className="text-center py-3">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[#a8b2d8] text-xs mt-1">{s.label}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(c => (
          <button key={c.title} onClick={() => navigate(c.path)} className="text-left w-full">
            <Card className="flex items-center gap-4 hover:border-[#6366f1]/50 transition-all cursor-pointer">
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{c.title}</p>
                <p className="text-[#a8b2d8] text-xs">{c.sub}</p>
              </div>
              {c.badge && <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{c.badge}</span>}
              <span className="text-[#6366f1] text-xl">›</span>
            </Card>
          </button>
        ))}
      </div>
      <WeatherWidget />
    </div>
  );
}

function CropsPage() {
  const [crops, setCrops] = useState(() => JSON.parse(localStorage.getItem('farmerCrops') || '[]'));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', quantity: '', unit: 'kg', price: '', harvestDate: '', quality: 'A', available: true, location: '', description: '' });
  const [msg, setMsg] = useState(null);

  const save = () => {
    if (!form.name || !form.quantity || !form.price) {
      setMsg({ text: 'Crop name, quantity and price are required', type: 'error' });
      setTimeout(() => setMsg(null), 3000);
      return;
    }
    const updated = editId !== null ? crops.map((c, i) => i === editId ? { ...form } : c) : [...crops, { ...form, id: Date.now() }];
    setCrops(updated);
    localStorage.setItem('farmerCrops', JSON.stringify(updated));
    setForm({ name: '', quantity: '', unit: 'kg', price: '', harvestDate: '', quality: 'A', available: true, location: '', description: '' });
    setShowForm(false);
    setEditId(null);
    setMsg({ text: editId !== null ? 'Crop updated!' : 'Crop listed!', type: 'success' });
    setTimeout(() => setMsg(null), 3000);
  };

  const edit = (i) => { setForm(crops[i]); setEditId(i); setShowForm(true); };
  const remove = (i) => { const u = crops.filter((_, idx) => idx !== i); setCrops(u); localStorage.setItem('farmerCrops', JSON.stringify(u)); };
  const toggle = (i) => { const u = crops.map((c, idx) => idx === i ? { ...c, available: !c.available } : c); setCrops(u); localStorage.setItem('farmerCrops', JSON.stringify(u)); };
  const QUALITY = { A: 'text-green-400', B: 'text-yellow-400', C: 'text-orange-400' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🌾 My Crops</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', quantity: '', unit: 'kg', price: '', harvestDate: '', quality: 'A', available: true, location: '', description: '' }); }}
          className="px-4 py-2 bg-[#6366f1] text-white text-sm font-bold rounded-xl hover:bg-[#5254cc] transition-all">
          {showForm ? '✕ Cancel' : '+ Add Crop'}
        </button>
      </div>
      {msg && <div className={`px-4 py-2 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{msg.text}</div>}
      {showForm && (
        <Card>
          <p className="text-white font-bold mb-4">{editId !== null ? 'Edit Crop' : 'Add New Crop'}</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#a8b2d8] text-xs mb-1 block">Crop Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Basmati Rice" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="text-[#a8b2d8] text-xs mb-1 block">Location</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Punjab, India" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[#a8b2d8] text-xs mb-1 block">Quantity *</label>
                <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="100" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="text-[#a8b2d8] text-xs mb-1 block">Unit</label>
                <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]">
                  {['kg', 'quintal', 'tonne', 'box', 'bag'].map(u => <option key={u} value={u} className="bg-[#16213e]">{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[#a8b2d8] text-xs mb-1 block">Price/unit (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="50" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#a8b2d8] text-xs mb-1 block">Harvest Date</label>
                <input type="date" value={form.harvestDate} onChange={e => setForm(f => ({ ...f, harvestDate: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="text-[#a8b2d8] text-xs mb-1 block">Quality Grade</label>
                <select value={form.quality} onChange={e => setForm(f => ({ ...f, quality: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]">
                  <option value="A" className="bg-[#16213e]">Grade A (Export Quality)</option>
                  <option value="B" className="bg-[#16213e]">Grade B (Standard)</option>
                  <option value="C" className="bg-[#16213e]">Grade C (Domestic)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[#a8b2d8] text-xs mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Variety, farming method, certifications..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1] resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="avail" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="accent-[#6366f1]" />
              <label htmlFor="avail" className="text-[#a8b2d8] text-sm">Available for export buyers</label>
            </div>
            <button onClick={save} className="w-full py-2.5 bg-[#6366f1] text-white font-bold rounded-xl hover:bg-[#5254cc] transition-all">{editId !== null ? 'Update Crop' : 'List Crop'}</button>
          </div>
        </Card>
      )}
      {crops.length === 0 && !showForm ? (
        <Card className="text-center py-14">
          <div className="text-5xl mb-3">🌾</div>
          <p className="text-white font-bold mb-1">No crops listed yet</p>
          <p className="text-[#a8b2d8] text-sm">Add your crops to connect with export buyers</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {crops.map((c, i) => (
            <Card key={c.id || i}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-bold">{c.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 ${QUALITY[c.quality]}`}>Grade {c.quality}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.available ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>{c.available ? 'Available' : 'Unavailable'}</span>
                  </div>
                  {c.location && <p className="text-[#a8b2d8] text-xs mt-1">📍 {c.location}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-green-400 font-bold">₹{c.price}/{c.unit}</p>
                  <p className="text-[#a8b2d8] text-xs">{c.quantity} {c.unit}</p>
                </div>
              </div>
              {c.harvestDate && <p className="text-[#a8b2d8] text-xs mb-2">🗓 Harvest: {new Date(c.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
              {c.description && <p className="text-[#a8b2d8] text-xs mb-3 border-t border-white/5 pt-2">{c.description}</p>}
              <div className="flex gap-2 border-t border-white/5 pt-3">
                <button onClick={() => toggle(i)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${c.available ? 'bg-red-500/10 text-red-400 border-red-400/20' : 'bg-green-500/10 text-green-400 border-green-400/20'}`}>{c.available ? 'Mark Unavailable' : 'Mark Available'}</button>
                <button onClick={() => edit(i)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20">Edit</button>
                <button onClick={() => remove(i)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-[#a8b2d8] border border-white/10 hover:text-red-400 transition-all">✕</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MarketPage() {
  const [search, setSearch] = useState('');
  const filtered = MARKET_PRICES.filter(p => p.crop.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📈 Market Prices</h1>
      <p className="text-[#a8b2d8] text-sm">Live export market prices and demand for Indian agricultural products.</p>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crop..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
      <div className="space-y-3">
        {filtered.map(p => (
          <Card key={p.crop}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{p.crop}</p>
                <p className="text-[#a8b2d8] text-xs mt-1">Top importers: {p.countries}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${p.demand === 'Very High' ? 'bg-green-400/10 text-green-400' : p.demand === 'High' ? 'bg-blue-400/10 text-blue-400' : 'bg-yellow-400/10 text-yellow-400'}`}>{p.demand} Demand</span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold">{p.price}</p>
                <p className={`text-xs font-semibold ${p.up ? 'text-green-400' : 'text-red-400'}`}>{p.change} {p.up ? '↑' : '↓'}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ExportersPage() {
  const [sent, setSent] = useState({});
  const EXPORTERS = [
    { name: 'AgriExport India Pvt. Ltd.', location: 'Mumbai', crops: ['Rice', 'Wheat', 'Spices'], verified: true, rating: 4.8 },
    { name: 'FreshFarm Global', location: 'Delhi', crops: ['Mango', 'Pomegranate', 'Onion'], verified: true, rating: 4.6 },
    { name: 'Spice Route Exports', location: 'Kochi', crops: ['Pepper', 'Turmeric', 'Cardamom'], verified: true, rating: 4.9 },
    { name: 'Green Valley Traders', location: 'Nashik', crops: ['Grapes', 'Onion', 'Tomato'], verified: false, rating: 4.2 },
    { name: 'Bharat Agri Connect', location: 'Hyderabad', crops: ['Cotton', 'Soybean', 'Groundnut'], verified: true, rating: 4.5 },
    { name: 'Premium Produce Export', location: 'Chennai', crops: ['Cashew', 'Coconut', 'Banana'], verified: true, rating: 4.7 },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">🤝 Connect with Exporters</h1>
      <p className="text-[#a8b2d8] text-sm">Find verified export buyers for your produce.</p>
      <div className="space-y-3">
        {EXPORTERS.map(e => (
          <Card key={e.name}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-bold text-sm">{e.name}</p>
                  {e.verified && <span className="text-xs bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>}
                </div>
                <p className="text-[#a8b2d8] text-xs mt-1">📍 {e.location} · ⭐ {e.rating}/5</p>
                <p className="text-[#a8b2d8] text-xs mt-1">Buys: {e.crops.join(', ')}</p>
              </div>
            </div>
            <button onClick={() => setSent(s => ({ ...s, [e.name]: true }))} disabled={sent[e.name]}
              className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${sent[e.name] ? 'bg-green-500/10 text-green-400 border border-green-400/20' : 'bg-[#6366f1] text-white hover:bg-[#5254cc]'}`}>
              {sent[e.name] ? '✓ Request Sent' : 'Send Connection Request'}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GuidePage() {
  const [open, setOpen] = useState(null);
  const tips = [
    { title: '📦 Basic Export Packaging Standards', content: 'Use food-grade packaging materials. Ensure packaging is strong enough for long-distance transport. Mark gross weight, net weight, and country of origin. Use FSSAI-approved packaging for food items.' },
    { title: '🌾 Grains & Cereals Packaging', content: 'Use moisture-proof bags (HDPE or PP woven bags). Double-layer packaging recommended for rice and wheat. Weight per bag: max 50 kg for manual handling. Label with variety, crop year, and quality grade.' },
    { title: '🥭 Fresh Fruits & Vegetables', content: 'Use ventilated corrugated boxes. Pre-cooling before packing extends shelf life. Avoid overloading — leave 10% headspace. Use tissue paper or foam net for individual fruits. Label with country of origin and harvest date.' },
    { title: '🌶 Spices Packaging', content: 'Use airtight, moisture-proof containers. For whole spices: HDPE bags with inner poly liner. For powder: laminated pouches with oxygen absorber. Must pass FSSAI and APEDA quality checks.' },
    { title: '🏷 Mandatory Labeling Requirements', content: 'Every export package must have: Product name and variety, Net weight, Country of origin (India), Manufacturer/exporter name and address, Best before / expiry date, FSSAI license number (for food), Lot/batch number for traceability.' },
    { title: '✅ Quality Certifications for Export', content: 'APEDA registration is mandatory for agricultural exports. Organic certification: required for organic produce (NPOP). GlobalGAP: required for EU markets. Spice Board license: for spice exports. FSSAI license: mandatory for all food exports.' },
    { title: '🚢 Cold Chain & Transport Tips', content: 'Perishables must maintain 2–8°C temperature. Use reefer containers for long-haul exports. Avoid mixing ethylene-producing fruits with others. Document temperature logs for buyer compliance.' },
    { title: '💡 Common Mistakes to Avoid', content: 'Never export damaged or overripe produce — it gets rejected at customs. Do not use non-food-grade packaging. Ensure moisture content is within standards (e.g., rice ≤14%). Never overload cartons — it damages bottom layers.' },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📦 Packaging & Export Guide</h1>
      <p className="text-[#a8b2d8] text-sm">Learn how to package your produce for international export standards.</p>
      <div className="space-y-2">
        {tips.map((t, i) => (
          <Card key={i} className="cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold text-sm">{t.title}</p>
              <span className="text-[#6366f1] text-lg">{open === i ? '−' : '+'}</span>
            </div>
            {open === i && <p className="text-[#a8b2d8] text-sm mt-3 leading-relaxed border-t border-white/5 pt-3">{t.content}</p>}
          </Card>
        ))}
      </div>
      <Card>
        <p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-3">Useful Contacts</p>
        <div className="space-y-2 text-sm">
          {[['APEDA Helpline', '1800-200-1555'], ['FSSAI', '1800-11-2100'], ['Spice Board', '+91-484-2333610'], ['AGMARKNET Prices', 'agmarknet.nic.in']].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[#a8b2d8]">{k}</span>
              <span className="text-white font-medium">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route index element={<FarmerHome />} />
        <Route path="dashboard" element={<FarmerHome />} />
        <Route path="crops" element={<CropsPage />} />
        <Route path="market" element={<MarketPage />} />
        <Route path="exporters" element={<ExportersPage />} />
        <Route path="chat" element={<ChatPage userRole="farmer" />} />
        <Route path="guide" element={<GuidePage />} />
      </Routes>
    </DashboardLayout>
  );
}
