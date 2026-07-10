import User from "../models/user.js";
import { successResponse } from "../utils/response.js";

export const getChaDirectory = async (req, res) => {
  try {
    const chas = await User.find({ role: "cha" }).select("email mobile customBrokerLicense portCode");
    successResponse(res, "CHA directory fetched successfully", chas);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
