import { successResponse } from "../utils/response.js";

export const getUsers = (req, res) => {
  successResponse(res, "All users fetched");
};

export const getUserById = (req, res) => {
  successResponse(res, "User fetched", {
    userId: req.params.id,
  });
};

export const createUser = (req, res) => {
  successResponse(res, "User created");
};

export const updateUser = (req, res) => {
  successResponse(res, "User updated", {
    userId: req.params.id,
  });
};

export const deleteUser = (req, res) => {
  successResponse(res, "User deleted", {
    userId: req.params.id,
  });
};