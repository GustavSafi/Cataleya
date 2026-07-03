import express from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { createCryptoCharge, isStubMode } from "../lib/crypto-payments.js";
import { sendOrderPlacedEmail, sendOrderPaidEmail, sendAdminNewOrderEmail } from "../lib/orderEmails.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }));

// GET /api/orders/payment-config — public, exposes the Zelle instructions shown at checkout
router.get("/payment-config", (req, res) => {
  res.json({
    zelle: {
      email: process.env.ZELLE_RECIPIENT_EMAIL || null,
      name: process.env.ZELLE_RECIPIENT_NAME || null,
    },
  });
});

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  qty: z.number().int().positive(),
});

const createOrderSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  shipping_address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }),
  items: z.array(orderItemSchema).min(1),
  discreet: z.boolean().optional().default(false),
  payment_method: z.enum(["zelle", "crypto"]),
});

// Admin gate — used by the order-management routes below.
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

// Best-effort: if an Authorization header is present and valid, link the order to that
// user; otherwise proceed as a guest checkout. Never rejects the request.
function tryGetUserId(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).sub;
  } catch {
    return null;
  }
}

// POST /api/orders — public (guest checkout allowed)
router.post("/", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, full_name, shipping_address, items, discreet, payment_method } = parsed.data;

  // Prices/quantities are currently trusted from the client since there's no backend
  // product catalog yet (the shop's prices live in the frontend). Fine for a first
  // release with manual payment confirmation, but worth a server-side price catalog
  // before this takes real money at scale.
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal; // shipping/discounts not modeled yet

  const userId = tryGetUserId(req);

  const { rows } = await pool.query(
    `INSERT INTO orders (user_id, email, full_name, shipping_address, items, subtotal, total, discreet, payment_method)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [userId, email, full_name, shipping_address, JSON.stringify(items), subtotal, total, discreet, payment_method]
  );

  const order = rows[0];
  sendOrderPlacedEmail(order).catch((err) => console.error("Failed to send order-placed email:", err));
  sendAdminNewOrderEmail(order).catch((err) => console.error("Failed to send admin new-order email:", err));

  res.status(201).json(order);
});

// GET /api/orders/admin/list?status=pending_payment — admin only. Lists orders newest
// first, optionally filtered by status. Declared before "/:id" so that path doesn't
// capture "admin".
router.get("/admin/list", requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.query;
  const params = [];
  let where = "";
  if (status) {
    params.push(status);
    where = `WHERE status = $${params.length}`;
  }
  const { rows } = await pool.query(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT 200`,
    params
  );
  res.json(rows);
});

// POST /api/orders/:id/mark-paid — admin only. Used to confirm Zelle payments by hand
// (and as a manual fallback for crypto). Idempotent: only emails on the transition to paid.
router.post("/:id/mark-paid", requireAuth, requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE orders SET status = 'paid', updated_at = now()
     WHERE id = $1 AND status != 'paid' RETURNING *`,
    [req.params.id]
  );
  if (rows.length === 0) {
    // Either the order doesn't exist or it was already paid — distinguish the two.
    const existing = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json(existing.rows[0]); // already paid, no-op
  }
  const order = rows[0];
  sendOrderPaidEmail(order).catch((err) => console.error("Failed to send order-paid email:", err));
  res.json(order);
});

// GET /api/orders/:id — public; the id is an unguessable UUID, used as the order's
// confirmation/payment-instructions link
router.get("/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(rows[0]);
});

// POST /api/orders/:id/crypto-checkout — creates (or returns the existing) hosted
// checkout URL for a crypto order
router.post("/:id/crypto-checkout", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }
  const order = rows[0];
  if (order.payment_method !== "crypto") {
    return res.status(400).json({ error: "This order is not a crypto order" });
  }
  if (order.crypto_hosted_url) {
    return res.json({ hosted_url: order.crypto_hosted_url });
  }

  try {
    const { chargeId, hostedUrl } = await createCryptoCharge({
      orderId: order.id,
      name: "Cattleya Labs order",
      amount: Number(order.total),
    });
    await pool.query(
      "UPDATE orders SET crypto_charge_id = $1, crypto_hosted_url = $2, updated_at = now() WHERE id = $3",
      [chargeId, hostedUrl, order.id]
    );
    res.json({ hosted_url: hostedUrl });
  } catch (err) {
    console.error("Crypto charge creation failed:", err);
    res.status(502).json({ error: "Could not create crypto checkout session" });
  }
});

// POST /api/orders/:id/simulate-paid — dev-only stand-in for the Coinbase webhook,
// only available when CRYPTO_PROVIDER is not set to "coinbase"
router.post("/:id/simulate-paid", async (req, res) => {
  if (!isStubMode()) {
    return res.status(404).json({ error: "Not found" });
  }
  const { rows } = await pool.query(
    "UPDATE orders SET status = 'paid', updated_at = now() WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }
  const order = rows[0];
  sendOrderPaidEmail(order).catch((err) => console.error("Failed to send order-paid email:", err));

  res.json(order);
});

export default router;
