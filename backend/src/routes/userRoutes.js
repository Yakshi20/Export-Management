import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/:id", getUserById);

router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;