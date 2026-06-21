export const trackShipment = (req, res) => {
  res.json({
    success: true,
    shipmentId: req.params.shipmentId,
    status: "In Transit",
    location: "Dubai Port",
    eta: "2026-07-10",
  });
};

export const getCurrencyExchange = (req, res) => {
  res.json({
    success: true,
    rates: {
      USD_INR: 83.25,
      EUR_INR: 91.50,
    },
  });
};

export const getBuyerShipmentDetails = (req, res) => {
  res.json({
    success: true,
    shipmentId: req.params.shipmentId,
    buyerName: "Global Traders LLC",
    country: "USA",
  });
};

export const addLetterOfCredit = (req, res) => {
  res.json({
    success: true,
    message: "Letter of Credit added",
  });
};