import User from "../models/user.js";
import { successResponse } from "../utils/response.js";

export const getForwarderDirectory = async (req, res) => {
  try {
    const forwarders = await User.find({ role: "forwarder" }).select("email mobile mtoLicenseNumber");
    successResponse(res, "Forwarder directory fetched successfully", forwarders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
