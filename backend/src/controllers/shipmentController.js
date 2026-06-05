export const getShipments = (req, res) => {
  res.json({
    success: true,
    message: "All shipments fetched",
  });
};

export const getShipmentById = (req, res) => {
  res.json({
    success: true,
    shipmentId: req.params.id,
  });
};

export const createShipment = (req, res) => {
  res.json({
    success: true,
    message: "Shipment created",
  });
};

export const updateShipment = (req, res) => {
  res.json({
    success: true,
    shipmentId: req.params.id,
    message: "Shipment updated",
  });
};

export const deleteShipment = (req, res) => {
  res.json({
    success: true,
    shipmentId: req.params.id,
    message: "Shipment deleted",
  });
};