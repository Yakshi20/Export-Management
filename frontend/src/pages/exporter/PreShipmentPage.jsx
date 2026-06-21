import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Toast from '../../components/ui/Toast';

const STEPS = ['Select Country', 'Select Product', 'Compliance Check', 'Buyer Details', 'Generate Documents', 'Summary'];

export default function PreShipmentPage() {
  const [step, setStep] = useState(0);
  const [countries, setCountries] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compliance, setCompliance] = useState({ iecCode: '', gstNumber: '' });
  const [complianceResult, setComplianceResult] = useState(null);
  const [buyer, setBuyer] = useState({ buyerName: '', companyName: '', email: '', phone: '', country: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState({});
  const [docStatus, setDocStatus] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (step === 0) api.get('/exporter/pre-shipment/countries').then(r => setCountries(r.data || [])).catch(() => {});
    if (step === 1) api.get('/exporter/pre-shipment/products').then(r => setProducts(r.data || [])).catch(() => {});
  }, [step]);

  const checkCompliance = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/exporter/pre-shipment/compliance', compliance);
      setComplianceResult(res.data);
    } catch (err) {
      setToast({ message: 'Compliance check failed', type: 'error' });
    }
    setLoading(false);
  };

  const saveBuyer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/exporter/buyers', buyer);
      setToast({ message: 'Buyer saved!', type: 'success' });
      setStep(4);
    } catch { setToast({ message: 'Failed to save buyer', type: 'error' }); }
    setLoading(false);
  };

  const downloadDoc = async (type, endpoint, filename) => {
    setDocLoading(l => ({...l, [type]: true}));
    try {
      const data = { country: selectedCountry, product: selectedProduct, buyer, ...compliance };
      const res = await api.post(`/exporter/pre-shipment/${endpoint}`, data, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      setDocStatus(s => ({...s, [type]: 'success'}));
    } catch { setDocStatus(s => ({...s, [type]: 'error'})); }
    setDocLoading(l => ({...l, [type]: false}));
  };

  const canNext = () => {
    if (step === 0) return !!selectedCountry;
    if (step === 1) return !!selectedProduct;
    if (step === 2) return complianceResult?.passed;
    if (step === 3) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Pre-Shipment Process</h1>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-[#e94560] text-white' : 'bg-white/10 text-[#a8b2d8]'}`}>{i + 1}</div>
            <span className={`text-xs whitespace-nowrap ${i === step ? 'text-white font-medium' : 'text-[#a8b2d8]'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <Card>
        {step === 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 1: Select Destination Country</h2>
            {countries.length === 0 ? <p className="text-[#a8b2d8]">Loading countries...</p> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {countries.map(c => (
                  <button key={c._id || c.name || c} onClick={() => setSelectedCountry(c)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${selectedCountry === c ? 'border-[#e94560] bg-[#e94560]/20 text-white' : 'border-white/10 bg-white/5 text-[#a8b2d8] hover:border-white/30 hover:text-white'}`}>
                    {c.name || c}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 2: Select Product</h2>
            {products.length === 0 ? <p className="text-[#a8b2d8]">Loading products...</p> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map(p => (
                  <button key={p._id || p.name || p} onClick={() => setSelectedProduct(p)}
                    className={`p-4 rounded-lg border text-left transition-all ${selectedProduct === p ? 'border-[#e94560] bg-[#e94560]/20' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                    <div className="font-medium text-white text-sm">{p.name || p}</div>
                    {p.category && <div className="text-[#a8b2d8] text-xs mt-1">{p.category}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 3: Compliance Check</h2>
            <form onSubmit={checkCompliance} className="space-y-4 max-w-md">
              <Input label="IEC Code" value={compliance.iecCode} onChange={e => setCompliance({...compliance, iecCode: e.target.value})} required />
              <Input label="GST Number" value={compliance.gstNumber} onChange={e => setCompliance({...compliance, gstNumber: e.target.value})} required />
              <Button type="submit" loading={loading}>Check Compliance</Button>
            </form>
            {complianceResult && (
              <div className={`mt-4 p-4 rounded-lg border ${complianceResult.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className={`font-semibold mb-2 ${complianceResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {complianceResult.passed ? '✅ Compliance Passed' : '❌ Compliance Failed'}
                </div>
                {complianceResult.issues?.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-[#a8b2d8] space-y-1">
                    {complianceResult.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 4: Buyer Details</h2>
            <form onSubmit={saveBuyer} className="space-y-4 max-w-md">
              <Input label="Buyer Name" value={buyer.buyerName} onChange={e => setBuyer({...buyer, buyerName: e.target.value})} required />
              <Input label="Company Name" value={buyer.companyName} onChange={e => setBuyer({...buyer, companyName: e.target.value})} required />
              <Input label="Email" type="email" value={buyer.email} onChange={e => setBuyer({...buyer, email: e.target.value})} required />
              <Input label="Phone" value={buyer.phone} onChange={e => setBuyer({...buyer, phone: e.target.value})} />
              <Input label="Country" value={buyer.country} onChange={e => setBuyer({...buyer, country: e.target.value})} />
              <Input label="Address" value={buyer.address} onChange={e => setBuyer({...buyer, address: e.target.value})} />
              <Button type="submit" loading={loading}>Save Buyer & Continue</Button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 5: Generate Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'quotation', label: '📄 Generate Quotation', endpoint: 'quotation', file: 'quotation.pdf' },
                { key: 'invoice', label: '🧾 Commercial Invoice', endpoint: 'invoice', file: 'invoice.pdf' },
                { key: 'packing', label: '📦 Packing List', endpoint: 'packing-list', file: 'packing-list.pdf' },
                { key: 'shipping', label: '🚢 Shipping Bill Draft', endpoint: 'shipping-bill', file: 'shipping-bill.pdf' },
              ].map(doc => (
                <div key={doc.key} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-white text-sm">{doc.label}</span>
                  <div className="flex items-center gap-2">
                    {docStatus[doc.key] === 'success' && <span className="text-green-400">✓</span>}
                    {docStatus[doc.key] === 'error' && <span className="text-red-400">✗</span>}
                    <Button variant="secondary" loading={docLoading[doc.key]} onClick={() => downloadDoc(doc.key, doc.endpoint, doc.file)} className="text-xs px-3 py-1">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Step 6: Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-[#a8b2d8] text-sm mb-2">Destination Country</h3>
                <p className="text-white">{selectedCountry?.name || selectedCountry || 'Not selected'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-[#a8b2d8] text-sm mb-2">Product</h3>
                <p className="text-white">{selectedProduct?.name || selectedProduct || 'Not selected'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-[#a8b2d8] text-sm mb-2">Compliance</h3>
                <p className={complianceResult?.passed ? 'text-green-400' : 'text-red-400'}>{complianceResult?.passed ? 'Passed ✅' : 'Not checked'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-[#a8b2d8] text-sm mb-2">Buyer</h3>
                <p className="text-white">{buyer.buyerName || 'Not added'}</p>
              </div>
            </div>
            <p className="text-green-400 font-medium">✅ Pre-shipment process complete!</p>
          </div>
        )}
      </Card>

      <div className="flex gap-3">
        {step > 0 && <Button variant="secondary" onClick={() => setStep(s => s - 1)}>← Previous</Button>}
        {step < STEPS.length - 1 && step !== 3 && (
          <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>Next →</Button>
        )}
      </div>
    </div>
  );
}
