export const getProducts = (req, res) => {
  res.json({
    success: true,
    message: "All products fetched",
  });
};

export const getProductById = (req, res) => {
  res.json({
    success: true,
    productId: req.params.id,
  });
};

export const createProduct = (req, res) => {
  res.json({
    success: true,
    message: "Product created",
  });
};

export const updateProduct = (req, res) => {
  res.json({
    success: true,
    productId: req.params.id,
    message: "Product updated",
  });
};

export const deleteProduct = (req, res) => {
  res.json({
    success: true,
    productId: req.params.id,
    message: "Product deleted",
  });
};