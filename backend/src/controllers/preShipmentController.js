export const getCountries = (req, res) => {
  res.json({
    success: true,
    countries: ["USA", "Germany", "UAE"],
  });
};

export const getProducts = (req, res) => {
  res.json({
    success: true,
    products: ["Coffee", "Pepper", "Rice"],
  });
};

export const checkCompliance = (req, res) => {
  res.json({
    success: true,
    message: "Compliance Approved",
  });
};

export const addBuyerDetails = (req, res) => {
  res.json({
    success: true,
    message: "Buyer details added",
  });
};

export const generateInvoice = (req, res) => {
  res.json({
    success: true,
    message: "Commercial Invoice generated",
  });
};

export const generateQuotation = (req, res) => {
  res.json({
    success: true,
    message: "Quotation generated",
  });
};

export const generateShippingBill = (req, res) => {
  res.json({
    success: true,
    message: "Shipping Bill draft generated",
  });
};

export const generatePackingList = (req, res) => {
  res.json({
    success: true,
    message: "Packing List generated",
  });
};