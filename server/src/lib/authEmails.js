import { sendEmail } from "./email.js";

// Sent once a user's email is verified and their account is active.
export async function sendWelcomeEmail(email) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  await sendEmail({
    to: email,
    subject: "Welcome to Cattleya Labs",
    html: `
      <p>Welcome to Cattleya Labs — your account is now active.</p>
      <p>You can browse our research-grade peptide catalog, read the full research
      profile for each compound, and check out with Zelle or cryptocurrency.</p>
      <p><a href="${frontendUrl}/shop">Browse the catalog</a></p>
      <p style="font-size:12px;color:#888;">All products are supplied strictly for
      laboratory and research use only. Not for human or animal consumption.</p>
    `,
  });
}
