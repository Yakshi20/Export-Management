import PDFDocument from "pdfkit";
import Shipment from "../models/shipment.js";
import Buyer from "../models/buyer.js";
import User from "../models/user.js";
import { successResponse } from "../utils/response.js";

const RESTRICTED_PRODUCTS = ["Arms", "Narcotics", "Wildlife"];
const RESTRICTED_COUNTRIES = ["North Korea", "Iran", "Syria"];

export const getCountries = (req, res) => {
  res.json({
    success: true,
    countries: [
      "USA", "Germany", "UAE", "United Kingdom", "China", "Japan", "Australia",
      "Canada", "France", "Italy", "Netherlands", "Singapore", "South Korea",
      "Brazil", "Mexico", "South Africa", "Saudi Arabia", "Turkey", "Indonesia",
      "Malaysia", "Thailand", "Vietnam", "Bangladesh", "Sri Lanka", "New Zealand",
    ],
  });
};

export const getProducts = (req, res) => {
  res.json({
    success: true,
    products: [
      "Coffee", "Pepper", "Rice", "Wheat", "Cotton", "Spices", "Tea",
      "Turmeric", "Cardamom", "Cumin", "Coriander", "Basmati Rice",
      "Shrimp", "Mango", "Cashew Nuts", "Sesame Seeds", "Groundnuts",
      "Soybean", "Maize", "Jute", "Silk", "Leather Goods", "Textiles",
      "Pharmaceutical Products", "Engineering Goods",
    ],
  });
};

