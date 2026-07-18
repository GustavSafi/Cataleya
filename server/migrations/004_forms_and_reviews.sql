-- Submissions from the public contact / wholesale-application / ambassador-application
-- forms. Stored as a generic payload so each form can evolve without schema changes;
-- a copy is also emailed to ADMIN_EMAIL at submission time.
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'wholesale', 'ambassador')),
  email TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(form_type, created_at DESC);

-- Product reviews written by logged-in researchers.
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id, is_visible, created_at DESC);
-- One review per user per product (guests can't review; user_id is only null if the account is later deleted).
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_user_product ON reviews(user_id, product_id) WHERE user_id IS NOT NULL;
