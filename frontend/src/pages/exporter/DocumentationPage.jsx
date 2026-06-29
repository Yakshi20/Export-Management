import { useState, useRef } from 'react';

const PRODUCTS = [
  'Tomato', 'Potato', 'Onion', 'Garlic', 'Ginger', 'Carrot', 'Cabbage', 'Cauliflower',
  'Spinach', 'Brinjal', 'Okra', 'Bitter Gourd', 'Bottle Gourd', 'Pumpkin', 'Cucumber',
  'Mango', 'Banana', 'Apple', 'Grapes', 'Pomegranate', 'Papaya', 'Guava', 'Watermelon',
  'Pineapple', 'Orange', 'Lemon', 'Coconut', 'Strawberry', 'Kiwi', 'Avocado',
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'United Arab Emirates', 'Saudi Arabia', 'Germany',
  'France', 'Netherlands', 'Canada', 'Australia', 'Japan', 'China', 'Singapore',
  'Malaysia', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Pakistan', 'South Africa',
  'Kenya', 'Nigeria', 'Egypt', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
];

export default function DocumentationPage() {
  const [tab, setTab] = useState('user');
  const [msg, setMsg] = useState(null);

  // User docs
  const [userForm, setUserForm] = useState({ iec: '', gst: '', rcmc: '' });
  const [userFiles, setUserFiles] = useState({ iec: null, gst: null, rcmc: null });
  const iecRef = useRef(); const gstRef = useRef(); const rcmcRef = useRef();

  // Product docs
  const [productForm, setProductForm] = useState({ product: '', from: '', to: '' });

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const saveUserDocs = () => {
    if (!userForm.iec && !userForm.gst && !userForm.rcmc) {
      showMsg('Please fill at least one field', 'error'); return;
    }
    localStorage.setItem('userDocs', JSON.stringify(userForm));
    showMsg('User documents saved!');
  };

  const saveProductDoc = () => {
    if (!productForm.product || !productForm.from || !productForm.to) {
      showMsg('Please fill all fields', 'error'); return;
    }
    const existing = JSON.parse(localStorage.getItem('productDocs') || '[]');
    existing.push({ ...productForm, savedAt: new Date().toLocaleDateString() });
    localStorage.setItem('productDocs', JSON.stringify(existing));
    showMsg('Product document saved!');
    setProductForm({ product: '', from: '', to: '' });
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) setUserFiles(f => ({ ...f, [field]: file.name }));
  };

  const tabs = [
    { id: 'user', label: 'User Documents' },
    { id: 'product', label: 'Product Documents' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Documents</h1>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setMsg(null); }}
            className={`px-5 py-2.5 text-sm font-semibold transition-all ${tab === t.id ? 'text-[#6366f1] border-b-2 border-[#6366f1]' : 'text-[#a8b2d8] hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {msg.text}
        </div>
      )}

      {/* User Documents Tab */}
      {tab === 'user' && (
        <div className="space-y-5">
          {[
            { key: 'iec', label: 'IEC Code', placeholder: 'Enter IEC Code', ref: iecRef },
            { key: 'gst', label: 'GST Number', placeholder: 'Enter GST Number', ref: gstRef },
            { key: 'rcmc', label: 'RCMC Number', placeholder: 'Enter RCMC Number', ref: rcmcRef },
          ].map(({ key, label, placeholder, ref }) => (
            <div key={key} className="bg-[#16213e] rounded-xl p-5 border border-white/10 space-y-3">
              <p className="text-white font-semibold text-sm">{label}</p>
              <input
                value={userForm[key]}
                onChange={e => setUserForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366f1]"
              />
              <div>
                <p className="text-[#a8b2d8] text-xs mb-2">Upload {label} Document</p>
                <button
                  onClick={() => ref.current.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-[#a8b2d8] text-xs hover:border-[#6366f1] hover:text-white transition-all"
                >
                  📎 {userFiles[key] ? userFiles[key] : `Choose File`}
                </button>
                <input ref={ref} type="file" accept=".pdf,.jpg,.png,.jpeg" className="hidden" onChange={e => handleFileChange(key, e)} />
              </div>
            </div>
          ))}

          <button
            onClick={saveUserDocs}
            className="w-full py-3 rounded-xl bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#5254cc] transition-all"
          >
            💾 Save Documents
          </button>
        </div>
      )}

      {/* Product Documents Tab */}
      {tab === 'product' && (
        <div className="space-y-5">
          <div className="bg-[#16213e] rounded-xl p-5 border border-white/10 space-y-4">

            {/* Product */}
            <div>
              <label className="text-[#a8b2d8] text-xs block mb-1.5">Product</label>
              <select
                value={productForm.product}
                onChange={e => setProductForm(f => ({ ...f, product: e.target.value }))}
                className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366f1]"
              >
                <option value="">-- Select Product --</option>
                <optgroup label="Vegetables">
                  {PRODUCTS.slice(0, 15).map(p => <option key={p} value={p}>{p}</option>)}
                </optgroup>
                <optgroup label="Fruits">
                  {PRODUCTS.slice(15).map(p => <option key={p} value={p}>{p}</option>)}
                </optgroup>
              </select>
            </div>

            {/* From Country */}
            <div>
              <label className="text-[#a8b2d8] text-xs block mb-1.5">From Country</label>
              <select
                value={productForm.from}
                onChange={e => setProductForm(f => ({ ...f, from: e.target.value }))}
                className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366f1]"
              >
                <option value="">-- Select Origin Country --</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* To Country */}
            <div>
              <label className="text-[#a8b2d8] text-xs block mb-1.5">To Country</label>
              <select
                value={productForm.to}
                onChange={e => setProductForm(f => ({ ...f, to: e.target.value }))}
                className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#6366f1]"
              >
                <option value="">-- Select Destination Country --</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={saveProductDoc}
            className="w-full py-3 rounded-xl bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#5254cc] transition-all"
          >
            💾 Save Product Document
          </button>

          {/* Saved entries */}
          {(() => {
            const saved = JSON.parse(localStorage.getItem('productDocs') || '[]');
            if (!saved.length) return null;
            return (
              <div className="space-y-2">
                <p className="text-[#a8b2d8] text-xs font-semibold uppercase tracking-widest">Saved</p>
                {saved.map((s, i) => (
                  <div key={i} className="bg-[#16213e] rounded-xl px-4 py-3 border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-semibold">{s.product}</p>
                      <p className="text-[#a8b2d8] text-xs">{s.from} → {s.to}</p>
                    </div>
                    <span className="text-[#a8b2d8] text-xs">{s.savedAt}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
