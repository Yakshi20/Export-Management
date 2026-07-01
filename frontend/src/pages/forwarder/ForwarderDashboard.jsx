import ChatPage from '../chat/ChatPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import api from '../../api/axios';

const links = [
  { label: 'Home', path: '/forwarder/dashboard', icon: '🏠', end: true },
  { label: 'Shipments', path: '/forwarder/shipments', icon: '🚢' },
  { label: 'Quotes', path: '/forwarder/quotes', icon: '💰' },
  { label: 'Documents', path: '/forwarder/documents', icon: '📄' },
  { label: 'Chat', path: '/forwarder/chat', icon: '💬' },
  { label: 'Pickup', path: '/forwarder/pickup', icon: '📅' },
  { label: 'Chat', path: '/forwarder/chat', icon: '💬' },
];
const STATUSES = ['Pending', 'Picked', 'In Transit', 'Customs', 'Delivered'];
const STATUS_COLOR = { Pending: 'text-yellow-400 bg-yellow-400/10', Picked: 'text-blue-400 bg-blue-400/10', 'In Transit': 'text-purple-400 bg-purple-400/10', Customs: 'text-orange-400 bg-orange-400/10', Delivered: 'text-green-400 bg-green-400/10' };

function ForwarderHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.name || user.email?.split('@')[0] || 'Forwarder';
  const [shipments, setShipments] = useState([]);
  useEffect(() => { api.get('/forwarder/shipments').then(r => setShipments(r.data?.data || r.data || [])).catch(() => {}); }, []);
  const stats = [{ label: 'Total Shipments', value: shipments.length, color: 'text-[#6366f1]' }, { label: 'Pending', value: shipments.filter(s => s.status === 'Pending').length, color: 'text-yellow-400' }, { label: 'In Transit', value: shipments.filter(s => s.status === 'In Transit').length, color: 'text-purple-400' }, { label: 'Delivered', value: shipments.filter(s => s.status === 'Delivered').length, color: 'text-green-400' }];
  const cards = [{ icon: '🚢', title: 'Shipments', sub: 'Manage & update shipment status', path: '/forwarder/shipments' }, { icon: '💰', title: 'Freight Quotes', sub: 'Provide air, sea & customs quotes', path: '/forwarder/quotes' }, { icon: '📄', title: 'Documents', sub: 'Upload Bill of Lading, AWB, etc.', path: '/forwarder/documents' }, { icon: '📅', title: 'Pickup Schedule', sub: 'Set pickup dates & vehicle details', path: '/forwarder/pickup' }];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Hello, {name}! 🚚</h1><p className="text-[#a8b2d8] text-sm mt-1">Your freight forwarding dashboard.</p></div>
      <div className="grid grid-cols-2 gap-3">{stats.map(s => (<Card key={s.label} className="text-center py-3"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-[#a8b2d8] text-xs mt-1">{s.label}</p></Card>))}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{cards.map(c => (<button key={c.title} onClick={() => navigate(c.path)} className="text-left w-full"><Card className="flex items-center gap-4 hover:border-[#6366f1]/50 transition-all cursor-pointer"><span className="text-2xl">{c.icon}</span><div className="flex-1"><p className="text-white font-bold text-sm">{c.title}</p><p className="text-[#a8b2d8] text-xs">{c.sub}</p></div><span className="text-[#6366f1] text-xl">›</span></Card></button>))}</div>
      <Card><p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-3">Shipment Flow</p><div className="flex items-center gap-1 flex-wrap">{STATUSES.map((s, i) => (<div key={s} className="flex items-center gap-1"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLOR[s]}`}>{s}</span>{i < STATUSES.length - 1 && <span className="text-[#a8b2d8] text-xs">→</span>}</div>))}</div></Card>
    </div>
  );
}

function ShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [saving, setSaving] = useState({});
  const [tracking, setTracking] = useState({});
  const [msg, setMsg] = useState(null);
  const DEMO = [{ _id: '1', exporterName: 'Ravi Exports Pvt Ltd', origin: 'Mumbai', destination: 'Dubai, UAE', product: 'Basmati Rice', weight: '500 kg', status: 'Pending', trackingId: '' }, { _id: '2', exporterName: 'Sun Traders', origin: 'Delhi', destination: 'London, UK', product: 'Spices', weight: '200 kg', status: 'In Transit', trackingId: 'TRK-20240112' }, { _id: '3', exporterName: 'Blue Ocean Co.', origin: 'Chennai', destination: 'Singapore', product: 'Cotton', weight: '1000 kg', status: 'Customs', trackingId: 'TRK-20240110' }];
  useEffect(() => { api.get('/forwarder/shipments').then(r => setShipments(r.data?.data?.length ? r.data.data : DEMO)).catch(() => setShipments(DEMO)).finally(() => setLoading(false)); }, []);
  const update = async (id, data) => { setSaving(s => ({ ...s, [id]: true })); try { await api.put(`/forwarder/shipments/${id}`, data); setShipments(list => list.map(s => s._id === id ? { ...s, ...data } : s)); setMsg({ text: 'Updated!', type: 'success' }); } catch { setShipments(list => list.map(s => s._id === id ? { ...s, ...data } : s)); setMsg({ text: 'Saved locally', type: 'success' }); } setSaving(s => ({ ...s, [id]: false })); setTimeout(() => setMsg(null), 3000); };
  const filtered = filter === 'All' ? shipments : shipments.filter(s => s.status === filter);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">🚢 Shipment Requests</h1>
      {msg && <div className={`px-4 py-2 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{msg.text}</div>}
      <div className="flex gap-2 flex-wrap">{['All', ...STATUSES].map(s => (<button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === s ? 'bg-[#6366f1] text-white' : 'bg-white/5 text-[#a8b2d8] hover:bg-white/10'}`}>{s}</button>))}</div>
      {loading ? <p className="text-[#a8b2d8] text-sm">Loading...</p> : filtered.length === 0 ? (<Card className="text-center py-12"><div className="text-4xl mb-3">🚢</div><p className="text-[#a8b2d8]">No shipments found.</p></Card>) : (<div className="space-y-4">{filtered.map(s => (<Card key={s._id}><div className="flex items-start justify-between gap-3 mb-3"><div className="flex-1"><p className="text-white font-bold text-sm">{s.exporterName || 'Exporter'}</p><p className="text-[#a8b2d8] text-xs">📦 {s.product} · {s.weight}</p><p className="text-[#a8b2d8] text-xs">📍 {s.origin} → {s.destination}</p>{s.trackingId && <p className="text-[#6366f1] text-xs mt-1">🔍 {s.trackingId}</p>}</div><span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${STATUS_COLOR[s.status] || STATUS_COLOR.Pending}`}>{s.status}</span></div><div className="space-y-2 border-t border-white/5 pt-3"><div className="flex gap-2 flex-wrap"><select defaultValue={s.status} onChange={e => update(s._id, { status: e.target.value })} disabled={saving[s._id]} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#6366f1]">{STATUSES.map(st => <option key={st} value={st} className="bg-[#16213e]">{st}</option>)}</select>{s.status === 'Pending' && (<><button onClick={() => update(s._id, { status: 'Picked' })} className="px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-semibold border border-green-400/20 rounded-lg">✓ Accept</button><button onClick={() => update(s._id, { status: 'Cancelled' })} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-semibold border border-red-400/20 rounded-lg">✗ Reject</button></>)}</div><div className="flex gap-2"><input placeholder="Add tracking ID" defaultValue={s.trackingId} onChange={e => setTracking(t => ({ ...t, [s._id]: e.target.value }))} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#6366f1]" /><button onClick={() => update(s._id, { trackingId: tracking[s._id] || s.trackingId })} className="px-3 py-1.5 bg-[#6366f1]/10 text-[#6366f1] text-xs font-semibold border border-[#6366f1]/20 rounded-lg">Save</button></div></div></Card>))}</div>)}
    </div>
  );
}

function QuotesPage() {
  const [form, setForm] = useState({ origin: '', destination: '', weight: '', type: 'sea' });
  const [quote, setQuote] = useState(null);
  const [quotes, setQuotes] = useState([{ id: 1, exporter: 'Ravi Exports', route: 'Mumbai → Dubai', weight: '500 kg', air: 90000, sea: 22500, status: 'pending' }, { id: 2, exporter: 'Sun Traders', route: 'Delhi → London', weight: '200 kg', air: 36000, sea: 9000, status: 'accepted' }]);
  const calculate = () => { const w = Number(form.weight) || 0; const isAir = form.type === 'air'; const freight = isAir ? w * 180 : w * 45; const customs = Math.round(freight * 0.08); const insurance = Math.round(freight * 0.02); const lt = isAir ? 3500 : 5000; setQuote({ freight, customs, insurance, lt, total: freight + customs + insurance + lt }); };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">💰 Freight Quote Calculator</h1>
      <Card>
        <p className="text-white font-bold mb-4">Calculate Freight Cost</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3"><div><label className="text-[#a8b2d8] text-xs mb-1 block">Origin Port</label><input value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} placeholder="e.g. Mumbai" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" /></div><div><label className="text-[#a8b2d8] text-xs mb-1 block">Destination</label><input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="e.g. Dubai" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="text-[#a8b2d8] text-xs mb-1 block">Weight (kg)</label><input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="500" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" /></div><div><label className="text-[#a8b2d8] text-xs mb-1 block">Type</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]"><option value="sea" className="bg-[#16213e]">🚢 Sea Freight</option><option value="air" className="bg-[#16213e]">✈️ Air Freight</option></select></div></div>
          <button onClick={calculate} className="w-full py-2.5 bg-[#6366f1] text-white font-bold rounded-xl">Calculate Quote</button>
        </div>
        {quote && (<div className="mt-4 border-t border-white/10 pt-4 space-y-2"><p className="text-xs text-[#6366f1] font-semibold uppercase mb-2">Estimated Costs</p>{[[`${form.type==='air'?'✈️ Air':'🚢 Sea'} Freight`,`₹${quote.freight.toLocaleString()}`],['🛃 Customs (8%)',`₹${quote.customs.toLocaleString()}`],['🛡 Insurance (2%)',`₹${quote.insurance.toLocaleString()}`],['🚛 Local Transport',`₹${quote.lt.toLocaleString()}`]].map(([k,v])=>(<div key={k} className="flex justify-between text-sm border-b border-white/5 pb-2"><span className="text-[#a8b2d8]">{k}</span><span className="text-white">{v}</span></div>))}<div className="flex justify-between pt-1"><span className="text-white font-bold">Total</span><span className="text-green-400 font-bold text-lg">₹{quote.total.toLocaleString()}</span></div></div>)}
      </Card>
      <h2 className="text-lg font-bold text-white">Quote Requests</h2>
      <div className="space-y-3">{quotes.map(q=>(<Card key={q.id}><div className="flex justify-between gap-3 mb-3"><div><p className="text-white font-bold text-sm">{q.exporter}</p><p className="text-[#a8b2d8] text-xs">{q.route} · {q.weight}</p></div><span className={`text-xs px-2 py-1 rounded-full font-semibold h-fit ${q.status==='accepted'?'bg-green-400/10 text-green-400':'bg-yellow-400/10 text-yellow-400'}`}>{q.status}</span></div><div className="grid grid-cols-2 gap-3 mb-3"><div className="bg-white/5 rounded-lg p-2 text-center"><p className="text-xs text-[#a8b2d8]">✈️ Air</p><p className="text-white font-bold">₹{q.air.toLocaleString()}</p></div><div className="bg-white/5 rounded-lg p-2 text-center"><p className="text-xs text-[#a8b2d8]">🚢 Sea</p><p className="text-white font-bold">₹{q.sea.toLocaleString()}</p></div></div>{q.status==='pending'&&<button onClick={()=>setQuotes(list=>list.map(x=>x.id===q.id?{...x,status:'accepted'}:x))} className="w-full py-1.5 bg-[#6366f1] text-white text-sm font-bold rounded-xl">Send Quote</button>}</Card>))}</div>
    </div>
  );
}

function DocumentsPage() {
  const [docs, setDocs] = useState([{id:1,shipment:'Mumbai → Dubai',type:'Bill of Lading',uploaded:false,file:null},{id:2,shipment:'Delhi → London',type:'Airway Bill',uploaded:true,file:'AWB-20240112.pdf'},{id:3,shipment:'Mumbai → Dubai',type:'Shipping Invoice',uploaded:false,file:null},{id:4,shipment:'Chennai → Singapore',type:'Customs Clearance',uploaded:true,file:'CC-20240110.pdf'},{id:5,shipment:'Delhi → London',type:'Packing List',uploaded:false,file:null}]);
  const upload = id => setDocs(d=>d.map(doc=>doc.id===id?{...doc,uploaded:true,file:`${doc.type.replace(/ /g,'-')}-${Date.now()}.pdf`}:doc));
  const ICONS = {'Bill of Lading':'🚢','Airway Bill':'✈️','Shipping Invoice':'🧾','Customs Clearance':'🛃','Packing List':'📋'};
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📄 Document Management</h1>
      <div className="grid grid-cols-3 gap-3">{[{l:'Total',v:docs.length,c:'text-white'},{l:'Uploaded',v:docs.filter(d=>d.uploaded).length,c:'text-green-400'},{l:'Pending',v:docs.filter(d=>!d.uploaded).length,c:'text-yellow-400'}].map(s=>(<Card key={s.l} className="text-center py-2"><p className={`text-xl font-bold ${s.c}`}>{s.v}</p><p className="text-[#a8b2d8] text-xs">{s.l}</p></Card>))}</div>
      <div className="space-y-3">{docs.map(d=>(<Card key={d.id}><div className="flex items-start gap-3"><span className="text-2xl">{ICONS[d.type]||'📄'}</span><div className="flex-1"><p className="text-white font-bold text-sm">{d.type}</p><p className="text-[#a8b2d8] text-xs">{d.shipment}</p>{d.file&&<p className="text-[#6366f1] text-xs mt-1">📎 {d.file}</p>}</div>{d.uploaded?<span className="text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded-full">✓ Uploaded</span>:<button onClick={()=>upload(d.id)} className="text-xs px-3 py-1.5 bg-[#6366f1] text-white rounded-lg">Upload</button>}</div></Card>))}</div>
    </div>
  );
}

function PickupPage() {
  const [pickups, setPickups] = useState([{id:1,exporter:'Ravi Exports',product:'Basmati Rice 500kg',pickupDate:'',warehouse:'',vehicle:'',confirmed:false},{id:2,exporter:'Sun Traders',product:'Spices 200kg',pickupDate:'2024-01-20',warehouse:'ICD Patparganj, Delhi',vehicle:'MH-04-AB-1234 (Tata 407)',confirmed:true}]);
  const upd = (id,f,v) => setPickups(l=>l.map(p=>p.id===id?{...p,[f]:v}:p));
  const confirm = id => setPickups(l=>l.map(p=>p.id===id?{...p,confirmed:true}:p));
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📅 Pickup Scheduling</h1>
      <div className="space-y-4">{pickups.map(p=>(<Card key={p.id}><div className="flex justify-between gap-3 mb-3"><div><p className="text-white font-bold text-sm">{p.exporter}</p><p className="text-[#a8b2d8] text-xs">📦 {p.product}</p></div><span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.confirmed?'bg-green-400/10 text-green-400':'bg-yellow-400/10 text-yellow-400'}`}>{p.confirmed?'✓ Confirmed':'Pending'}</span></div>{!p.confirmed?(<div className="space-y-3 border-t border-white/5 pt-3"><div><label className="text-[#a8b2d8] text-xs mb-1 block">Pickup Date</label><input type="date" value={p.pickupDate} onChange={e=>upd(p.id,'pickupDate',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]"/></div><div><label className="text-[#a8b2d8] text-xs mb-1 block">Warehouse</label><input value={p.warehouse} onChange={e=>upd(p.id,'warehouse',e.target.value)} placeholder="e.g. ICD Tughlakabad" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]"/></div><div><label className="text-[#a8b2d8] text-xs mb-1 block">Vehicle</label><input value={p.vehicle} onChange={e=>upd(p.id,'vehicle',e.target.value)} placeholder="e.g. MH-04-AB-1234" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]"/></div><button onClick={()=>confirm(p.id)} className="w-full py-2.5 bg-[#6366f1] text-white font-bold rounded-xl">Confirm Pickup</button></div>):(<div className="space-y-1.5 border-t border-white/5 pt-3">{[['Date',new Date(p.pickupDate).toLocaleDateString('en-IN')],['Warehouse',p.warehouse],['Vehicle',p.vehicle]].map(([k,v])=>(<div key={k} className="flex gap-2"><span className="text-[#a8b2d8] text-xs w-20">{k}:</span><span className="text-white text-xs">{v}</span></div>))}</div>)}</Card>))}</div>
    </div>
  );
}

export default function ForwarderDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route index element={<ForwarderHome />} />
        <Route path="dashboard" element={<ForwarderHome />} />
        <Route path="shipments" element={<ShipmentsPage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="chat" element={<ChatPage userRole="forwarder" />} />
        <Route path="pickup" element={<PickupPage />} />
        <Route path="chat" element={<ChatPage userRole="forwarder" />} />
      </Routes>
    </DashboardLayout>
  );
}
