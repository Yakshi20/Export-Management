import { useState, useEffect, useRef } from 'react';
import Card from '../../components/ui/Card';

const AI_ANSWERS = {
  'iec': 'IEC (Import Export Code) is a 10-digit code issued by DGFT. Apply at dgft.gov.in. Required documents: PAN card, bank certificate, address proof. Processing time: 2-3 working days.',
  'gst': 'For exports, GST rate is 0% (zero-rated). You can claim GST refund on inputs used for export. File GSTR-1 and GSTR-3B monthly. Refund processed within 60 days.',
  'document': 'Required export documents: 1) Commercial Invoice 2) Packing List 3) Bill of Lading/Airway Bill 4) Certificate of Origin 5) Shipping Bill 6) Letter of Credit (if applicable) 7) Insurance Certificate.',
  'shipping': 'Export shipping process: 1) Book freight with forwarder 2) Pack & label goods 3) Get CHA to file Shipping Bill 4) Customs examination 5) Let Export Order (LEO) 6) Goods loaded on vessel 7) Get Bill of Lading.',
  'tax': 'Export tax benefits: 1) GST refund on inputs 2) Duty Drawback scheme 3) RoDTEP scheme 4) Advance Authorization scheme 5) MEIS/SEIS benefits. Consult a tax adviser for specifics.',
  'restriction': 'Restricted export items in India: 1) Weapons & ammunition 2) Wildlife products 3) Antiques 4) Certain chemicals 5) Some agricultural products need APEDA approval. Check DGFT website for full list.',
  'customs': 'Customs process: File Shipping Bill → Customs examination (may be waived for trusted exporters) → Out of Charge order → Let Export Order → Goods move to port. CHA handles this for you.',
  'lc': 'Letter of Credit (LC): A bank guarantee from buyer\'s bank. Types: Sight LC (pay on presentation), Usance LC (pay after X days), Confirmed LC (safer). Always insist on LC for new buyers.',
  'incoterms': 'Common Incoterms: FOB (Free On Board) - seller delivers to port. CIF (Cost Insurance Freight) - seller pays freight+insurance. EXW (Ex Works) - buyer arranges everything. DDP - seller delivers to buyer door.',
  'default': 'I can answer questions about: IEC code, GST refunds, export documents, shipping process, tax benefits, customs, restricted items, Letter of Credit, Incoterms. Type your question!',
};

function getAIReply(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('iec') || lower.includes('import export code')) return AI_ANSWERS.iec;
  if (lower.includes('gst') || lower.includes('tax refund')) return AI_ANSWERS.gst;
  if (lower.includes('document') || lower.includes('docs') || lower.includes('certificate')) return AI_ANSWERS.document;
  if (lower.includes('ship') && lower.includes('process')) return AI_ANSWERS.shipping;
  if (lower.includes('tax') || lower.includes('benefit') || lower.includes('drawback')) return AI_ANSWERS.tax;
  if (lower.includes('restrict') || lower.includes('banned') || lower.includes('prohibited')) return AI_ANSWERS.restriction;
  if (lower.includes('customs') || lower.includes('clearance') || lower.includes('cha')) return AI_ANSWERS.customs;
  if (lower.includes('lc') || lower.includes('letter of credit')) return AI_ANSWERS.lc;
  if (lower.includes('incoterm') || lower.includes('fob') || lower.includes('cif')) return AI_ANSWERS.incoterms;
  return AI_ANSWERS.default;
}

