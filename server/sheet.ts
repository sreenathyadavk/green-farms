/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
import { GoogleSpreadsheet } from "google-spreadsheet";

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_STOCK = 0;
const DEFAULT_LOW_STOCK_THRESHOLD = 10;

// ─── Singleton Google Sheets Connection ──────────────────────────────────────

let docPromise: Promise<GoogleSpreadsheet | null> | null = null;

async function getDoc(): Promise<GoogleSpreadsheet | null> {
  if (docPromise) return docPromise;

  docPromise = (async () => {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (!sheetId || !credentialsJson) {
      console.warn("⚠️ Google Sheets credentials missing. Skipping Sheets sync.");
      return null;
    }

    try {
      const creds = JSON.parse(credentialsJson);
      const { JWT } = require("google-auth-library");
      const jwt = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const doc = new GoogleSpreadsheet(sheetId, jwt);
      await doc.loadInfo();
      console.log("✅ Connected to Google Sheets.");
      return doc;
    } catch (error) {
      console.error("Failed to authenticate with Google Sheets:", error);
      return null;
    }
  })();

  return docPromise;
}

async function ensureHeaders(sheet: any, headers: string[]) {
  try {
    await sheet.loadHeaderRow();
    if (sheet.headerValues.length === 0) throw new Error("Empty headers");
  } catch (error) {
    await sheet.setHeaderRow(headers);
    console.log(`✅ Set headers for ${sheet.title} sheet.`);
  }
}

// ─── Sheet Schemas ───────────────────────────────────────────────────────────

export const SHEET_SCHEMAS = {
  Products: ["ID", "Name", "Description", "Price", "Image", "Type", "Tags", "Badges", "Discount", "Discount Label", "Created At", "Updated At"],
  Orders: ["Order Number", "Customer Name", "Phone", "Address", "Items", "Subtotal", "Delivery", "Total", "Payment Method", "Status", "Date"],
  Inventory: ["Product ID", "Product Name", "Stock", "Low Stock Threshold", "Updated At"],
  Sales: ["Order ID", "Revenue", "Payment Method", "Created At"]
};

// ─── Startup: Initialize Sheets & Run Integrity Check ────────────────────────

export async function initializeSheets() {
  const document = await getDoc();
  if (!document) return;

  // 1. Ensure all sheets exist with correct headers
  for (const [title, headers] of Object.entries(SHEET_SCHEMAS)) {
    let sheet = document.sheetsByTitle[title];
    if (!sheet) {
      console.log(`📦 Creating missing sheet: ${title}...`);
      sheet = await document.addSheet({ title, headerValues: headers });
      console.log(`✅ Created ${title} sheet.`);
    } else {
      await ensureHeaders(sheet, headers);
    }
  }

  // 2. Run startup integrity check
  await repairInventoryIntegrity(document);
}

/**
 * One-time integrity check: cross-reference Products and Inventory.
 * - Creates missing Inventory rows for orphan Products.
 * - Removes orphan Inventory rows for deleted Products.
 * - Purely ID-driven: Product ID is the relationship key.
 */
