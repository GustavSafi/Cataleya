-- Allow card as a payment method alongside zelle and crypto.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('zelle', 'crypto', 'card'));

-- Hosted-checkout session details for card orders, mirroring the crypto columns.
-- The gateway's own hosted page collects the card, so no card data is ever
-- stored here — only the session/transaction reference it gives us back.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS card_session_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS card_hosted_url TEXT;
