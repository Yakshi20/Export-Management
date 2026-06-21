import Product from "../models/product.js";
import { successResponse } from "../utils/response.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user.id });
    successResponse(res, "Products fetched successfully", products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    successResponse(res, "Product fetched successfully", product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      quantity,
      unit,
      pricePerUnit,
      availableFrom,
      category,
      images,
    } = req.body;

    const product = await Product.create({
      farmerId: req.user.id,
      productName,
      description,
      quantity,
      unit,
      pricePerUnit,
      availableFrom,
      category,
      images,
    });

    successResponse(res, "Product created successfully", product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    successResponse(res, "Product updated successfully", product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    successResponse(res, "Product deleted successfully", null);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    successResponse(res, `Product availability set to ${product.isAvailable}`, product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
