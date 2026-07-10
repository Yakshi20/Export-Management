import ChaAgent from "../models/chaAgent.js";
import { successResponse } from "../utils/response.js";

export const createChaAgent = async (req, res) => {
  try {
    const { chaName, licenseNumber, port, phone, email, specialization, customsCharges } = req.body;

    const chaAgent = await ChaAgent.create({
      chaName,
      licenseNumber,
      port,
      phone,
      email,
      specialization,
      customsCharges,
      ownerId: req.user.id,
    });

    successResponse(res, "CHA added successfully", chaAgent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChaAgents = async (req, res) => {
  try {
    const chaAgents = await ChaAgent.find({ ownerId: req.user.id });
    successResponse(res, "CHAs fetched successfully", chaAgents);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChaAgentById = async (req, res) => {
  try {
    const chaAgent = await ChaAgent.findById(req.params.id);

    if (!chaAgent) {
      return res.status(404).json({ success: false, message: "CHA not found" });
    }

    successResponse(res, "CHA fetched successfully", chaAgent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateChaAgent = async (req, res) => {
  try {
    const chaAgent = await ChaAgent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!chaAgent) {
      return res.status(404).json({ success: false, message: "CHA not found" });
    }

    successResponse(res, "CHA updated successfully", chaAgent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteChaAgent = async (req, res) => {
  try {
    const chaAgent = await ChaAgent.findByIdAndDelete(req.params.id);

    if (!chaAgent) {
      return res.status(404).json({ success: false, message: "CHA not found" });
    }

    successResponse(res, "CHA deleted successfully", null);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
