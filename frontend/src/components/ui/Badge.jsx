export default function Badge({ status }) {
  const map = {
    'Created': 'bg-gray-500/20 text-gray-300',
    'Pre-Shipment Completed': 'bg-blue-500/20 text-blue-300',
    'In Transit': 'bg-yellow-500/20 text-yellow-300',
    'Customs Clearance': 'bg-orange-500/20 text-orange-300',
    'Delivered': 'bg-green-500/20 text-green-300',
    'Confirmed': 'bg-green-500/20 text-green-300',
    'Pending': 'bg-yellow-500/20 text-yellow-300',
    'Completed': 'bg-blue-500/20 text-blue-300',
    'Cancelled': 'bg-red-500/20 text-red-300',
    'Under Review': 'bg-purple-500/20 text-purple-300',
    'Cleared': 'bg-green-500/20 text-green-300',
    'Rejected': 'bg-red-500/20 text-red-300',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || 'bg-gray-500/20 text-gray-300'}`}>
      {status}
    </span>
  );
}
