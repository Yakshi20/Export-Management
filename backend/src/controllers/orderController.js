export const getOrders = (req, res) => {
  res.json({
    success: true,
    message: "All orders fetched",
  });
};

export const getOrderById = (req, res) => {
  res.json({
    success: true,
    orderId: req.params.id,
  });
};

export const createOrder = (req, res) => {
  res.json({
    success: true,
    message: "Order created",
  });
};

export const updateOrder = (req, res) => {
  res.json({
    success: true,
    orderId: req.params.id,
    message: "Order updated",
  });
};

export const deleteOrder = (req, res) => {
  res.json({
    success: true,
    orderId: req.params.id,
    message: "Order deleted",
  });
};