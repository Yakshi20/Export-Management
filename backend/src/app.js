import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Beginner
import beginnerAuthRoutes from "./routes/beginner/beginnerAuthRoutes.js";

// Exporter
import exporterAuthRoutes from "./routes/exporter/exporterAuthRoutes.js";
import preShipmentRoutes from "./routes/exporter/preShipmentRoutes.js";
import postShipmentRoutes from "./routes/exporter/postShipmentRoutes.js";

// Farmer
import farmerAuthRoutes from "./routes/farmer/farmerAuthRoutes.js";

// CHA
import chaAuthRoutes from "./routes/cha/chaAuthRoutes.js";

// Forwarder
import forwarderAuthRoutes from "./routes/forwarder/forwarderAuthRoutes.js";

// Adviser
import adviserAuthRoutes from "./routes/adviser/adviserAuthRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Running...");
});

// Normal Routes
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Role-Based Auth Routes
app.use("/api/beginner", beginnerAuthRoutes);

app.use("/api/exporter", exporterAuthRoutes);
app.use("/api/exporter/pre-shipment", preShipmentRoutes);
app.use("/api/exporter/post-shipment", postShipmentRoutes);

app.use("/api/farmer", farmerAuthRoutes);

app.use("/api/cha", chaAuthRoutes);

app.use("/api/forwarder", forwarderAuthRoutes);

app.use("/api/adviser", adviserAuthRoutes);

export default app;