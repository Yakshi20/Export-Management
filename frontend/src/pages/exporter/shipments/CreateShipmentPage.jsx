import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Autocomplete from '../../../components/ui/Autocomplete';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';

const PRODUCT_CATEGORIES = {
  Spices: ['Turmeric', 'Pepper', 'Cardamom', 'Chilli', 'Cumin', 'Coriander'],
  Fruits: ['Mango', 'Banana', 'Pomegranate', 'Grapes', 'Papaya'],
  Vegetables: ['Onion', 'Potato', 'Tomato', 'Okra', 'Green Chilli'],
  Grains: ['Basmati Rice', 'Wheat', 'Maize', 'Sorghum'],
  'Dry Fruits': ['Cashew Nuts', 'Almonds', 'Raisins', 'Walnuts', 'Pistachios'],
};
const CATEGORIES = Object.keys(PRODUCT_CATEGORIES);

export default function CreateShipmentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ productCategory: '', productName: '', originCountry: '', destinationCountry: '', shipmentNumber: '', hsnCode: '', quantity: '', unit: '', portOfLoading: '', portOfDischarge: '', expectedShipmentDate: '', shipmentValue: '', shippingMethod: 'Sea' });
  const [countries, setCountries] = useState([]);
  const [certificateName, setCertificateName] = useState('');
  const [certificateData, setCertificateData] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    api.get('/exporter/pre-shipment/countries').then(r => setCountries(r.data?.countries || [])).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCertificate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCertificateName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setCertificateData(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/exporter/shipments', { ...form, qualityCertificate: certificateData || undefined });
      setCreated(res.data?.data || res.data);
      setToast({ message: 'Shipment created!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create shipment', type: 'error' });
    }
    setLoading(false);
  };

  if (created) {
    return (
      <div className="space-y-6">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        <Card className="max-w-2xl text-center py-10">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">Shipment #{created.shipmentNumber} created!</h2>
          <p className="text-[#a8b2d8] text-sm mb-6">Next, book a CHA to handle customs clearance and a freight forwarder to handle logistics.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/exporter/cha')}>📌 Book CHA</Button>
            <Button variant="secondary" onClick={() => navigate('/exporter/forwarder')}>🚚 Book Freight Forwarder</Button>
          </div>
          <button onClick={() => navigate('/exporter/shipments')} className="text-[#a8b2d8] text-xs mt-6 hover:text-white transition-colors">
            Skip for now → View all shipments
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Create Shipment</h1>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#a8b2d8] font-medium block mb-1">Product Category *</label>
              <select value={form.productCategory} required
                onChange={e => setForm(f => ({ ...f, productCategory: e.target.value, productName: '' }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                <option value="" disabled>Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Autocomplete label="Product *" value={form.productName} onChange={v => set('productName', v)}
              options={PRODUCT_CATEGORIES[form.productCategory] || []} required disabled={!form.productCategory}
              placeholder={form.productCategory ? 'e.g. Turmeric' : 'Select a category first'} />

            <Autocomplete label="From Country *" value={form.originCountry} onChange={v => set('originCountry', v)}
              options={countries} required placeholder="e.g. India" />
            <Autocomplete label="To Country *" value={form.destinationCountry} onChange={v => set('destinationCountry', v)}
              options={countries} required placeholder="e.g. USA" />

            <Input label="Shipment Number" value={form.shipmentNumber} onChange={e => set('shipmentNumber', e.target.value)} required />
            <Input label="IEC Code" value={form.hsnCode} onChange={e => set('hsnCode', e.target.value)} />
            <Input label="Quantity" type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
            <Input label="Unit" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="KG, MT, PCS" />
            <Input label="Port of Loading" value={form.portOfLoading} onChange={e => set('portOfLoading', e.target.value)} />
            <Input label="Port of Discharge" value={form.portOfDischarge} onChange={e => set('portOfDischarge', e.target.value)} />
            <Input label="Expected Shipment Date" type="date" value={form.expectedShipmentDate} onChange={e => set('expectedShipmentDate', e.target.value)} />
            <Input label="Shipment Value (USD)" type="number" value={form.shipmentValue} onChange={e => set('shipmentValue', e.target.value)} placeholder="e.g. 5000" />
            <div>
              <label className="text-sm text-[#a8b2d8] font-medium block mb-1">Shipping Method</label>
              <select value={form.shippingMethod} onChange={e => set('shippingMethod', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                {['Sea', 'Air', 'Road', 'Rail'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#a8b2d8] font-medium block mb-1">Upload Quality Certificate</label>
            <input type="file" accept=".pdf,image/*" onChange={handleCertificate}
              className="w-full text-sm text-[#a8b2d8] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#6366f1] file:text-white file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-[#5254cc]" />
            {certificateName && <p className="text-xs text-green-400 mt-1">📎 {certificateName}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Create Shipment</Button>
            <Button variant="secondary" onClick={() => navigate('/exporter/shipments')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
