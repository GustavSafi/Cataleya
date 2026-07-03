import { sendEmail } from "./email.js";

function formatItemsHtml(items) {
  return items
    .map((i) => `<li>${i.name} × ${i.qty} — $${(i.price * i.qty).toFixed(2)}</li>`)
    .join("");
}

export async function sendOrderPlacedEmail(order) {
  const shortId = order.id.slice(0, 8);
  const itemsHtml = formatItemsHtml(order.items);

  if (order.payment_method === "zelle") {
    const zelleEmail = process.env.ZELLE_RECIPIENT_EMAIL;
    const zelleName = process.env.ZELLE_RECIPIENT_NAME;
    await sendEmail({
      to: order.email,
      subject: `Order received — payment instructions (#${shortId})`,
      html: `
        <p>Thanks for your order, ${order.full_name}!</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total: $${Number(order.total).toFixed(2)}</strong></p>
        <p>To complete your order, send payment via Zelle to:</p>
        <p><strong>${zelleName || "Cattleya Labs"}</strong><br/>${zelleEmail || "(Zelle not yet configured)"}</p>
        <p>Please include <strong>${shortId}</strong> as the memo so we can match your payment.
        We'll email you once it's confirmed.</p>
      `,
    });
    return;
  }

  await sendEmail({
    to: order.email,
    subject: `Order received (#${shortId})`,
    html: `
      <p>Thanks for your order, ${order.full_name}!</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: $${Number(order.total).toFixed(2)}</strong></p>
      <p>Complete your crypto payment to confirm this order. We'll email you once it's received.</p>
    `,
  });
}

export async function sendOrderPaidEmail(order) {
  const shortId = order.id.slice(0, 8);
  await sendEmail({
    to: order.email,
    subject: `Payment received — order confirmed (#${shortId})`,
    html: `
      <p>Hi ${order.full_name}, your payment has been received and your order is confirmed!</p>
      <ul>${formatItemsHtml(order.items)}</ul>
      <p><strong>Total: $${Number(order.total).toFixed(2)}</strong></p>
      <p>We'll be in touch with shipping details shortly.</p>
    `,
  });
}

// Notifies the shop operator that a new order came in so they know to check the
// admin page (important for Zelle, where there's no automatic payment confirmation).
export async function sendAdminNewOrderEmail(order) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return; // no admin address configured — skip silently

  const shortId = order.id.slice(0, 8);
  const method = order.payment_method === "zelle" ? "Zelle (needs manual confirmation)" : "Crypto";
  await sendEmail({
    to: adminEmail,
    subject: `New order #${shortId} — ${order.payment_method.toUpperCase()} — $${Number(order.total).toFixed(2)}`,
    html: `
      <p>A new order has been placed.</p>
      <ul>${formatItemsHtml(order.items)}</ul>
      <p><strong>Total:</strong> $${Number(order.total).toFixed(2)}<br/>
      <strong>Payment:</strong> ${method}<br/>
      <strong>Customer:</strong> ${order.full_name} (${order.email})<br/>
      <strong>Order ID:</strong> ${order.id}</p>
      <p>Review it in the admin panel: <strong>/admin/orders</strong>${
        order.payment_method === "zelle"
          ? " — once the Zelle payment lands in your bank, mark it paid there."
          : "."
      }</p>
    `,
  });
}
