import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Running...");
});

// User Routes
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipments", shipmentRoutes);


export default app;