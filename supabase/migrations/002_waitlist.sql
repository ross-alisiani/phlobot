-- ============================================================
-- Waitlist signups — people in areas Phlobot doesn't serve yet
-- ============================================================

CREATE TABLE IF NOT EXISTS waitlist_signups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  city       TEXT,
  state      TEXT,
  zip_code   TEXT,
  type       TEXT NOT NULL DEFAULT 'examiner', -- 'examiner' | 'advisor'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, type)
);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- No public read access — admin only via service role
CREATE POLICY "waitlist_no_public_read" ON waitlist_signups
  FOR SELECT USING (false);

-- Anyone can insert (public signup form)
CREATE POLICY "waitlist_public_insert" ON waitlist_signups
  FOR INSERT WITH CHECK (true);