async function repairInventoryIntegrity(document: GoogleSpreadsheet) {
  console.log("🔍 Running Inventory integrity check...");

  const prodSheet = document.sheetsByTitle["Products"];
  const invSheet = document.sheetsByTitle["Inventory"];
  if (!prodSheet || !invSheet) return;

  const prodRows = await prodSheet.getRows();
  const invRows = await invSheet.getRows();

  // Build ID map: assign/persist stable IDs for rows missing them
  const productMap: Record<string, { name: string; rowRef: any }> = {};
  for (const row of prodRows) {
    let id = row.get("ID");
    if (!id) {
      // Persist a stable ID to the sheet so it's never "manual" again
      id = `prod-${Date.now()}-${row.rowNumber}`;
      row.set("ID", id);
      await row.save();
      console.log(`  🔧 Backfilled missing ID for product "${row.get("Name")}" → ${id}`);
    }
    productMap[id] = { name: row.get("Name"), rowRef: row };
  }

  // Build inventory map keyed by Product ID
  const invMap: Record<string, any> = {};
  for (const row of invRows) {
    const pid = row.get("Product ID");
    if (pid) invMap[pid] = row;
  }

  // Forward check: every Product must have an Inventory row
  for (const [productId, { name }] of Object.entries(productMap)) {
    if (!invMap[productId]) {
      await invSheet.addRow({
        "Product ID": productId,
        "Product Name": name,
        "Stock": DEFAULT_STOCK,
        "Low Stock Threshold": DEFAULT_LOW_STOCK_THRESHOLD,
        "Updated At": new Date().toISOString()
      });
      console.log(`  ✅ Created missing Inventory row for "${name}" (${productId})`);
    }
  }

  // Reverse check: every Inventory row must reference a live Product
  for (const [invProductId, invRow] of Object.entries(invMap)) {
    if (!productMap[invProductId]) {
      await invRow.delete();
      console.log(`  🗑️  Removed orphan Inventory row for deleted product ID: ${invProductId}`);
    }
  }

  console.log("✅ Inventory integrity check complete.");
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts() {
  const document = await getDoc();
  if (!document) return [];
  const sheet = document.sheetsByTitle["Products"];
  if (!sheet) return [];

  const rows = await sheet.getRows();
  return rows.map(row => {
    let tags: any[] = [];
    let badges: any[] = [];
    try { tags = row.get("Tags") ? JSON.parse(row.get("Tags")) : []; } catch (e) { console.error(`Bad JSON in Tags for product ${row.get("ID")}`); }
    try { badges = row.get("Badges") ? JSON.parse(row.get("Badges")) : []; } catch (e) { console.error(`Bad JSON in Badges for product ${row.get("ID")}`); }

    return {
      id: row.get("ID"),
      name: row.get("Name"),
      description: row.get("Description"),
      price: Number(row.get("Price")),
      image: row.get("Image"),
      type: row.get("Type"),
      tags,
      badges,
      discount: Number(row.get("Discount")) || 0,
      discountLabel: row.get("Discount Label") || undefined,
      createdAt: row.get("Created At"),
      updatedAt: row.get("Updated At")
    };
  });
}

export async function createProduct(product: any) {
  const document = await getDoc();
  if (!document) return null;

  const prodSheet = document.sheetsByTitle["Products"];
  const invSheet = document.sheetsByTitle["Inventory"];

  // Ensure a stable ID is always set
  const productId = product.id || `prod-${Date.now()}`;

  await prodSheet.addRow({
    "ID": productId,
    "Name": product.name,
    "Description": product.description || "",
    "Price": product.price,
    "Image": product.image || "",
    "Type": product.type,
    "Tags": JSON.stringify(product.tags || []),
    "Badges": JSON.stringify(product.badges || []),
    "Discount": product.discount || 0,
    "Discount Label": product.discountLabel || "",
    "Created At": new Date().toISOString(),
    "Updated At": new Date().toISOString()
  });
  console.log(`[Products] Created: "${product.name}" (${productId})`);

  // ✅ Auto-create matching Inventory row (ID-keyed)
  if (invSheet) {
    await invSheet.addRow({
      "Product ID": productId,
      "Product Name": product.name,
      "Stock": DEFAULT_STOCK,
      "Low Stock Threshold": DEFAULT_LOW_STOCK_THRESHOLD,
      "Updated At": new Date().toISOString()
    });
    console.log(`[Inventory] Auto-created row for "${product.name}" (${productId})`);
  }

  return { ...product, id: productId };
}

export async function updateProduct(id: string, partial: any) {
  const document = await getDoc();
  if (!document) return null;

  const prodSheet = document.sheetsByTitle["Products"];
  const invSheet = document.sheetsByTitle["Inventory"];

  const prodRows = await prodSheet.getRows();
  const row = prodRows.find(r => r.get("ID") === id);

  if (!row) throw new Error(`Product not found: ${id}`);

  if (partial.name !== undefined) row.set("Name", partial.name);
  if (partial.description !== undefined) row.set("Description", partial.description);
  if (partial.price !== undefined) row.set("Price", partial.price);
  if (partial.image !== undefined) row.set("Image", partial.image);
  if (partial.type !== undefined) row.set("Type", partial.type);
  if (partial.tags !== undefined) row.set("Tags", JSON.stringify(partial.tags));
  if (partial.badges !== undefined) row.set("Badges", JSON.stringify(partial.badges));
  if (partial.discount !== undefined) row.set("Discount", partial.discount);
  if (partial.discountLabel !== undefined) row.set("Discount Label", partial.discountLabel);
  row.set("Updated At", new Date().toISOString());
  await row.save();
  console.log(`[Products] Updated: ${id}`);

  // ✅ Cascade: sync Product Name change to Inventory (using Product ID as key)
  if (partial.name !== undefined && invSheet) {
    const invRows = await invSheet.getRows();
    const invRow = invRows.find(r => r.get("Product ID") === id);
    if (invRow) {
      invRow.set("Product Name", partial.name);
      await invRow.save();
      console.log(`[Inventory] Synced name change for ${id}: "${partial.name}"`);
    }
  }

  return { ...partial, id };
}

export async function deleteProduct(id: string) {
  const document = await getDoc();
  if (!document) return;

  const prodSheet = document.sheetsByTitle["Products"];
  const invSheet = document.sheetsByTitle["Inventory"];

  // Delete from Products sheet
  const prodRows = await prodSheet.getRows();
  const prodRow = prodRows.find(r => r.get("ID") === id);
  if (prodRow) {
    await prodRow.delete();
    console.log(`[Products] Deleted: ${id}`);
  }

  // ✅ Cascade: delete matching Inventory row (ID-keyed)
  if (invSheet) {
    const invRows = await invSheet.getRows();
    const invRow = invRows.find(r => r.get("Product ID") === id);
    if (invRow) {
      await invRow.delete();
      console.log(`[Inventory] Cascade-deleted Inventory row for ${id}`);
    }
  }
}

// ─── Inventory ───────────────────────────────────────────────────────────────

/**
 * Returns inventory, guaranteed to include every Product.
 * If any Product is missing an Inventory row, it is created on-the-fly.
 * Product ID is always the primary key. Never uses Product Name as key.
 */
export async function getInventory() {
  const document = await getDoc();
  if (!document) return [];

  const prodSheet = document.sheetsByTitle["Products"];
  const invSheet = document.sheetsByTitle["Inventory"];
  if (!invSheet || !prodSheet) return [];

  const prodRows = await prodSheet.getRows();
  const invRows = await invSheet.getRows();

  // Build inventory map keyed by Product ID
  const invMap: Record<string, any> = {};
  for (const row of invRows) {
    const pid = row.get("Product ID");
    if (pid) invMap[pid] = row;
  }

  const result = [];
  for (const pRow of prodRows) {
    const productId = pRow.get("ID");
    if (!productId) continue; // skip rows without ID (shouldn't happen after startup repair)

    const productName = pRow.get("Name");
    let invRow = invMap[productId];

    if (!invRow) {
      // Self-heal: create missing Inventory row
      invRow = await invSheet.addRow({
        "Product ID": productId,
        "Product Name": productName,
        "Stock": DEFAULT_STOCK,
        "Low Stock Threshold": DEFAULT_LOW_STOCK_THRESHOLD,
        "Updated At": new Date().toISOString()
      });
      console.log(`[Inventory] Self-healed missing row for "${productName}" (${productId})`);
    }

    result.push({
      productId,
      productName: invRow.get("Product Name") || productName,
      stock: Number(invRow.get("Stock")) || 0,
      threshold: Number(invRow.get("Low Stock Threshold")) || DEFAULT_LOW_STOCK_THRESHOLD,
      updatedAt: invRow.get("Updated At")
    });
  }

  return result;
}

/**
 * Set absolute stock level. Creates Inventory row if it doesn't exist.
 * Pure ID-driven. Never falls back to name matching.
 */
export async function setInventoryStock(productId: string, stock: number) {
  const document = await getDoc();
  if (!document) return;

  const prodSheet = document.sheetsByTitle["Products"];
  const invSheet = document.sheetsByTitle["Inventory"];

  const invRows = await invSheet.getRows();
  let row = invRows.find(r => r.get("Product ID") === productId);

  if (!row) {
    // Self-heal: look up product name from Products sheet, then create row
    let productName = productId; // safe fallback
    if (prodSheet) {
      const prodRows = await prodSheet.getRows();
      const prodRow = prodRows.find(r => r.get("ID") === productId);
      if (prodRow) productName = prodRow.get("Name") || productId;
    }
    row = await invSheet.addRow({
      "Product ID": productId,
      "Product Name": productName,
      "Stock": stock,
      "Low Stock Threshold": DEFAULT_LOW_STOCK_THRESHOLD,
      "Updated At": new Date().toISOString()
    });
    console.log(`[Inventory] Auto-created row for ${productId} with stock=${stock}`);
    return;
  }

  row.set("Stock", stock);
  row.set("Updated At", new Date().toISOString());
  await row.save();
  console.log(`[Inventory] Set stock for ${productId} → ${stock}`);
}

/**
 * Adjust stock by a delta (positive or negative).
 * Creates Inventory row if it doesn't exist.
 * Pure ID-driven.
 */
export async function updateInventoryStock(productId: string, productName: string, delta: number) {
  const document = await getDoc();
  if (!document) return;

  const invSheet = document.sheetsByTitle["Inventory"];
  const rows = await invSheet.getRows();
  let row = rows.find(r => r.get("Product ID") === productId);

  if (!row) {
    // Self-heal: create the row
    const newStock = Math.max(0, delta);
    await invSheet.addRow({
      "Product ID": productId,
      "Product Name": productName,
      "Stock": newStock,
      "Low Stock Threshold": DEFAULT_LOW_STOCK_THRESHOLD,
      "Updated At": new Date().toISOString()
    });
    console.log(`[Inventory] Auto-created row for ${productId} with stock=${newStock}`);
    return;
  }

  const currentStock = Number(row.get("Stock")) || 0;
  const newStock = Math.max(0, currentStock + delta);
  row.set("Stock", newStock);
  row.set("Updated At", new Date().toISOString());
  await row.save();
  console.log(`[Inventory] Adjusted stock for ${productId}: ${currentStock} → ${newStock}`);
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function saveOrder(order: any) {
  const document = await getDoc();
  if (!document) return;

  try {
    const sheet = document.sheetsByTitle["Orders"];
    if (!sheet) { console.warn("Orders sheet not found"); return; }

    // Human-readable items string with embedded price for re-parsing
    // Format: "Hydro Cherry Tomatoes x2 (₹140) | Premium Lettuce x1 (₹75)"
    const itemsString = (order.items || []).map((i: any) =>
      `${i.name} x${i.qty} (₹${i.priceValue || 0})`
    ).join(" | ");

    await sheet.addRow({
      "Order Number": order.orderNumber,
      "Customer Name": order.customerName,
      "Phone": order.customerPhone,
      "Address": order.customerAddress,
      "Items": itemsString,
      "Subtotal": order.subtotal,
      "Delivery": order.delivery || 100,
      "Total": order.total,
      "Payment Method": order.paymentMethod,
      "Status": order.status || "pending",
      "Date": new Date(order.createdAt).toLocaleString()
    });
    console.log(`✅ Order ${order.orderNumber} saved to Orders tab.`);

    // Auto-update Sales tab
    const salesSheet = document.sheetsByTitle["Sales"];
    if (salesSheet) {
      await salesSheet.addRow({
        "Order ID": order.orderNumber,
        "Revenue": order.total,
        "Payment Method": order.paymentMethod,
        "Created At": new Date(order.createdAt).toISOString()
      });
    }
  } catch (err) {
    console.error("Error saving order to sheets:", err);
  }
}

export async function getOrders() {
  const document = await getDoc();
  if (!document) return [];
  const sheet = document.sheetsByTitle["Orders"];
  if (!sheet) return [];

  const rows = await sheet.getRows();
  return rows.map(row => {
    let items: any[] = [];
    try {
      const raw = row.get("Items");
      if (raw) {
        try {
          items = JSON.parse(raw);
        } catch {
          // Parse human-readable format: "Name xQty (₹Price) | ..."
          items = raw.split(" | ").map((str: string) => {
            const parts = str.split(" x");
            const name = parts[0]?.trim();
            const qtyPart = parts[1]?.split(" ")[0];
            const qty = parseInt(qtyPart) || 1;
            const priceMatch = parts[1]?.match(/\(₹(\d+)\)/);
            const priceValue = priceMatch ? parseInt(priceMatch[1]) : 0;
            return { name, qty, priceValue };
          });
        }
      }
    } catch (e) {
      console.error(`Error processing Items for order ${row.get("Order Number") || row.get("Order ID")}:`, e);
    }

    return {
      id: row.get("Order Number") || row.get("Order ID"),
      orderNumber: row.get("Order Number") || row.get("Order ID"),
      customerName: row.get("Customer Name"),
      customerPhone: row.get("Phone"),
      customerAddress: row.get("Address"),
      items,
      subtotal: Number(row.get("Subtotal")) || 0,
      discount: Number(row.get("Discount")) || 0,
      delivery: Number(row.get("Delivery")) || 100,
      total: Number(row.get("Total")) || 0,
      paymentMethod: row.get("Payment Method"),
      paymentStatus: row.get("Status") === "pending" ? "pending" : "paid",
      status: row.get("Status") || row.get("Order Status") || "pending",
      createdAt: row.get("Date") || row.get("Created At")
    };
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const document = await getDoc();
  if (!document) return null;
  const sheet = document.sheetsByTitle["Orders"];
  if (!sheet) return null;

  const rows = await sheet.getRows();
  const row = rows.find(r => (r.get("Order Number") === orderId) || (r.get("Order ID") === orderId));
  if (!row) return null;

  row.set("Status", status);
  await row.save();
  console.log(`[Orders] Updated status for ${orderId} → ${status}`);
  return getOrders().then(orders => orders.find(o => o.id === orderId));
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getAnalytics() {
  const document = await getDoc();
  if (!document) {
    return { todayRevenue: 0, todayOrders: 0, weekRevenue: 0, weekOrders: 0, totalRevenue: 0, totalOrders: 0, dailyStats: [], topProducts: [] };
  }

  const sheet = document.sheetsByTitle["Orders"];
  if (!sheet) return { todayRevenue: 0, todayOrders: 0, weekRevenue: 0, weekOrders: 0, totalRevenue: 0, totalOrders: 0, dailyStats: [], topProducts: [] };
  
  const rows = await sheet.getRows();

  let todayRevenue = 0, todayOrders = 0, weekRevenue = 0, weekOrders = 0, totalRevenue = 0;
  const totalOrders = rows.length;
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dailyMap: Record<string, { revenue: number; orders: number }> = {};
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};

  rows.forEach(row => {
    const total = Number(row.get("Total")) || 0;
    const createdAt = row.get("Date") || row.get("Created At") || "";
    const orderDate = new Date(createdAt);
    const dateStr = !isNaN(orderDate.getTime()) ? orderDate.toISOString().split("T")[0] : "Unknown";

    totalRevenue += total;
    if (dateStr === todayStr) { todayRevenue += total; todayOrders += 1; }
    if (orderDate >= oneWeekAgo) { weekRevenue += total; weekOrders += 1; }

    if (!dailyMap[dateStr]) dailyMap[dateStr] = { revenue: 0, orders: 0 };
    dailyMap[dateStr].revenue += total;
    dailyMap[dateStr].orders += 1;

    // Parse items for Top Products
    try {
      const rawItems = row.get("Items");
      if (rawItems) {
        let items: any[] = [];
        try {
          items = JSON.parse(rawItems);
        } catch {
          items = rawItems.split(" | ").map((str: string) => {
            const parts = str.split(" x");
            const name = parts[0]?.trim();
            const qtyPart = parts[1]?.split(" ")[0];
            const qty = parseInt(qtyPart) || 1;
            const priceMatch = parts[1]?.match(/\(₹(\d+)\)/);
            const priceValue = priceMatch ? parseInt(priceMatch[1]) : 0;
            return { name, qty, priceValue };
          });
        }

        items.forEach((item: any) => {
          const key = item.productId || item.id || item.name;
          if (!key) return;
          if (!productMap[key]) productMap[key] = { name: item.name, qty: 0, revenue: 0 };
          productMap[key].qty += item.qty;
          productMap[key].revenue += item.qty * (Number(item.priceValue) || 0);
        });
      }
    } catch (e) {
      console.error("Failed to parse items for analytics:", e);
    }
  });

  const dailyStats = Object.keys(dailyMap).sort().slice(-7).map(date => ({ date, ...dailyMap[date] }));
  const topProducts = Object.keys(productMap).map(k => ({ productId: k, ...productMap[k] })).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return { todayRevenue, todayOrders, weekRevenue, weekOrders, totalRevenue, totalOrders, dailyStats, topProducts };
}
