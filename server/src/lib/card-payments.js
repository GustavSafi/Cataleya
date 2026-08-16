import "dotenv/config";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Gateways that have a real adapter implemented. Adding one here without
// implementing it below will (deliberately) fail loudly rather than silently
// fall back to the stub and appear to take money.
const REAL_PROVIDERS = ["nmi", "authorizenet", "stripe"];

/**
 * Card payments use a HOSTED REDIRECT flow: we ask the gateway to create a
 * payment session, send the customer to the gateway's own payment page, and
 * the gateway tells us the result (redirect back + webhook).
 *
 * This is deliberate — card details never touch this server, which keeps PCI
 * scope at SAQ A. Never add raw card number fields to the site.
 *
 * Every mainstream gateway supports this flow, so swapping providers is a
 * contained change:
 *   - NMI            → Payment API "sale" with a hosted payment page
 *   - Authorize.net  → Accept Hosted (getHostedPaymentPageRequest)
 *   - Stripe         → Checkout Session (mode: payment)
 */
async function createSessionViaGateway() {
  // No adapter implemented yet — a real merchant account + gateway is needed
  // first. Implement the chosen provider here and return { sessionId, hostedUrl }.
  throw new Error(
    `CARD_PROVIDER="${process.env.CARD_PROVIDER}" has no adapter implemented yet`
  );
}

// Local stand-in so the whole card order flow can be exercised end to end
// without a merchant account: create order -> "pay" -> order marked paid.
function createStubSession({ orderId }) {
  return {
    sessionId: `stub_card_${orderId}`,
    hostedUrl: `${FRONTEND_URL}/dev/card-stub/${orderId}`,
  };
}

export async function createCardSession({ orderId, amount, email }) {
  if (REAL_PROVIDERS.includes(process.env.CARD_PROVIDER)) {
    return createSessionViaGateway({ orderId, amount, email });
  }
  return createStubSession({ orderId });
}

export function isCardStubMode() {
  return !REAL_PROVIDERS.includes(process.env.CARD_PROVIDER);
}

/**
 * Whether to offer card at checkout at all.
 * A real gateway → always. Stub → only outside production, so a deployed site
 * never shows customers a card option that cannot actually take their money.
 */
export function isCardEnabled() {
  if (!isCardStubMode()) return true;
  return process.env.NODE_ENV !== "production";
}
