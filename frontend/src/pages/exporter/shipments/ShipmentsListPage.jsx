import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Card from '../../../components/ui/Card';

const STATUS_FLOW = ['Draft', 'Packed', 'Shipped', 'In Customs', 'Delivered'];
const STATUS_COLORS = {
  Draft: 'text-gray-400 bg-gray-400/10', Packed: 'text-blue-400 bg-blue-400/10',
  Shipped: 'text-yellow-400 bg-yellow-400/10', 'In Customs': 'text-orange-400 bg-orange-400/10',
  Delivered: 'text-green-400 bg-green-400/10', Created: 'text-gray-400 bg-gray-400/10',
  'In Transit': 'text-yellow-400 bg-yellow-400/10',
};

export default function ShipmentsListPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/exporter/shipments').then(r => setShipments(r.data?.data || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  const filtered = filter === 'All' ? shipments : shipments.filter(s => s.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">Shipments</h1>
        <button onClick={() => navigate('/exporter/shipments/create')}
          className="px-4 py-2 rounded-lg bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#5254cc] transition-all">
          + Create Shipment
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', ...STATUS_FLOW].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === s ? 'bg-[#6366f1] text-white' : 'bg-white/5 text-[#a8b2d8] hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">🚢</div>
          <p className="text-[#a8b2d8]">No shipments found.</p>
          <button onClick={() => navigate('/exporter/shipments/create')} className="mt-4 px-4 py-2 rounded-lg bg-[#6366f1] text-white text-sm font-semibold">
            Create First Shipment
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => (
            <Card key={s._id} className="hover:border-[#6366f1]/40 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-white font-bold text-sm">{s.productName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[s.status] || 'text-gray-400 bg-gray-400/10'}`}>
                      {s.status || 'Draft'}
                    </span>
                  </div>
                  <p className="text-[#a8b2d8] text-xs">#{s.shipmentNumber}</p>
                  <div className="flex gap-4 mt-2 text-xs text-[#a8b2d8] flex-wrap">
                    {s.originCountry && <span>📍 {s.originCountry}</span>}
                    {s.destinationCountry && <span>🎯 {s.destinationCountry}</span>}
                    {s.quantity && <span>📦 {s.quantity} {s.unit}</span>}
                  </div>
                </div>
                <div className="text-right text-xs text-[#a8b2d8] flex-shrink-0">
                  {s.expectedShipmentDate && <p>{new Date(s.expectedShipmentDate).toLocaleDateString()}</p>}
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                {STATUS_FLOW.map((step, i) => {
                  const cur = STATUS_FLOW.indexOf(s.status);
                  return <div key={step} className={`h-1.5 flex-1 rounded-full ${i <= cur ? 'bg-[#6366f1]' : 'bg-white/10'}`} />;
                })}
              </div>
              <div className="flex justify-between text-[10px] text-[#a8b2d8] mt-1">
                <span>Draft</span><span>Packed</span><span>Shipped</span><span>Customs</span><span>Delivered</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