const CONTACTS = [
  { id: 'ai', name: 'AI Export Assistant', role: 'assistant', avatar: '🤖', online: true, tag: 'AI' },
  { id: 'ship1', name: 'Shipment #EXP102', role: 'shipment', avatar: '🚢', online: true, tag: 'Shipment', sub: 'Mumbai → Dubai' },
  { id: 'ship2', name: 'Shipment #EXP098', role: 'shipment', avatar: '✈️', online: false, tag: 'Shipment', sub: 'Delhi → London' },
  { id: 'buyer1', name: 'Ahmed Al-Rashid', role: 'buyer', avatar: '🧑‍💼', online: true, tag: 'Buyer', sub: 'Dubai, UAE' },
  { id: 'buyer2', name: 'Wang Li', role: 'buyer', avatar: '👩‍💼', online: false, tag: 'Buyer', sub: 'Shanghai, China' },
  { id: 'forwarder1', name: 'RapidFreight Pvt Ltd', role: 'forwarder', avatar: '🚚', online: true, tag: 'Forwarder' },
  { id: 'adviser1', name: 'Priya Sharma', role: 'adviser', avatar: '👩‍⚖️', online: true, tag: 'Adviser' },
  { id: 'farmer1', name: 'Ravi Kumar (Farmer)', role: 'farmer', avatar: '🌾', online: false, tag: 'Farmer', sub: 'Punjab, India' },
];

const DEMO_MSGS = {
  ai: [{ id: 1, from: 'them', text: 'Hello! I am your AI Export Assistant. Ask me anything about export procedures, documents, taxes, or shipping!', time: '09:00', type: 'text' }],
  ship1: [
    { id: 1, from: 'them', text: 'Shipment #EXP102 created. Mumbai → Dubai. 500kg Basmati Rice.', time: '10:00', type: 'text' },
    { id: 2, from: 'me', text: 'Has customs clearance been done?', time: '10:05', type: 'text' },
    { id: 3, from: 'them', text: 'Yes, Let Export Order received. Goods loading on vessel tonight.', time: '10:10', type: 'text' },
  ],
  buyer1: [
    { id: 1, from: 'them', text: 'Hello, we are interested in 5 tonnes of Basmati Rice. Can you share your price list?', time: '08:30', type: 'text' },
    { id: 2, from: 'me', text: 'Sure! Our current FOB price is ₹85/kg for Grade A Basmati.', time: '08:35', type: 'text' },
    { id: 3, from: 'them', text: 'Can you send the Certificate of Origin and quality report?', time: '08:40', type: 'text' },
  ],
  buyer2: [
    { id: 1, from: 'them', text: '你好！我们需要500公斤棉花。[Auto-translated: Hello! We need 500kg of cotton.]', time: '11:00', type: 'text', translated: true },
  ],
  forwarder1: [
    { id: 1, from: 'them', text: 'Hello! We have received your shipment booking. Pickup scheduled for tomorrow 10 AM.', time: '14:00', type: 'text' },
    { id: 2, from: 'them', text: '', time: '14:05', type: 'doc', docName: 'Freight_Quote_EXP102.pdf', docSize: '145 KB' },
  ],
  adviser1: [
    { id: 1, from: 'them', text: 'Hi! I reviewed your export plan. You need to register under APEDA for agricultural exports.', time: '16:00', type: 'text' },
  ],
  farmer1: [],
  ship2: [{ id: 1, from: 'them', text: 'Shipment #EXP098 — Delhi to London. 200kg Spices. Airway Bill: AWB-20240112.', time: '09:30', type: 'text' }],
};

const ROLE_COLOR = { buyer: 'bg-blue-400/10 text-blue-400', forwarder: 'bg-purple-400/10 text-purple-400', adviser: 'bg-yellow-400/10 text-yellow-400', farmer: 'bg-green-400/10 text-green-400', shipment: 'bg-orange-400/10 text-orange-400', assistant: 'bg-[#6366f1]/10 text-[#6366f1]' };

const DOCS = ['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Bill of Lading', 'Shipping Bill', 'Quality Report', 'Insurance Certificate'];

