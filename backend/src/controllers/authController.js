import { successResponse } from "../utils/response.js";
import generateToken from "../utils/generateToken.js";

export const register = (req, res) => {
  successResponse(res, "User registered successfully");
};

export const login = (req, res) => {
  const token = generateToken("123");

  successResponse(res, "User logged in successfully", {
    token,
  });
};

export const profile = (req, res) => {
  successResponse(res, "Profile fetched");
};