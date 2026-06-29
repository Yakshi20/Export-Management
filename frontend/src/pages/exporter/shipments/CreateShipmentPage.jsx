import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';

export default function CreateShipmentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ shipmentNumber: '', productName: '', hsnCode: '', quantity: '', unit: '', originCountry: '', destinationCountry: '', portOfLoading: '', portOfDischarge: '', expectedShipmentDate: '', shipmentValue: '', shippingMethod: 'Sea' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/exporter/shipments', form);
      setToast({ message: 'Shipment created!', type: 'success' });
      setTimeout(() => navigate('/exporter/shipments'), 1200);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create shipment', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Create Shipment</h1>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Shipment Number" value={form.shipmentNumber} onChange={e => set('shipmentNumber', e.target.value)} required />
            <Input label="Product Name" value={form.productName} onChange={e => set('productName', e.target.value)} required />
            <Input label="IEC Code" value={form.hsnCode} onChange={e => set('hsnCode', e.target.value)} />
            <Input label="Quantity" type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
            <Input label="Unit" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="KG, MT, PCS" />
            <Input label="Origin Country" value={form.originCountry} onChange={e => set('originCountry', e.target.value)} required />
            <Input label="Destination Country" value={form.destinationCountry} onChange={e => set('destinationCountry', e.target.value)} required />
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
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Create Shipment</Button>
            <Button variant="secondary" onClick={() => navigate('/exporter/shipments')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
