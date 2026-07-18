import express from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { sendEmail } from "../lib/email.js";

const router = express.Router();
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));

const FORM_TYPES = ["contact", "wholesale", "ambassador"];

const submissionSchema = z.object({
  email: z.string().email(),
  // The rest of the fields vary per form; accept any flat string/array values.
  payload: z.record(z.union([z.string().max(5000), z.array(z.string().max(200)).max(20)])),
});

const SUBJECTS = {
  contact: "New contact message",
  wholesale: "New wholesale application",
  ambassador: "New ambassador application",
};

function payloadToHtml(payload) {
  return Object.entries(payload)
    .filter(([, v]) => (Array.isArray(v) ? v.length > 0 : String(v).trim() !== ""))
    .map(([k, v]) => `<p><strong>${k}:</strong> ${Array.isArray(v) ? v.join(", ") : v}</p>`)
    .join("");
}

// POST /api/forms/:type — public. Stores the submission and emails the operator.
router.post("/:type", async (req, res) => {
  const { type } = req.params;
  if (!FORM_TYPES.includes(type)) {
    return res.status(404).json({ error: "Unknown form" });
  }

  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, payload } = parsed.data;

  const { rows } = await pool.query(
    "INSERT INTO form_submissions (form_type, email, payload) VALUES ($1, $2, $3) RETURNING id",
    [type, email, JSON.stringify(payload)]
  );

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    sendEmail({
      to: adminEmail,
      subject: `${SUBJECTS[type]} — ${email}`,
      html: `
        <p>${SUBJECTS[type]} received via the website.</p>
        <p><strong>From:</strong> ${email}</p>
        ${payloadToHtml(payload)}
        <p style="font-size:12px;color:#888;">Submission ID: ${rows[0].id}</p>
      `,
    }).catch((err) => console.error(`Failed to email ${type} submission:`, err));
  }

  res.status(201).json({ message: "Submission received" });
});

export default router;
