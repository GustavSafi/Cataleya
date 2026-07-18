import express from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/reviews?product_id=<id> — public, visible reviews newest first
router.get("/", async (req, res) => {
  const { product_id } = req.query;
  if (!product_id) {
    return res.status(400).json({ error: "product_id is required" });
  }
  const { rows } = await pool.query(
    `SELECT id, product_id, author_name, rating, title, body, created_at
     FROM reviews WHERE product_id = $1 AND is_visible = TRUE
     ORDER BY created_at DESC LIMIT 100`,
    [product_id]
  );
  res.json(rows);
});

const createSchema = z.object({
  product_id: z.string().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(10, "Review must be at least 10 characters").max(2000),
  author_name: z.string().max(60).optional(),
});

// POST /api/reviews — logged-in users only, one review per user per product
router.post("/", rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { product_id, rating, title, body, author_name } = parsed.data;

  // Default the display name to the part of their email before the @.
  const displayName = (author_name || "").trim() || req.user.email.split("@")[0];

  try {
    const { rows } = await pool.query(
      `INSERT INTO reviews (product_id, user_id, author_name, rating, title, body)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, product_id, author_name, rating, title, body, created_at`,
      [product_id, req.user.id, displayName, rating, title || null, body]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // unique index: one review per user per product
      return res.status(409).json({ error: "You've already reviewed this product" });
    }
    console.error("Review insert failed:", err);
    res.status(500).json({ error: "Could not save review" });
  }
});

export default router;
