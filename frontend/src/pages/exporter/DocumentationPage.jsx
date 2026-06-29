export default function DocumentationPage() {
  const docs = [
    {
      title: 'Pre-Shipment',
      icon: '🚢',
      items: [
        'Check product compliance and export regulations',
        'Prepare commercial invoice and packing list',
        'Get export quotation and freight charges',
        'Apply for IEC code if not available',
        'Arrange quality inspection certificate',
      ],
    },
    {
      title: 'Post-Shipment',
      icon: '📊',
      items: [
        'Track shipment with Bill of Lading number',
        'Submit LC (Letter of Credit) documents to bank',
        'Monitor foreign exchange / currency rates',
        'File shipping bill for customs clearance',
        'Collect export incentives (MEIS/RoDTEP)',
      ],
    },
    {
      title: 'Required Documents',
      icon: '📄',
      items: [
        'IEC Code (Importer Exporter Code)',
        'Commercial Invoice',
        'Packing List',
        'Bill of Lading / Airway Bill',
        'Certificate of Origin',
        'Shipping Bill',
        'Letter of Credit (LC)',
      ],
    },
    {
      title: 'Buyers & Shipments',
      icon: '👥',
      items: [
        'Add buyers from the Buyers tab',
        'Create shipment directly from buyer profile',
        'Attach buyer details to each shipment',
        'Track shipment status per buyer',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Documentation</h1>
      <p className="text-[#a8b2d8] text-sm">Guide for managing your exports end-to-end.</p>
      <div className="space-y-4">
        {docs.map(section => (
          <div key={section.title} className="bg-[#16213e] rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-white font-bold text-base">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-[#a8b2d8] text-sm">
                  <span className="text-[#6366f1] mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
