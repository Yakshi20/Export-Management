import Buyer from "../models/buyer.js";
import { successResponse } from "../utils/response.js";

export const createBuyer = async (req, res) => {
  try {
    const { buyerName, companyName, email, phone, country, address, productInterested, status } = req.body;

    const buyer = await Buyer.create({
      buyerName,
      companyName,
      email,
      phone,
      country,
      address,
      productInterested,
      status,
      exporterId: req.user.id,
    });

    successResponse(res, "Buyer created successfully", buyer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find({ exporterId: req.user.id });
    successResponse(res, "Buyers fetched successfully", buyers);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuyerById = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);

    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    successResponse(res, "Buyer fetched successfully", buyer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    successResponse(res, "Buyer updated successfully", buyer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByIdAndDelete(req.params.id);

    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    successResponse(res, "Buyer deleted successfully", null);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
