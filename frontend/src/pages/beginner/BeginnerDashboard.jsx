import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { label: 'Home', path: '/beginner/dashboard', icon: '🏠', end: true },
  { label: 'Guide', path: '/beginner/guide', icon: '📘' },
  { label: 'Demand', path: '/beginner/demand', icon: '🌍' },
  { label: 'Calculator', path: '/beginner/calculator', icon: '🧮' },
  { label: 'Rules', path: '/beginner/rules', icon: '📋' },
];

const GUIDE_STEPS = [
  { step: 1, icon: '🏢', title: 'Register Your Business', desc: 'Get your business registered under GST and obtain a PAN card. This is the foundation for all export activities.', docs: ['GST Registration', 'PAN Card', 'Business Registration Certificate'] },
  { step: 2, icon: '🔑', title: 'Obtain IEC Code', desc: 'Import Export Code (IEC) is mandatory for every exporter. Apply online at DGFT portal — takes 2-3 working days.', docs: ['IEC Application Form (ANF 2A)', 'Bank Certificate', 'PAN Card'] },
  { step: 3, icon: '🏦', title: 'Open a Current Account', desc: 'Open a current account with a bank authorized to deal in foreign exchange (AD Category I bank).', docs: ['AD Code Registration', 'Bank Account Proof'] },
  { step: 4, icon: '📦', title: 'Find Your Product & HS Code', desc: 'Identify the product you want to export and its Harmonized System (HS) Code used for customs classification worldwide.', docs: ['Product Catalogue', 'HS Code List'] },
  { step: 5, icon: '🤝', title: 'Find a Buyer', desc: 'Register on trade portals like IndiaMART, TradeIndia, Alibaba. Attend trade fairs and use FIEO/APEDA networks.', docs: ['Buyer-Seller Agreement', 'Proforma Invoice'] },
  { step: 6, icon: '📃', title: 'Prepare Export Documents', desc: 'Generate required shipping documents: Commercial Invoice, Packing List, Certificate of Origin, Bill of Lading.', docs: ['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Bill of Lading / Airway Bill'] },
  { step: 7, icon: '🛳️', title: 'Customs Clearance', desc: 'File Shipping Bill on ICEGATE portal. Your Customs House Agent (CHA) handles this. Goods are examined and let out.', docs: ['Shipping Bill', 'ARE-1 Form', 'RCMC Certificate'] },
  { step: 8, icon: '💰', title: 'Receive Payment & Claim Incentives', desc: 'Receive payment via LC, TT, or DP. Claim GST refund, Duty Drawback, and RoDTEP incentives.', docs: ['Bank Realization Certificate (BRC)', 'FIRA', 'Drawback Claim Form'] },
];

