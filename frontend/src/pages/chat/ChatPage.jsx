import { useState, useEffect, useRef } from 'react';

const CONTACTS = [
  { id: 'ai', name: 'AI Export Assistant', role: 'ai', online: true, avatar: '🤖', last: 'Ask me anything about exports!' },
  { id: 'ship1', name: 'Shipment #SHP-2024-01', role: 'shipment', online: true, avatar: '🚢', last: 'Status: In Transit — Dubai Hub' },
  { id: 'ship2', name: 'Shipment #SHP-2024-02', role: 'shipment', online: false, avatar: '📦', last: 'Status: Customs — Singapore' },
  { id: 'buyer1', name: 'Ahmed Al-Rashid', role: 'buyer', online: true, avatar: '🏢', last: 'Please send the packing list' },
  { id: 'buyer2', name: 'Sarah Johnson', role: 'buyer', online: false, avatar: '🏢', last: 'When will shipment arrive?' },
  { id: 'forwarder1', name: 'FastShip Logistics', role: 'forwarder', online: true, avatar: '🚚', last: 'Pickup confirmed for tomorrow' },
  { id: 'adviser1', name: 'CA Ravi Sharma', role: 'adviser', online: false, avatar: '👨‍💼', last: 'GST refund filed successfully' },
  { id: 'farmer1', name: 'Punjab Agri Farms', role: 'farmer', online: true, avatar: '🌾', last: 'New crop batch ready — 500kg' },
];

const AI_ANSWERS = {
  iec: 'IEC (Import Export Code) is a 10-digit code issued by DGFT. Apply at dgft.gov.in with PAN, Aadhaar, bank certificate, and address proof. Cost: ₹500, issued within 2 working days.',
  gst: 'For exports, GST is zero-rated. File GSTR-1 with export invoices, then claim refund via GSTR-3B. Refund typically processed within 60 days. Use LUT (Letter of Undertaking) to export without paying IGST.',
  document: 'Key export documents: 1) Commercial Invoice 2) Packing List 3) Shipping Bill 4) Bill of Lading/Airway Bill 5) Certificate of Origin 6) IEC Certificate 7) GST Invoice. Always keep copies of all documents.',
  shipping: 'Shipping options: Sea freight (cheaper, 15-30 days), Air freight (faster, 2-5 days, 4x costlier). For perishables use air or reefer containers. Book 2-3 weeks in advance for sea freight.',
  tax: 'Export benefits: 1) Zero GST on exports 2) IGST refund within 60 days 3) Duty drawback on inputs 4) MEIS/RoDTEP incentives 5) No customs duty on exports. Consult a CA for maximizing benefits.',
  restriction: 'Restricted exports require special licenses: arms, chemicals, wildlife, some agricultural products. Check DGFT notification list. Most agricultural products need APEDA registration.',
  customs: 'Customs process: File Shipping Bill on ICEGATE → Port examination (if selected) → Let Export Order → Hand over to carrier. Use CHA (Custom House Agent) for hassle-free clearance.',
  lc: "Letter of Credit (LC) is safest payment for exports. Buyer's bank issues LC → Your bank confirms → Ship goods → Submit documents to bank → Get payment. Always check LC terms before shipping.",
  incoterms: "Common Incoterms: FOB (you pay till port, buyer pays freight), CIF (you pay freight+insurance), EXW (buyer collects from your factory), DDP (you deliver to buyer's door). FOB is most common for India.",
};

const ROLE_COLOR = {
  ai: 'bg-purple-500/20 text-purple-300',
  shipment: 'bg-blue-500/20 text-blue-300',
  buyer: 'bg-green-500/20 text-green-300',
  forwarder: 'bg-orange-500/20 text-orange-300',
  adviser: 'bg-yellow-500/20 text-yellow-300',
  farmer: 'bg-emerald-500/20 text-emerald-300',
};

const ROLE_FILTER = ['All', 'Buyer', 'Forwarder', 'Adviser', 'Farmer', 'Shipments'];
const DOC_TYPES = ['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Bill of Lading', 'Shipping Bill', 'IEC Certificate', 'GST Invoice'];

