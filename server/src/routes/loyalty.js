import express from "express";
// import { pool } from "../db/pool.js";
// import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Loyalty program is disabled for the initial release. The previous implementation let the
// client set its own points balance (points/lifetime_points/tier came straight from the
// request body), which was exploitable. When re-enabling, the server must own point
// calculation — award points only from server-side events (e.g. an order transitioning to
// "paid"), never from client input.
//
// Original handlers preserved below for reference:
//
// router.use(requireAuth);
//
// router.get("/", async (req, res) => {
//   const { user_id } = req.query;
//   if (user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });
//   const { rows } = await pool.query("SELECT * FROM loyalty_accounts WHERE user_id = $1", [user_id]);
//   res.json(rows);
// });
//
// router.post("/", async (req, res) => {
//   // DO NOT trust points from the client — this was the exploit. Compute server-side.
//   ...
// });

router.all("/*", (req, res) => {
  res.status(404).json({ error: "Loyalty program is not currently available" });
});

export default router;
