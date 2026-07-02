import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '../../components/ui/Autocomplete';

const PRODUCT_CATEGORIES = {
  Spices: ['Turmeric', 'Pepper', 'Cardamom', 'Chilli', 'Cumin', 'Coriander'],
  Fruits: ['Mango', 'Banana', 'Pomegranate', 'Grapes', 'Papaya'],
  Vegetables: ['Onion', 'Potato', 'Tomato', 'Okra', 'Green Chilli'],
  Grains: ['Basmati Rice', 'Wheat', 'Maize', 'Sorghum'],
  'Dry Fruits': ['Cashew Nuts', 'Almonds', 'Raisins', 'Walnuts', 'Pistachios'],
};
const CATEGORIES = Object.keys(PRODUCT_CATEGORIES);

const COUNTRIES = [
  'India', 'Indonesia', 'United States', 'United Kingdom', 'United Arab Emirates', 'Saudi Arabia',
  'Germany', 'France', 'Netherlands', 'Canada', 'Australia', 'Japan', 'China',
  'Singapore', 'Malaysia', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Pakistan',
  'South Africa', 'Kenya', 'Nigeria', 'Egypt', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
];

const COUNTRY_DOCS = {
  'United States': ['FDA Registration', 'USDA Phytosanitary Certificate', 'Country of Origin Certificate'],
  'United Arab Emirates': ['Halal Certificate', 'ESMA Compliance', 'Country of Origin Certificate'],
  'European Union': ['EU Phytosanitary Certificate', 'Pesticide Residue Test Report'],
  'Germany': ['EU Phytosanitary Certificate', 'Pesticide Residue Test Report', 'CE Marking (if applicable)'],
  'Japan': ['Japan Phytosanitary Certificate', 'JAS Organic Certificate (if organic)'],
  'Australia': ['Australian Quarantine Certificate', 'Biosecurity Import Permit'],
  'Saudi Arabia': ['Halal Certificate', 'SFDA Registration', 'Country of Origin Certificate'],
  'China': ['GACC Registration', 'Phytosanitary Certificate', 'Health Certificate'],
};

const HS_CODES = {
  'Mango': '0804.50', 'Banana': '0803.90', 'Onion': '0703.10', 'Tomato': '0702.00',
  'Potato': '0701.90', 'Grapes': '0806.10', 'Pomegranate': '0810.90', 'Rice': '1006.30',
  'Wheat': '1001.99', 'Spices': '0904.21', 'Cotton': '5201.00', 'Soybean': '1201.90',
};

const USER_DOC_FIELDS = [
  { key: 'iec', label: 'IEC Code', placeholder: 'e.g. AABCP1234C' },
  { key: 'gst', label: 'GST Number', placeholder: 'e.g. 27AABCP1234C1Z5' },
  { key: 'rcmc', label: 'RCMC Number', placeholder: 'Registration Cum Membership Certificate' },
  { key: 'pan', label: 'PAN Card', placeholder: 'e.g. AABCP1234C' },
  { key: 'adCode', label: 'AD Code', placeholder: 'Authorised Dealer Code from bank' },
  { key: 'bankName', label: 'Bank Name', placeholder: 'Bank name for export payments' },
  { key: 'bankAccount', label: 'Bank Account No.', placeholder: 'Account number' },
  { key: 'businessAddress', label: 'Business Address', placeholder: 'Registered business address' },
  { key: 'ielStatus', label: 'Import Export License Status', placeholder: 'Active / Pending / Expired' },
];

const STATUS_OPTIONS = ['✅ Verified', '⏳ Pending', '❌ Missing'];

const emptyProductForm = { product: '', category: '', from: 'India', to: '', hsCode: '', quantity: '', value: '', packaging: '', qualityCert: '', qualityCertFile: '' };

