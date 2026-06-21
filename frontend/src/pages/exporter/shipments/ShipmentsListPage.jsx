import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Card from '../../../components/ui/Card';

export default function ShipmentsListPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exporter/shipments').then(r => setShipments(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">All Shipments</h1>
      {shipments.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-[#a8b2d8]">No shipments yet. Create your first shipment!</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {['Shipment #', 'Product', 'Destination', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[#a8b2d8] text-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shipments.map(s => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="px-4 py-3 text-white font-mono text-sm">{s.shipmentNumber}</td>
                    <td className="px-4 py-3 text-white">{s.productName}</td>
                    <td className="px-4 py-3 text-[#a8b2d8]">{s.destinationCountry}</td>
                    <td className="px-4 py-3"><Badge status={s.status} /></td>
                    <td className="px-4 py-3 text-[#a8b2d8] text-sm">{s.expectedShipmentDate ? new Date(s.expectedShipmentDate).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
