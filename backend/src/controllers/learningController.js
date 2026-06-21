export const getLearning = (req, res) => {
  res.json({
    success: true,
    data: {
      basic: [
        "What is Export?",
        "Who is Exporter?",
        "How export works?"
      ],

      advanced: [
        "Export Documentation",
        "Trade Compliance",
        "Customs Clearance"
      ],

      export: [
        "Pre Shipment",
        "Post Shipment",
        "International Payment Methods"
      ]
    }
  });
};