export default function DocumentationPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('user');
  const [msg, setMsg] = useState(null);

  // User docs
  const saved = JSON.parse(localStorage.getItem('userDocs') || '{}');
  const [userForm, setUserForm] = useState(saved);
  const [statuses, setStatuses] = useState(JSON.parse(localStorage.getItem('userDocStatuses') || '{}'));
  const fileRefs = useRef({});

  // Product docs
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [certificateFileName, setCertificateFileName] = useState('');
  const [savedProducts, setSavedProducts] = useState(JSON.parse(localStorage.getItem('productDocs') || '[]'));
  const [lastSaved, setLastSaved] = useState(false);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const saveUserDocs = () => {
    localStorage.setItem('userDocs', JSON.stringify(userForm));
    localStorage.setItem('userDocStatuses', JSON.stringify(statuses));
    showMsg('Documents saved!');
  };

  const saveProductDoc = () => {
    if (!productForm.product || !productForm.to) { showMsg('Select product and destination country', 'error'); return; }
    const list = [...savedProducts, { ...productForm, savedAt: new Date().toLocaleDateString() }];
    localStorage.setItem('productDocs', JSON.stringify(list));
    setSavedProducts(list);
    showMsg('Product document saved!');
    setProductForm(emptyProductForm);
    setCertificateFileName('');
    setLastSaved(true);
  };

  const handleCertificateFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCertificateFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setProductForm(f => ({ ...f, qualityCertFile: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const autoHsCode = (product) => {
    const match = Object.entries(HS_CODES).find(([k]) => product.toLowerCase().includes(k.toLowerCase()));
    return match ? match[1] : '';
  };

  const requiredDocs = COUNTRY_DOCS[productForm.to] || [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Documents</h1>

      <div className="flex border-b border-white/10">
        {[{ id: 'user', label: '👤 User Documents' }, { id: 'product', label: '📦 Product Documents' }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setMsg(null); }}
            className={`px-5 py-2.5 text-sm font-semibold transition-all ${tab === t.id ? 'text-[#6366f1] border-b-2 border-[#6366f1]' : 'text-[#a8b2d8] hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{msg.text}</div>
      )}

      {/* USER DOCUMENTS */}
      {tab === 'user' && (
        <div className="space-y-4">
          {USER_DOC_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key} className="bg-[#16213e] rounded-xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold text-sm">{label}</p>
                <select
                  value={statuses[key] || '⏳ Pending'}
                  onChange={e => setStatuses(s => ({ ...s, [key]: e.target.value }))}
                  className="bg-[#0a0a1a] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <input
                value={userForm[key] || ''}
                onChange={e => setUserForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]"
              />
              <button
                onClick={() => { if (!fileRefs.current[key]) return; fileRefs.current[key].click(); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-[#a8b2d8] text-xs hover:border-[#6366f1] hover:text-white transition-all"
              >
                📎 Upload Document
              </button>
              <input ref={el => fileRefs.current[key] = el} type="file" accept=".pdf,.jpg,.png" className="hidden" />
            </div>
          ))}
          <button onClick={saveUserDocs} className="w-full py-3 rounded-xl bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#5254cc] transition-all">
            💾 Save All Documents
          </button>
        </div>
      )}

      {/* PRODUCT DOCUMENTS */}
      {tab === 'product' && (
        <div className="space-y-4">
          <div className="bg-[#16213e] rounded-xl p-5 border border-white/10 space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Category */}
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">Product Category</label>
                <select value={productForm.category}
                  onChange={e => setProductForm(f => ({ ...f, category: e.target.value, product: '', hsCode: '' }))}
                  className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]">
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Product */}
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">Product</label>
                <Autocomplete value={productForm.product}
                  onChange={p => setProductForm(f => ({ ...f, product: p, hsCode: autoHsCode(p) }))}
                  options={PRODUCT_CATEGORIES[productForm.category] || []}
                  disabled={!productForm.category}
                  placeholder={productForm.category ? 'e.g. Turmeric' : 'Select a category first'} />
              </div>

              {/* HS Code */}
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">HS Code</label>
                <input value={productForm.hsCode} onChange={e => setProductForm(f => ({ ...f, hsCode: e.target.value }))}
                  placeholder="Auto-filled or enter manually"
                  className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">Quantity (KG/MT)</label>
                <input value={productForm.quantity} onChange={e => setProductForm(f => ({ ...f, quantity: e.target.value }))}
                  placeholder="e.g. 500 KG"
                  className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
              </div>

              {/* Value */}
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">Product Value (USD)</label>
                <input value={productForm.value} onChange={e => setProductForm(f => ({ ...f, value: e.target.value }))}
                  placeholder="e.g. 2000"
                  className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
              </div>

              {/* Packaging */}
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">Packaging Type</label>
                <select value={productForm.packaging} onChange={e => setProductForm(f => ({ ...f, packaging: e.target.value }))}
                  className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]">
                  <option value="">-- Select --</option>
                  {['Carton Box', 'Jute Bag', 'Wooden Crate', 'Plastic Bag', 'Vacuum Pack', 'Bulk Container'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* From */}
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">From Country</label>
                <Autocomplete value={productForm.from} onChange={v => setProductForm(f => ({ ...f, from: v }))}
                  options={COUNTRIES} placeholder="e.g. India" />
              </div>

              {/* To */}
              <div>
                <label className="text-[#a8b2d8] text-xs block mb-1">To Country</label>
                <Autocomplete value={productForm.to} onChange={v => setProductForm(f => ({ ...f, to: v }))}
                  options={COUNTRIES} placeholder="e.g. USA" />
              </div>
            </div>

            {/* Quality Cert */}
            <div>
              <label className="text-[#a8b2d8] text-xs block mb-1">Quality Certificates</label>
              <input value={productForm.qualityCert} onChange={e => setProductForm(f => ({ ...f, qualityCert: e.target.value }))}
                placeholder="e.g. APEDA, Organic, ISO 22000"
                className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1]" />
            </div>

            {/* Quality Cert Upload */}
            <div>
              <label className="text-[#a8b2d8] text-xs block mb-1">Upload Quality Certificate</label>
              <input type="file" accept=".pdf,image/*" onChange={handleCertificateFile}
                className="w-full text-sm text-[#a8b2d8] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#6366f1] file:text-white file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-[#5254cc]" />
              {certificateFileName && <p className="text-xs text-green-400 mt-1">📎 {certificateFileName}</p>}
            </div>

            {/* Country-specific required docs */}
            {requiredDocs.length > 0 && (
              <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-lg p-4">
                <p className="text-[#6366f1] text-xs font-bold mb-2">📋 Required for {productForm.to}:</p>
                <ul className="space-y-1">
                  {requiredDocs.map(d => <li key={d} className="text-[#a8b2d8] text-xs flex items-center gap-2"><span className="text-yellow-400">⚠️</span>{d}</li>)}
                </ul>
              </div>
            )}
          </div>

          <button onClick={saveProductDoc} className="w-full py-3 rounded-xl bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#5254cc] transition-all">
            💾 Save Product Document
          </button>

          {lastSaved && (
            <div className="bg-[#16213e] rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/exporter/cha')}
                className="flex-1 py-2.5 rounded-xl bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#5254cc] transition-all">
                📌 Book CHA
              </button>
              <button onClick={() => navigate('/exporter/forwarder')}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-all">
                🚚 Book Freight Forwarder
              </button>
            </div>
          )}

          {savedProducts.length > 0 && (
            <div className="space-y-2">
              <p className="text-[#a8b2d8] text-xs font-semibold uppercase tracking-widest">Saved</p>
              {savedProducts.map((s, i) => (
                <div key={i} className="bg-[#16213e] rounded-xl px-4 py-3 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white text-sm font-semibold">{s.product} {s.hsCode && <span className="text-[#6366f1] text-xs ml-2">HS: {s.hsCode}</span>}</p>
                      <p className="text-[#a8b2d8] text-xs">{s.from} → {s.to} {s.quantity && `• ${s.quantity}`}</p>
                    </div>
                    <span className="text-[#a8b2d8] text-xs">{s.savedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