export const checkCompliance = (req, res) => {
  try {
    const { productName, destinationCountry, iecCode, gstNumber } = req.body;
    const issues = [];

    // Check restricted products
    if (RESTRICTED_PRODUCTS.some((p) => productName?.toLowerCase().includes(p.toLowerCase()))) {
      issues.push(`Product "${productName}" is restricted for export.`);
    }

    // Check restricted countries
    if (RESTRICTED_COUNTRIES.includes(destinationCountry)) {
      issues.push(`Export to "${destinationCountry}" is not permitted.`);
    }

    // Validate IEC Code (must be 10 digits)
    if (!iecCode || !/^\d{10}$/.test(iecCode)) {
      issues.push("IEC Code must be exactly 10 digits.");
    }

    // Validate GST Number (must be 15 characters)
    if (!gstNumber || gstNumber.length !== 15) {
      issues.push("GST Number must be exactly 15 characters.");
    }

    if (issues.length > 0) {
      return res.status(200).json({
        success: true,
        passed: false,
        issues,
      });
    }

    res.json({
      success: true,
      passed: true,
      issues: [],
      message: "Compliance check passed. Product is cleared for export.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addBuyerDetails = async (req, res) => {
  try {
    const { shipmentId, buyerId } = req.body;

    const shipment = await Shipment.findByIdAndUpdate(
      shipmentId,
      { buyerId },
      { new: true }
    ).populate("buyerId");

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Buyer details added to shipment", shipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateQuotation = async (req, res) => {
  try {
    const {
      shipmentId,
      productName,
      quantity,
      unit,
      pricePerUnit,
      buyerName,
      companyName,
      destinationCountry,
    } = req.body;

    let data = { productName, quantity, unit, pricePerUnit, buyerName, companyName, destinationCountry };
    let exporterInfo = {};

    if (shipmentId) {
      const shipment = await Shipment.findById(shipmentId)
        .populate("exporterId", "companyName iecCode gstNumber email")
        .populate("buyerId");

      if (shipment) {
        data.productName = data.productName || shipment.productName;
        data.quantity = data.quantity || shipment.quantity;
        data.unit = data.unit || shipment.unit;
        data.destinationCountry = data.destinationCountry || shipment.destinationCountry;

        if (shipment.exporterId) {
          exporterInfo = shipment.exporterId;
        }
        if (shipment.buyerId) {
          data.buyerName = data.buyerName || shipment.buyerId.buyerName;
          data.companyName = data.companyName || shipment.buyerId.companyName;
        }
      }
    }

    const total = (data.quantity || 0) * (data.pricePerUnit || 0);

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=quotation.pdf");
    doc.pipe(res);

    // Title
    doc.fontSize(22).font("Helvetica-Bold").text("EXPORT QUOTATION", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica").text(`Date: ${new Date().toDateString()}`, { align: "right" });
    doc.moveDown();

    // Exporter Details
    doc.fontSize(12).font("Helvetica-Bold").text("Exporter Details:");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Company: ${exporterInfo.companyName || "N/A"}`);
    doc.text(`IEC Code: ${exporterInfo.iecCode || "N/A"}`);
    doc.text(`GST Number: ${exporterInfo.gstNumber || "N/A"}`);
    doc.text(`Email: ${exporterInfo.email || "N/A"}`);
    doc.moveDown();

    // Buyer Details
    doc.fontSize(12).font("Helvetica-Bold").text("Buyer Details:");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Buyer Name: ${data.buyerName || "N/A"}`);
    doc.text(`Company: ${data.companyName || "N/A"}`);
    doc.text(`Destination Country: ${data.destinationCountry || "N/A"}`);
    doc.moveDown();

    // Product Table
    doc.fontSize(12).font("Helvetica-Bold").text("Product Details:");
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica");

    const tableTop = doc.y;
    const col1 = 50, col2 = 200, col3 = 280, col4 = 360, col5 = 440;

    // Table header
    doc.font("Helvetica-Bold");
    doc.text("Product Name", col1, tableTop);
    doc.text("Quantity", col2, tableTop);
    doc.text("Unit", col3, tableTop);
    doc.text("Price/Unit (USD)", col4, tableTop);
    doc.text("Total (USD)", col5, tableTop);

    doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table row
    doc.font("Helvetica");
    const rowY = tableTop + 22;
    doc.text(data.productName || "N/A", col1, rowY);
    doc.text(String(data.quantity || 0), col2, rowY);
    doc.text(data.unit || "N/A", col3, rowY);
    doc.text(String(data.pricePerUnit || 0), col4, rowY);
    doc.text(String(total.toFixed(2)), col5, rowY);

    doc.moveTo(col1, rowY + 15).lineTo(550, rowY + 15).stroke();
    doc.moveDown(2);

    // Total
    doc.fontSize(12).font("Helvetica-Bold").text(`Grand Total: USD ${total.toFixed(2)}`, { align: "right" });
    doc.moveDown();

    // Terms
    doc.fontSize(10).font("Helvetica-Bold").text("Terms & Conditions:");
    doc.fontSize(9).font("Helvetica");
    doc.text("1. This quotation is valid for 30 days from the date of issue.");
    doc.text("2. Payment terms: Letter of Credit (LC) at sight.");
    doc.text("3. Shipment: Within 30 days of receipt of confirmed order.");
    doc.text("4. Prices are quoted in USD, FOB Indian Port.");

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    const { shipmentId, invoiceNumber, pricePerUnit } = req.body;

    let shipment = null;
    let buyer = null;
    let exporter = null;

    if (shipmentId) {
      shipment = await Shipment.findById(shipmentId)
        .populate("exporterId", "companyName iecCode gstNumber email")
        .populate("buyerId");

      if (shipment) {
        exporter = shipment.exporterId;
        buyer = shipment.buyerId;
      }
    }

    const quantity = shipment?.quantity || 0;
    const price = pricePerUnit || 0;
    const total = quantity * price;
    const invNo = invoiceNumber || `INV-${Date.now()}`;

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=commercial_invoice.pdf");
    doc.pipe(res);

    doc.fontSize(22).font("Helvetica-Bold").text("COMMERCIAL INVOICE", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica").text(`Invoice No: ${invNo}`, { align: "right" });
    doc.text(`Date: ${new Date().toDateString()}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Exporter (Seller):");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Company: ${exporter?.companyName || "N/A"}`);
    doc.text(`IEC Code: ${exporter?.iecCode || "N/A"}`);
    doc.text(`GST Number: ${exporter?.gstNumber || "N/A"}`);
    doc.text(`Email: ${exporter?.email || "N/A"}`);
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Buyer (Consignee):");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Name: ${buyer?.buyerName || "N/A"}`);
    doc.text(`Company: ${buyer?.companyName || "N/A"}`);
    doc.text(`Country: ${buyer?.country || shipment?.destinationCountry || "N/A"}`);
    doc.text(`Address: ${buyer?.address || "N/A"}`);
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Shipment Details:");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Shipment No: ${shipment?.shipmentNumber || "N/A"}`);
    doc.text(`Port of Loading: ${shipment?.portOfLoading || "N/A"}`);
    doc.text(`Port of Discharge: ${shipment?.portOfDischarge || "N/A"}`);
    doc.text(`Origin Country: ${shipment?.originCountry || "N/A"}`);
    doc.text(`Destination Country: ${shipment?.destinationCountry || "N/A"}`);
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Goods Description:");
    doc.moveDown(0.3);

    const tableTop = doc.y;
    const col1 = 50, col2 = 200, col3 = 270, col4 = 350, col5 = 440;
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Description", col1, tableTop);
    doc.text("HSN Code", col2, tableTop);
    doc.text("Qty", col3, tableTop);
    doc.text("Unit Price (USD)", col4, tableTop);
    doc.text("Amount (USD)", col5, tableTop);
    doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    const rowY = tableTop + 22;
    doc.font("Helvetica");
    doc.text(shipment?.productName || "N/A", col1, rowY);
    doc.text(shipment?.hsnCode || "N/A", col2, rowY);
    doc.text(`${quantity} ${shipment?.unit || ""}`, col3, rowY);
    doc.text(String(price), col4, rowY);
    doc.text(String(total.toFixed(2)), col5, rowY);
    doc.moveTo(col1, rowY + 15).lineTo(550, rowY + 15).stroke();

    doc.moveDown(2);
    doc.fontSize(12).font("Helvetica-Bold").text(`Total Amount: USD ${total.toFixed(2)}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(10).font("Helvetica").text("Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.");

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateShippingBill = async (req, res) => {
  try {
    const { shipmentId } = req.body;

    let shipment = null;
    let exporter = null;

    if (shipmentId) {
      shipment = await Shipment.findById(shipmentId)
        .populate("exporterId", "companyName iecCode gstNumber email")
        .populate("buyerId");
      exporter = shipment?.exporterId;
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=shipping_bill.pdf");
    doc.pipe(res);

    doc.fontSize(22).font("Helvetica-Bold").text("SHIPPING BILL (DRAFT)", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica").text(`Date: ${new Date().toDateString()}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Exporter Details:");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Company Name: ${exporter?.companyName || "N/A"}`);
    doc.text(`IEC Code: ${exporter?.iecCode || "N/A"}`);
    doc.text(`GST Number: ${exporter?.gstNumber || "N/A"}`);
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Shipment Information:");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Shipment Number: ${shipment?.shipmentNumber || "N/A"}`);
    doc.text(`Product Name: ${shipment?.productName || "N/A"}`);
    doc.text(`HSN Code: ${shipment?.hsnCode || "N/A"}`);
    doc.text(`Quantity: ${shipment?.quantity || "N/A"} ${shipment?.unit || ""}`);
    doc.text(`Port of Loading: ${shipment?.portOfLoading || "N/A"}`);
    doc.text(`Port of Discharge: ${shipment?.portOfDischarge || "N/A"}`);
    doc.text(`Origin Country: ${shipment?.originCountry || "N/A"}`);
    doc.text(`Destination Country: ${shipment?.destinationCountry || "N/A"}`);
    doc.text(`Expected Shipment Date: ${shipment?.expectedShipmentDate ? new Date(shipment.expectedShipmentDate).toDateString() : "N/A"}`);
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Customs Information:");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Compliance Status: ${shipment?.complianceStatus || "Pending"}`);
    doc.text(`Shipping Bill Verified: ${shipment?.shippingBillVerified ? "Yes" : "No"}`);
    doc.moveDown();

    doc.fontSize(9).font("Helvetica").text("This is a draft shipping bill for review purposes only. Final submission is subject to customs authority approval.", { color: "grey" });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generatePackingList = async (req, res) => {
  try {
    const { shipmentId, items } = req.body;

    let shipment = null;

    if (shipmentId) {
      shipment = await Shipment.findById(shipmentId).populate("exporterId", "companyName");
    }

    const packingItems = items || [
      {
        description: shipment?.productName || "Product",
        quantity: shipment?.quantity || 0,
        unit: shipment?.unit || "Units",
        netWeight: 0,
        grossWeight: 0,
        packages: 1,
      },
    ];

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=packing_list.pdf");
    doc.pipe(res);

    doc.fontSize(22).font("Helvetica-Bold").text("PACKING LIST", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica").text(`Date: ${new Date().toDateString()}`, { align: "right" });
    doc.text(`Shipment No: ${shipment?.shipmentNumber || "N/A"}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Exporter:");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Company: ${shipment?.exporterId?.companyName || "N/A"}`);
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Item Breakdown:");
    doc.moveDown(0.3);

    const tableTop = doc.y;
    const cols = [50, 180, 250, 310, 380, 450];
    doc.font("Helvetica-Bold").fontSize(9);
    doc.text("Description", cols[0], tableTop);
    doc.text("Qty", cols[1], tableTop);
    doc.text("Unit", cols[2], tableTop);
    doc.text("Net Wt (kg)", cols[3], tableTop);
    doc.text("Gross Wt (kg)", cols[4], tableTop);
    doc.text("Packages", cols[5], tableTop);

    doc.moveTo(cols[0], tableTop + 14).lineTo(540, tableTop + 14).stroke();

    let rowY = tableTop + 20;
    let totalPackages = 0;
    let totalNetWeight = 0;
    let totalGrossWeight = 0;

    for (const item of packingItems) {
      doc.font("Helvetica").fontSize(9);
      doc.text(item.description || "N/A", cols[0], rowY);
      doc.text(String(item.quantity || 0), cols[1], rowY);
      doc.text(item.unit || "N/A", cols[2], rowY);
      doc.text(String(item.netWeight || 0), cols[3], rowY);
      doc.text(String(item.grossWeight || 0), cols[4], rowY);
      doc.text(String(item.packages || 1), cols[5], rowY);
      rowY += 20;
      totalPackages += item.packages || 1;
      totalNetWeight += item.netWeight || 0;
      totalGrossWeight += item.grossWeight || 0;
    }

    doc.moveTo(cols[0], rowY).lineTo(540, rowY).stroke();
    rowY += 8;

    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Totals:", cols[0], rowY);
    doc.text(String(totalNetWeight), cols[3], rowY);
    doc.text(String(totalGrossWeight), cols[4], rowY);
    doc.text(String(totalPackages), cols[5], rowY);

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