function getAIReply(msg) {
  const m = msg.toLowerCase();
  for (const [key, answer] of Object.entries(AI_ANSWERS)) {
    if (m.includes(key)) return answer;
  }
  return "I can help with IEC, GST, export documents, shipping, tax benefits, customs, LC, and Incoterms. What would you like to know?";
}

function initChats() {
  const saved = localStorage.getItem('exportChats');
  if (saved) return JSON.parse(saved);
  const initial = {};
  CONTACTS.forEach(c => {
    initial[c.id] = c.last ? [{ id: Date.now() + Math.random(), from: 'them', type: 'text', text: c.last, time: new Date().toISOString() }] : [];
  });
  return initial;
}

export default function ChatPage({ userRole = 'exporter' }) {
  const [chats, setChats] = useState(initChats);
  const [active, setActive] = useState(CONTACTS[0]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [translate, setTranslate] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { localStorage.setItem('exportChats', JSON.stringify(chats)); }, [chats]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chats, active]);

  const addMessage = (contactId, msg) => setChats(prev => ({ ...prev, [contactId]: [...(prev[contactId] || []), msg] }));

  const sendText = () => {
    if (!input.trim()) return;
    const msg = { id: Date.now(), from: 'me', type: 'text', text: input, time: new Date().toISOString() };
    addMessage(active.id, msg);
    const userMsg = input;
    setInput('');
    if (active.id === 'ai') {
      setTyping(true);
      setTimeout(() => { setTyping(false); addMessage('ai', { id: Date.now(), from: 'them', type: 'text', text: getAIReply(userMsg), time: new Date().toISOString() }); }, 1200);
    } else if (active.online) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const replies = ["Got it, thanks!", "Sure, I'll check and get back.", 'Understood. Will update shortly.', 'Thanks for the update!', 'Noted.'];
        addMessage(active.id, { id: Date.now(), from: 'them', type: 'text', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toISOString() });
      }, 1500 + Math.random() * 1000);
    }
  };

  const sendDoc = (docType) => {
    addMessage(active.id, { id: Date.now(), from: 'me', type: 'doc', text: docType, file: `${docType.replace(/ /g, '_')}.pdf`, time: new Date().toISOString() });
    setShowDocs(false);
    if (active.id === 'ai') setTimeout(() => addMessage('ai', { id: Date.now(), from: 'them', type: 'text', text: `I've received your ${docType}. I can help verify the details if needed.`, time: new Date().toISOString() }), 1000);
  };

  const sendVoice = () => {
    addMessage(active.id, { id: Date.now(), from: 'me', type: 'voice', duration: `${(2 + Math.random() * 8).toFixed(1)}s`, time: new Date().toISOString() });
  };

  const filteredContacts = CONTACTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || c.role === roleFilter.toLowerCase() || (roleFilter === 'Shipments' && c.role === 'shipment');
    return matchSearch && matchRole;
  });

  const unread = (id) => (chats[id] || []).filter(m => m.from === 'them').length;

  return (
    <div className="flex h-[calc(100vh-120px)] bg-[#0f0f23] rounded-2xl overflow-hidden border border-white/10">
      <div className="w-72 flex-shrink-0 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-white font-bold text-lg mb-3">💬 Messages</h2>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
          <div className="flex gap-1 mt-2 flex-wrap">
            {ROLE_FILTER.map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-all ${roleFilter === r ? 'bg-[#6366f1] text-white' : 'bg-white/5 text-[#a8b2d8] hover:bg-white/10'}`}>{r}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(c => (
            <button key={c.id} onClick={() => setActive(c)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-all ${active.id === c.id ? 'bg-[#6366f1]/10 border-l-2 border-l-[#6366f1]' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <span className="text-2xl">{c.avatar}</span>
                  {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0f0f23]"></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-semibold truncate">{c.name}</p>
                    {unread(c.id) > 0 && <span className="bg-[#6366f1] text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0">{unread(c.id)}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${ROLE_COLOR[c.role] || 'bg-white/10 text-white'}`}>{c.role}</span>
                    <p className="text-[#a8b2d8] text-xs truncate">{(chats[c.id] || []).slice(-1)[0]?.text?.slice(0, 30) || c.last?.slice(0, 30)}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0f0f23]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{active.avatar}</span>
            <div>
              <p className="text-white font-bold text-sm">{active.name}</p>
              <p className={`text-xs ${active.online ? 'text-green-400' : 'text-[#a8b2d8]'}`}>{active.online ? '● Online' : '○ Offline'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAI(!showAI)} className="text-xs px-3 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg font-semibold hover:bg-purple-500/20 transition-all">🤖 AI Help</button>
            <button onClick={() => setTranslate(!translate)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all ${translate ? 'bg-[#6366f1] text-white border-[#6366f1]' : 'bg-white/5 text-[#a8b2d8] border-white/10 hover:bg-white/10'}`}>🌐 Translate</button>
          </div>
        </div>

        {showAI && (
          <div className="px-4 py-2 bg-purple-500/5 border-b border-purple-500/20">
            <p className="text-purple-300 text-xs font-semibold mb-2">Quick AI Questions:</p>
            <div className="flex gap-2 flex-wrap">
              {['What is IEC?', 'GST on exports?', 'Required documents?', 'Shipping options?', 'Export tax benefits?'].map(q => (
                <button key={q} onClick={() => { setInput(q); setShowAI(false); setActive(CONTACTS[0]); }}
                  className="text-xs px-2 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all">{q}</button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {(chats[active.id] || []).map(msg => (
            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
                {msg.type === 'text' && (
                  <div className={`px-4 py-2 rounded-2xl text-sm ${msg.from === 'me' ? 'bg-[#6366f1] text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                    {translate && msg.from === 'them' ? <><span className="text-xs text-[#a8b2d8] block mb-1">🌐 Translated</span>{msg.text}</> : msg.text}
                  </div>
                )}
                {msg.type === 'doc' && (
                  <div className={`px-4 py-2 rounded-2xl ${msg.from === 'me' ? 'bg-[#6366f1]/80 text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                    <div className="flex items-center gap-2"><span className="text-lg">📎</span><div><p className="text-xs font-semibold">{msg.text}</p><p className="text-xs opacity-70">{msg.file}</p></div></div>
                  </div>
                )}
                {msg.type === 'voice' && (
                  <div className={`px-4 py-2 rounded-2xl ${msg.from === 'me' ? 'bg-[#6366f1]/80 text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                    <div className="flex items-center gap-2"><span>🎤</span><div className="flex gap-0.5 items-center">{Array.from({ length: 20 }).map((_, i) => <div key={i} className="w-0.5 rounded-full bg-current opacity-70" style={{ height: `${4 + Math.random() * 16}px` }}></div>)}</div><span className="text-xs opacity-70">{msg.duration}</span></div>
                  </div>
                )}
                <span className="text-[#a8b2d8] text-xs">{new Date(msg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-[#a8b2d8] rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }}></div>)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showDocs && (
          <div className="px-4 py-3 border-t border-white/10 bg-white/5">
            <p className="text-[#a8b2d8] text-xs font-semibold mb-2">Select document to share:</p>
            <div className="flex gap-2 flex-wrap">
              {DOC_TYPES.map(d => <button key={d} onClick={() => sendDoc(d)} className="text-xs px-3 py-1.5 bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 rounded-lg hover:bg-[#6366f1]/20 transition-all">{d}</button>)}
            </div>
          </div>
        )}

        <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2">
          <button onClick={() => setShowDocs(!showDocs)} className="p-2 text-[#a8b2d8] hover:text-white hover:bg-white/10 rounded-xl transition-all text-lg">📎</button>
          <button onClick={sendVoice} className="p-2 text-[#a8b2d8] hover:text-white hover:bg-white/10 rounded-xl transition-all text-lg">🎤</button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendText()}
            placeholder={active.id === 'ai' ? 'Ask the AI assistant...' : `Message ${active.name}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366f1] placeholder-[#a8b2d8]" />
          <button onClick={sendText} disabled={!input.trim()} className="p-2.5 bg-[#6366f1] text-white rounded-xl hover:bg-[#5254cc] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