function ExportGuidePage() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📘 Step-by-Step Export Guide</h1>
      <p className="text-[#a8b2d8] text-sm">Follow these 8 steps to start your export journey from India.</p>
      <div className="space-y-3">
        {GUIDE_STEPS.map(s => (
          <div key={s.step} className="bg-[#16213e] border border-white/10 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(open === s.step ? null : s.step)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-all">
              <span className="w-8 h-8 rounded-full bg-[#6366f1]/20 text-[#6366f1] font-bold text-sm flex items-center justify-center flex-shrink-0">{s.step}</span>
              <span className="text-xl">{s.icon}</span>
              <span className="text-white font-semibold text-sm flex-1">{s.title}</span>
              <span className="text-[#6366f1] text-lg">{open === s.step ? '▾' : '›'}</span>
            </button>
            {open === s.step && (
              <div className="px-5 pb-5 space-y-3 border-t border-white/5">
                <p className="text-[#a8b2d8] text-sm pt-3">{s.desc}</p>
                <p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-2">Documents Needed</p>
                <div className="flex flex-wrap gap-2">
                  {s.docs.map(d => <span key={d} className="text-xs px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#a8b2d8] border border-[#6366f1]/20">{d}</span>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const DEMAND_DATA = {
  'Basmati Rice': { countries: ['Saudi Arabia', 'UAE', 'USA', 'UK', 'Iran'], hsCode: '1006.30', trend: 'up', note: 'High demand in Middle East & diaspora markets' },
  'Spices (Turmeric, Cumin)': { countries: ['USA', 'UK', 'Germany', 'Malaysia', 'Bangladesh'], hsCode: '0910', trend: 'upup', note: 'Growing health food trend globally' },
  'Cotton Yarn': { countries: ['China', 'Bangladesh', 'Vietnam', 'Turkey', 'Indonesia'], hsCode: '5205', trend: 'flat', note: 'Steady demand from textile hubs' },
  'Leather Goods': { countries: ['USA', 'Germany', 'France', 'Italy', 'Japan'], hsCode: '4202', trend: 'up', note: 'Premium segment growing post-COVID' },
  'Pharmaceutical Drugs': { countries: ['USA', 'UK', 'South Africa', 'Russia', 'Nigeria'], hsCode: '3004', trend: 'upup', note: 'India is global pharmacy hub' },
  'Fresh Mangoes': { countries: ['UAE', 'UK', 'Germany', 'USA', 'Canada'], hsCode: '0804.50', trend: 'up', note: 'Peak demand Apr-Jun, Alphonso preferred' },
  'Engineering Goods': { countries: ['USA', 'Germany', 'UAE', 'Singapore', 'Japan'], hsCode: '84-85', trend: 'up', note: 'Strong demand for auto & industrial parts' },
  'Gems & Jewellery': { countries: ['USA', 'UAE', 'Hong Kong', 'Belgium', 'Singapore'], hsCode: '7108', trend: 'upup', note: 'India accounts for 15% global share' },
  'Onions': { countries: ['Malaysia', 'Sri Lanka', 'Bangladesh', 'Nepal', 'UAE'], hsCode: '0703.10', trend: 'down', note: 'Seasonal, subject to export restrictions' },
  'Software & IT Services': { countries: ['USA', 'UK', 'Australia', 'Canada', 'Germany'], hsCode: 'Service Export', trend: 'upup', note: 'Fastest growing export category' },
};
const TREND_COLOR = { upup: 'text-green-400', up: 'text-green-300', flat: 'text-yellow-400', down: 'text-red-400' };
const TREND_LABEL = { upup: 'Rising Fast', up: 'Growing', flat: 'Stable', down: 'Declining' };

function DemandCheckerPage() {
  const [selected, setSelected] = useState('');
  const data = DEMAND_DATA[selected];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">🌍 Product Demand Checker</h1>
      <p className="text-[#a8b2d8] text-sm">Find which countries are buying what India exports most.</p>
      <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full bg-[#16213e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6366f1]">
        <option value="">-- Choose a product --</option>
        {Object.keys(DEMAND_DATA).map(p => <option key={p}>{p}</option>)}
      </select>
      {data ? (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-white font-bold text-base">{selected}</p><p className="text-[#a8b2d8] text-xs mt-0.5">HS Code: {data.hsCode}</p></div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/5 ${TREND_COLOR[data.trend]}`}>{TREND_LABEL[data.trend]}</span>
          </div>
          <p className="text-[#a8b2d8] text-sm mb-4">{data.note}</p>
          <p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-2">Top Importing Countries</p>
          <div className="flex flex-wrap gap-2">
            {data.countries.map((c, i) => (
              <span key={c} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${i === 0 ? 'bg-[#6366f1] text-white' : 'bg-[#6366f1]/10 text-[#a8b2d8] border border-[#6366f1]/20'}`}>
                {i === 0 ? '🏆 ' : ''}{c}
              </span>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="text-center py-10"><div className="text-4xl mb-3">🔍</div><p className="text-[#a8b2d8] text-sm">Select a product above to see global demand data</p></Card>
      )}
    </div>
  );
}

function CalculatorPage() {
  const [form, setForm] = useState({ productCost: '', quantity: '', packagingCost: '', freightCost: '', insurancePct: '0.5', customsDuty: '', agentCommission: '', sellingPrice: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const n = k => parseFloat(form[k]) || 0;
  const totalQty = n('quantity') || 1;
  const productTotal = n('productCost') * totalQty;
  const freight = n('freightCost');
  const insurance = ((productTotal + freight) * n('insurancePct')) / 100;
  const commission = (n('sellingPrice') * totalQty * n('agentCommission')) / 100;
  const totalCost = productTotal + n('packagingCost') + freight + insurance + n('customsDuty') + commission;
  const revenue = n('sellingPrice') * totalQty;
  const profit = revenue - totalCost;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;
  const Field = ({ label, k, placeholder, suffix }) => (
    <div>
      <label className="text-xs text-[#a8b2d8] font-medium block mb-1">{label}</label>
      <div className="relative">
        <input type="number" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder || '0'}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1] pr-10" />
        {suffix && <span className="absolute right-3 top-2 text-[#a8b2d8] text-xs">{suffix}</span>}
      </div>
    </div>
  );
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">🧮 Export Cost & Profit Calculator</h1>
      <p className="text-[#a8b2d8] text-sm">Estimate your total export cost and profit margin per shipment.</p>
      <Card className="max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <Field label="Product Cost per Unit ($)" k="productCost" />
          <Field label="Quantity (units)" k="quantity" placeholder="100" />
          <Field label="Packaging Cost ($)" k="packagingCost" />
          <Field label="Freight / Shipping ($)" k="freightCost" />
          <Field label="Insurance (%)" k="insurancePct" placeholder="0.5" suffix="%" />
          <Field label="Customs Duty ($)" k="customsDuty" />
          <Field label="Agent Commission (%)" k="agentCommission" placeholder="2" suffix="%" />
          <Field label="Selling Price per Unit ($)" k="sellingPrice" />
        </div>
        <div className="border-t border-white/10 pt-4 space-y-2">
          {[['Product Cost (total)', productTotal],['Packaging', n('packagingCost')],['Freight', freight],['Insurance', insurance],['Customs Duty', n('customsDuty')],['Agent Commission', commission]].map(([label, val]) => (
            <div key={label} className="flex justify-between text-sm"><span className="text-[#a8b2d8]">{label}</span><span className="text-white">${val.toFixed(2)}</span></div>
          ))}
          <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2"><span className="text-[#a8b2d8]">Total Cost</span><span className="text-white">${totalCost.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm font-bold"><span className="text-[#a8b2d8]">Total Revenue</span><span className="text-white">${revenue.toFixed(2)}</span></div>
          <div className={`flex justify-between text-base font-bold pt-1 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}><span>Net Profit</span><span>${profit.toFixed(2)} ({margin}%)</span></div>
          {profit < 0 && <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">You are selling at a loss. Try increasing your selling price or reducing costs.</div>}
          {profit >= 0 && revenue > 0 && <div className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">Profitable shipment. Aim for 15-25% margin in most export categories.</div>}
        </div>
      </Card>
    </div>
  );
}

const COUNTRY_RULES = {
  'USA': { flag: '🇺🇸', currency: 'USD', tariff: 'MFN rates apply. GSP benefits suspended for India since 2019.', docs: ['FDA Registration (food/pharma)', 'FCC Certification (electronics)', 'Country of Origin Label'], restricted: ['Some dairy products', 'Certain agricultural items', 'Narcotics'], tips: 'Label all products with English descriptions and net weight in lbs. FDA prior notice required for food.' },
  'UAE': { flag: '🇦🇪', currency: 'AED', tariff: 'GCC Common External Tariff - 5% on most goods.', docs: ['Halal Certificate (food/meat)', 'Certificate of Origin', 'ECAS Registration'], restricted: ['Pork products', 'Alcohol', 'Weapons'], tips: 'Arabic labeling required for food. Good hub for re-export to GCC and Africa.' },
  'UK': { flag: '🇬🇧', currency: 'GBP', tariff: 'Post-Brexit UK Global Tariff. India-UK FTA under negotiation.', docs: ['UKCA Marking (electronics/machinery)', 'Phytosanitary Certificate (agri)', 'Health Certificate'], restricted: ['Certain pesticides', 'Invasive plant species'], tips: 'Register on CHIEF/CDS customs system. EORI number required for UK customs.' },
  'Germany': { flag: '🇩🇪', currency: 'EUR', tariff: 'EU Common External Tariff - typically 3.5%.', docs: ['CE Marking (mandatory for many products)', 'REACH Compliance (chemicals)', 'WEEE (electronics)'], restricted: ['Products not meeting EU standards', 'Certain chemicals'], tips: 'German importers are strict about documentation. Consider getting DIN/ISO certifications.' },
  'Saudi Arabia': { flag: '🇸🇦', currency: 'SAR', tariff: 'GCC 5% tariff. Some products have zero duty.', docs: ['Halal Certificate', 'SASO Certification', 'SFDA Registration (food)'], restricted: ['Pork', 'Alcohol', 'Non-Halal meat'], tips: 'Saudization rules affect local agents. Register with Saudi Customs (Zakat) portal.' },
  'China': { flag: '🇨🇳', currency: 'CNY', tariff: 'MFN rates. India-China trade relations complicated by border issues.', docs: ['GACC Registration (food exporters mandatory)', 'Chinese label with Mandarin text', 'Quarantine Certificate'], restricted: ['Various agricultural items', 'Some dairy'], tips: 'Register on CIFER (China Import Food Enterprise Registration). Demand for Indian spices, cotton, pharma.' },
  'Japan': { flag: '🇯🇵', currency: 'JPY', tariff: 'CEPA with India offers preferential rates.', docs: ['JAS Certification (food)', 'PSE Mark (electrical)', 'Phytosanitary Certificate'], restricted: ['Certain pesticide residue levels (strict)'], tips: 'Japan has very strict quality standards. Use India-Japan CEPA for lower tariffs.' },
  'Australia': { flag: '🇦🇺', currency: 'AUD', tariff: 'ECTA signed 2022 - zero duty on 85%+ Indian goods.', docs: ['Biosecurity Certificate (critical for agri)', 'AQIS Inspection', 'Free Trade Certificate'], restricted: ['Fresh fruits without inspection', 'Soil-attached plants'], tips: 'Australia has very strict biosecurity. Declare all food/organic material. ECTA gives India big advantage.' },
};

function CountryRulesPage() {
  const [selected, setSelected] = useState('');
  const data = COUNTRY_RULES[selected];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">📋 Country Rules & Restrictions</h1>
      <p className="text-[#a8b2d8] text-sm">Understand import rules, required certifications, and trade tips for each country.</p>
      <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full bg-[#16213e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6366f1]">
        <option value="">-- Choose a country --</option>
        {Object.keys(COUNTRY_RULES).map(c => <option key={c}>{c}</option>)}
      </select>
      {data ? (
        <Card>
          <div className="flex items-center gap-3 mb-4"><span className="text-4xl">{data.flag}</span><div><p className="text-white font-bold text-base">{selected}</p><p className="text-[#a8b2d8] text-xs">Currency: {data.currency}</p></div></div>
          <div className="space-y-4">
            <div><p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-1">Tariff / Trade Info</p><p className="text-[#a8b2d8] text-sm">{data.tariff}</p></div>
            <div><p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-2">Required Documents</p>{data.docs.map(d => <div key={d} className="flex items-center gap-2 text-sm text-[#a8b2d8] mb-1"><span className="text-green-400">✓</span>{d}</div>)}</div>
            <div><p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">Restricted Items</p>{data.restricted.map(r => <div key={r} className="flex items-center gap-2 text-sm text-[#a8b2d8] mb-1"><span className="text-red-400">✗</span>{r}</div>)}</div>
            <div className="bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-lg px-4 py-3"><p className="text-xs text-[#6366f1] font-semibold mb-1">💡 Pro Tip</p><p className="text-[#a8b2d8] text-sm">{data.tips}</p></div>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-10"><div className="text-4xl mb-3">🌐</div><p className="text-[#a8b2d8] text-sm">Select a country above to see import rules and requirements</p></Card>
      )}
    </div>
  );
}

function BeginnerHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.name || user.email?.split('@')[0] || 'Beginner';
  const cards = [
    { icon: '📘', title: 'Export Guide', sub: '8-step guide from registration to payment', path: '/beginner/guide' },
    { icon: '🌍', title: 'Product Demand', sub: 'Which country needs what from India', path: '/beginner/demand' },
    { icon: '🧮', title: 'Cost & Profit Calculator', sub: 'Estimate shipment cost and margin', path: '/beginner/calculator' },
    { icon: '📋', title: 'Country Rules', sub: 'Docs, tariffs & restrictions per country', path: '/beginner/rules' },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Hello, {name}! 👋</h1><p className="text-[#a8b2d8] text-sm mt-1">Your beginner guide to exporting from India.</p></div>
      <div className="bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/30 rounded-xl px-5 py-4">
        <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-1">Did you know?</p>
        <p className="text-white text-sm font-medium">India exports crossed <span className="text-[#6366f1] font-bold">$776 billion</span> in FY2023-24. Engineering goods, gems, pharma, and spices lead the way.</p>
      </div>
      <p className="text-[#a8b2d8] text-xs font-semibold uppercase tracking-widest">Explore Tools</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(c => (
          <button key={c.title} onClick={() => navigate(c.path)} className="text-left w-full">
            <Card className="flex items-center gap-4 hover:border-[#6366f1]/50 transition-all cursor-pointer">
              <span className="text-2xl">{c.icon}</span>
              <div><p className="text-white font-bold text-sm">{c.title}</p><p className="text-[#a8b2d8] text-xs">{c.sub}</p></div>
              <span className="ml-auto text-[#6366f1] text-xl">›</span>
            </Card>
          </button>
        ))}
      </div>
      <Card>
        <p className="text-xs text-[#6366f1] font-semibold uppercase tracking-widest mb-3">🎥 YouTube Tutorials</p>
        <div className="space-y-3">
          {[
            { title: 'How to Get IEC Code - Step by Step', channel: 'DGFT India', duration: '8 min' },
            { title: 'Export Documentation for Beginners', channel: 'Export Import Bank', duration: '15 min' },
            { title: 'Finding International Buyers on Alibaba', channel: 'Trade Tutorial', duration: '12 min' },
            { title: 'GST Refund for Exporters Explained', channel: 'CA Expertise', duration: '20 min' },
            { title: 'Shipping Bill Filing on ICEGATE', channel: 'Customs Academy', duration: '18 min' },
          ].map(v => (
            <div key={v.title} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 text-base flex-shrink-0">▶</div>
              <div className="flex-1 min-w-0"><p className="text-white text-xs font-semibold truncate">{v.title}</p><p className="text-[#a8b2d8] text-xs">{v.channel} · {v.duration}</p></div>
            </div>
          ))}
        </div>
        <p className="text-[#a8b2d8] text-xs mt-3 text-center">Search these titles on YouTube for the latest tutorials</p>
      </Card>
    </div>
  );
}

export default function BeginnerDashboard() {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route index element={<BeginnerHome />} />
        <Route path="dashboard" element={<BeginnerHome />} />
        <Route path="guide" element={<ExportGuidePage />} />
        <Route path="demand" element={<DemandCheckerPage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="rules" element={<CountryRulesPage />} />
      </Routes>
    </DashboardLayout>
  );
}
