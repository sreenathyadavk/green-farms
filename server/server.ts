/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyPaymentSignature } from "./payment";
import { 
  saveOrder, 
  initializeSheets,
  getProducts, createProduct, updateProduct, deleteProduct,
  getInventory, updateInventoryStock, setInventoryStock,
  getOrders, updateOrderStatus,
  getAnalytics
} from "./sheet";

// Load secrets
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Idempotency cache (Prevent Replay Attacks)
// Stores processed Razorpay order IDs
const processedOrders = new Set<string>();

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Primary Endpoint
app.post("/save-order", async (req, res) => {
  try {
    const { payment, order } = req.body;

    if (!order) {
      return res.status(400).json({ success: false, error: "Missing order payload." });
    }

    // Razorpay Verification Flow
    if (process.env.VERIFY_RAZORPAY === "true" && order.paymentMethod === "online") {
      if (!payment || !payment.razorpay_order_id) {
        return res.status(400).json({ success: false, error: "Missing payment details." });
      }

      // 1. Replay Attack Prevention
      if (processedOrders.has(payment.razorpay_order_id)) {
        console.warn(`[Blocked] Replay attack detected for order ${payment.razorpay_order_id}`);
        return res.status(409).json({ success: false, error: "Order already processed." });
      }

      // 2. Cryptographic Verification
      const isValid = verifyPaymentSignature(payment);
      if (!isValid) {
        console.error(`[Blocked] Invalid signature for order ${payment.razorpay_order_id}`);
        return res.status(401).json({ success: false, error: "Invalid payment signature." });
      }

      // Mark as processed
      processedOrders.add(payment.razorpay_order_id);
      
      // Cleanup cache if it gets too large to prevent memory leaks on tiny VPS
      if (processedOrders.size > 10000) {
        processedOrders.clear();
      }
    }

    // Write to Google Sheets
    console.log(`Processing order: ${order.orderNumber}`);
    // 4. Save to Google Sheets
    await saveOrder(order);

    // 5. Update Inventory — use productId first, fallback to id
    for (const item of order.items || []) {
      const pid = item.productId || item.id;
      if (!pid) {
        console.warn(`[Inventory] Skipping item with no productId: ${item.name}`);
        continue;
      }
      await updateInventoryStock(pid, item.name, -item.qty);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
});

// --- REST API ENDPOINTS ---

// Products
app.get("/api/products", async (req, res) => {
  try {
    console.log(`[GET] /api/products`);
    const products = await getProducts();
    res.json(products);
  } catch (error: any) {
    console.error("[GET] /api/products error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.post("/api/products", async (req, res) => {
  try {
    console.log(`[POST] /api/products`, req.body);
    const product = await createProduct(req.body);
    res.json(product);
  } catch (error: any) {
    console.error("[POST] /api/products error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.put("/api/products/:id", async (req, res) => {
  try {
    console.log(`[PUT] /api/products/${req.params.id}`, req.body);
    const product = await updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error: any) {
    console.error(`[PUT] /api/products/${req.params.id} error:`, error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.delete("/api/products/:id", async (req, res) => {
  try {
    console.log(`[DELETE] /api/products/${req.params.id}`);
    await deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    console.error(`[DELETE] /api/products/${req.params.id} error:`, error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Inventory
app.get("/api/inventory", async (req, res) => {
  try {
    console.log(`[GET] /api/inventory`);
    const inventory = await getInventory();
    res.json(inventory);
  } catch (error: any) {
    console.error("[GET] /api/inventory error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.put("/api/inventory/:id/stock", async (req, res) => {
  try {
    console.log(`[PUT] /api/inventory/${req.params.id}/stock`, req.body);
    await setInventoryStock(req.params.id, req.body.stock);
    res.json({ success: true });
  } catch (error: any) {
    console.error(`[PUT] /api/inventory/${req.params.id}/stock error:`, error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Orders
app.get("/api/orders", async (req, res) => {
  try {
    console.log(`[GET] /api/orders`);
    const orders = await getOrders();
    res.json(orders);
  } catch (error: any) {
    console.error("[GET] /api/orders error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    console.log(`[PUT] /api/orders/${req.params.id}/status`, req.body);
    await updateOrderStatus(req.params.id, req.body.status);
    res.json({ success: true });
  } catch (error: any) {
    console.error(`[PUT] /api/orders/${req.params.id}/status error:`, error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Analytics
app.get("/api/analytics", async (req, res) => {
  try {
    console.log(`[GET] /api/analytics`);
    const stats = await getAnalytics();
    res.json(stats);
  } catch (error: any) {
    console.error("[GET] /api/analytics error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Start API with Dynamic Port Fallback
let currentPort = Number(PORT);

async function startServer() {
  await initializeSheets();

  const server = app.listen(currentPort, () => {
    console.log(`🚀 Tiny API running on port ${currentPort}`);
    console.log(`🔒 CORS Restricted to: ${FRONTEND_URL}`);
    console.log(`🛡️ Razorpay Verification: ${process.env.VERIFY_RAZORPAY === "true" ? "ENABLED" : "DISABLED"}`);
    if (currentPort !== Number(PORT)) {
      console.log(`\n⚠️  WARNING: Port ${PORT} was busy. We automatically switched to Port ${currentPort}.`);
      console.log(`👉  IMPORTANT: You MUST update the fetch URL in src/services/OrderService.ts to use port ${currentPort}!`);
    }
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}...`);
      currentPort++;
      startServer();
    } else {
      console.error(err);
    }
  });
}

startServer();
