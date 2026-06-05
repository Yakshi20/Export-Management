export const getCustomers = (req, res) => {
  res.json({
    success: true,
    message: "All customers fetched",
  });
};

export const getCustomerById = (req, res) => {
  res.json({
    success: true,
    customerId: req.params.id,
  });
};

export const createCustomer = (req, res) => {
  res.json({
    success: true,
    message: "Customer created",
  });
};

export const updateCustomer = (req, res) => {
  res.json({
    success: true,
    customerId: req.params.id,
    message: "Customer updated",
  });
};

export const deleteCustomer = (req, res) => {
  res.json({
    success: true,
    customerId: req.params.id,
    message: "Customer deleted",
  });
};