export default function ChatPage({ userRole = 'exporter' }) {
  const [activeId, setActiveId] = useState('ai');
  const [chats, setChats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('chatMessages') || 'null') || DEMO_MSGS; } catch { return DEMO_MSGS; }
  });
  const [input, setInput] = useState('');
  const [translate, setTranslate] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showAIQuick, setShowAIQuick] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const active = CONTACTS.find(c => c.id === activeId);
  const messages = chats[activeId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeId]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chats));
  }, [chats]);

  const send = (text, type = 'text', extra = {}) => {
    if (!text.trim() && type === 'text') return;
    const msg = { id: Date.now(), from: 'me', text, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), type, ...extra };
    const updated = { ...chats, [activeId]: [...(chats[activeId] || []), msg] };
    setChats(updated);
    setInput('');
    setShowDocs(false);
    setShowAIQuick(false);

    if (activeId === 'ai') {
      setTyping(true);
      setTimeout(() => {
        const reply = { id: Date.now() + 1, from: 'them', text: getAIReply(text), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), type: 'text' };
        setChats(prev => ({ ...prev, ai: [...(prev.ai || []), reply] }));
        setTyping(false);
      }, 1200);
    }
  };

  const sendDoc = (docName) => {
    send('', 'doc', { docName, docSize: `${Math.floor(Math.random() * 900 + 100)} KB` });
  };

  const sendVoice = () => {
    const dur = Math.floor(Math.random() * 30 + 5);
    send('', 'voice', { duration: `0:${dur.toString().padStart(2, '0')}` });
  };

  const filtered = CONTACTS.filter(c => {
    const matchFilter = filter === 'All' || c.role === filter.toLowerCase() || (filter === 'Shipments' && c.role === 'shipment');
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const QUICK_Q = ['What documents do I need?', 'How does customs work?', 'What is IEC code?', 'How to get GST refund?', 'What are Incoterms?', 'What items are restricted?'];

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-3 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2 overflow-hidden">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search contacts..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
        <div className="flex gap-1 flex-wrap">
          {['All', 'Buyer', 'Forwarder', 'Adviser', 'Farmer', 'Shipments'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`text-xs px-2 py-1 rounded-full font-semibold transition-all ${filter === f ? 'bg-[#6366f1] text-white' : 'bg-white/5 text-[#a8b2d8]'}`}>{f}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filtered.map(c => {
            const msgs = chats[c.id] || [];
            const last = msgs[msgs.length - 1];
            const unread = msgs.filter(m => m.from === 'them').length;
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full text-left p-2.5 rounded-xl transition-all ${activeId === c.id ? 'bg-[#6366f1]/20 border border-[#6366f1]/40' : 'bg-white/5 hover:bg-white/10'}`}>
                <div className="flex items-center gap-2">
                  <div className="relative flex-shrink-0">
                    <span className="text-xl">{c.avatar}</span>
                    {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-[#1a1a2e]"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-xs font-bold truncate">{c.name}</p>
                      {unread > 0 && activeId !== c.id && <span className="bg-[#6366f1] text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0">{unread}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${ROLE_COLOR[c.role]}`}>{c.tag}</span>
                      {c.sub && <span className="text-[#a8b2d8] text-xs truncate">{c.sub}</span>}
                    </div>
                    {last && <p className="text-[#a8b2d8] text-xs truncate mt-0.5">{last.type === 'doc' ? '📎 ' + last.docName : last.type === 'voice' ? '🎤 Voice note' : last.text}</p>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white/3 rounded-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{active?.avatar}</span>
            <div>
              <p className="text-white font-bold text-sm">{active?.name}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${ROLE_COLOR[active?.role]}`}>{active?.tag}</span>
                <span className={`text-xs ${active?.online ? 'text-green-400' : 'text-[#a8b2d8]'}`}>{active?.online ? '● Online' : '○ Offline'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTranslate(!translate)} className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${translate ? 'bg-blue-400/20 text-blue-400 border-blue-400/30' : 'bg-white/5 text-[#a8b2d8] border-white/10'}`}>
              🌐 {translate ? 'Auto-Translate ON' : 'Translate'}
            </button>
            {activeId === 'ai' && (
              <button onClick={() => setShowAIQuick(!showAIQuick)} className="text-xs px-3 py-1.5 rounded-full font-semibold bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20">
                ⚡ Quick Questions
              </button>
            )}
          </div>
        </div>

        {/* Quick Questions */}
        {showAIQuick && (
          <div className="px-4 py-2 border-b border-white/10 flex gap-2 flex-wrap bg-white/5 flex-shrink-0">
            {QUICK_Q.map(q => (
              <button key={q} onClick={() => { send(q); setShowAIQuick(false); }} className="text-xs px-3 py-1.5 bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 rounded-full hover:bg-[#6366f1]/20 transition-all">{q}</button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">{active?.avatar}</p>
              <p className="text-white font-bold">{active?.name}</p>
              <p className="text-[#a8b2d8] text-sm mt-1">Start a conversation</p>
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-sm ${m.from === 'me' ? 'bg-[#6366f1] text-white' : 'bg-white/10 text-white'} rounded-2xl px-4 py-2.5 ${m.from === 'me' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                {m.translated && <p className="text-xs opacity-70 mb-1">🌐 Auto-translated</p>}
                {m.type === 'text' && <p className="text-sm leading-relaxed">{m.text}</p>}
                {m.type === 'doc' && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📎</span>
                    <div>
                      <p className="text-sm font-bold">{m.docName}</p>
                      <p className="text-xs opacity-70">{m.docSize}</p>
                    </div>
                    <button className="ml-2 text-xs underline opacity-80">Download</button>
                  </div>
                )}
                {m.type === 'voice' && (
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">▶</button>
                    <div className="flex-1">
                      <div className="flex gap-0.5 items-center h-6">{Array.from({length:20}).map((_, i) => (<div key={i} className="w-0.5 bg-white/60 rounded-full" style={{height:`${Math.random()*100}%`}}></div>))}</div>
                    </div>
                    <span className="text-xs opacity-70">{m.duration}</span>
                  </div>
                )}
                <p className={`text-xs mt-1 ${m.from === 'me' ? 'text-white/60 text-right' : 'text-white/50'}`}>{m.time}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">{[0,1,2].map(i => (<div key={i} className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}></div>))}</div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Doc Picker */}
        {showDocs && (
          <div className="px-4 py-2 border-t border-white/10 bg-white/5 flex-shrink-0">
            <p className="text-[#a8b2d8] text-xs mb-2">Select document to share:</p>
            <div className="flex gap-2 flex-wrap">
              {DOCS.map(d => (
                <button key={d} onClick={() => sendDoc(d)} className="text-xs px-3 py-1.5 bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-all">📎 {d}</button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
          <div className="flex gap-2 items-center">
            <button onClick={() => { setShowDocs(!showDocs); setShowAIQuick(false); }} className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${showDocs ? 'bg-[#6366f1] text-white' : 'bg-white/5 text-[#a8b2d8] hover:bg-white/10'}`} title="Share document">📎</button>
            <button onClick={sendVoice} className="p-2.5 rounded-xl bg-white/5 text-[#a8b2d8] hover:bg-white/10 transition-all flex-shrink-0" title="Send voice note">🎤</button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder={activeId === 'ai' ? 'Ask about export docs, shipping, GST...' : `Message ${active?.name}...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366f1] placeholder:text-[#a8b2d8]"
            />
            <button onClick={() => send(input)} disabled={!input.trim()} className="p-2.5 rounded-xl bg-[#6366f1] text-white hover:bg-[#5254cc] transition-all flex-shrink-0 disabled:opacity-40">➤</button>
          </div>
          {translate && <p className="text-xs text-blue-400 mt-1.5">🌐 Auto-translation is ON — messages will be translated automatically</p>}
        </div>
      </div>
    </div>
  );
}
