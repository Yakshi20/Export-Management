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
import buyerRoutes from "./routes/exporter/buyerRoutes.js";
import shipmentRoutes from "./routes/exporter/shipmentRoutes.js";
import chaDirectoryRoutes from "./routes/exporter/chaDirectoryRoutes.js";

// Farmer
import farmerAuthRoutes from "./routes/farmer/farmerAuthRoutes.js";
import farmerProductRoutes from "./routes/farmer/farmerProductRoutes.js";

// CHA
import chaAuthRoutes from "./routes/cha/chaAuthRoutes.js";
import chaShipmentRoutes from "./routes/cha/chaShipmentRoutes.js";
import chaAgentRoutes from "./routes/cha/chaAgentRoutes.js";

// Forwarder
import forwarderAuthRoutes from "./routes/forwarder/forwarderAuthRoutes.js";
import forwarderShipmentRoutes from "./routes/forwarder/forwarderShipmentRoutes.js";

// Adviser
import adviserAuthRoutes from "./routes/adviser/adviserAuthRoutes.js";
import adviserConsultationRoutes from "./routes/adviser/adviserConsultationRoutes.js";

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
app.use("/api/exporter/buyers", buyerRoutes);
app.use("/api/exporter/shipments", shipmentRoutes);
app.use("/api/exporter/cha-directory", chaDirectoryRoutes);

app.use("/api/farmer", farmerAuthRoutes);
app.use("/api/farmer", farmerProductRoutes);

app.use("/api/cha", chaAuthRoutes);
app.use("/api/cha", chaShipmentRoutes);
app.use("/api/cha/agents", chaAgentRoutes);

app.use("/api/forwarder", forwarderAuthRoutes);
app.use("/api/forwarder", forwarderShipmentRoutes);

app.use("/api/adviser", adviserAuthRoutes);
app.use("/api/adviser", adviserConsultationRoutes);

export default app;
