-- ============================================================
-- Phlobot Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Advisor profiles (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS advisor_profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name         TEXT NOT NULL,
  company_name TEXT,
  phone        TEXT,
  email        TEXT NOT NULL,
  plan_tier    TEXT DEFAULT 'free',
  jobs_this_month INTEGER DEFAULT 0,
  billing_cycle_start TIMESTAMPTZ DEFAULT now(),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Examiners (managed by admin, interact only via SMS)
CREATE TABLE IF NOT EXISTS examiners (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL UNIQUE,
  zip_code     TEXT NOT NULL,
  lat          DECIMAL(10,8),
  lng          DECIMAL(11,8),
  radius_miles INTEGER DEFAULT 25,
  active       BOOLEAN DEFAULT true,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Job requests submitted by advisors
CREATE TABLE IF NOT EXISTS job_requests (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id           UUID REFERENCES advisor_profiles(id),
  patient_age          INTEGER,
  patient_gender       TEXT,
  patient_zip          TEXT NOT NULL,
  exam_type            TEXT,
  scheduling_type      TEXT NOT NULL, -- 'exact' | 'window' | 'multiple'
  -- JSON array of scheduling options:
  -- exact:    [{"date":"2025-04-17","time":"06:30"}]
  -- window:   [{"date":"2025-04-17","start":"09:00","end":"11:00"}]
  -- multiple: [{"date":"2025-04-17","start":"09:00","end":"11:00"},...]
  -- special:  [{"type":"any_weekday","start":"09:00","end":"11:00"}]
  scheduling_options   JSONB NOT NULL DEFAULT '[]',
  status               TEXT DEFAULT 'pending',
  -- pending | broadcast | assigned | completed | canceled | unfilled
  assigned_examiner_id UUID REFERENCES examiners(id),
  final_scheduled_time TIMESTAMPTZ,
  broadcast_at         TIMESTAMPTZ,
  assigned_at          TIMESTAMPTZ,
  completed_at         TIMESTAMPTZ,
  unfilled_notified_at TIMESTAMPTZ,
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- Tracks each SMS offer sent to an examiner for a job
CREATE TABLE IF NOT EXISTS job_offers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_request_id   UUID REFERENCES job_requests(id) ON DELETE CASCADE,
  examiner_id      UUID REFERENCES examiners(id),
  sms_sent_at      TIMESTAMPTZ DEFAULT now(),
  responded_at     TIMESTAMPTZ,
  response         TEXT DEFAULT 'pending', -- 'yes' | 'no' | 'pending'
  response_position INTEGER, -- 1 = winner, 2 = second, etc.
  minutes_after_winner INTEGER, -- how many minutes after the winner they responded
  created_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_request_id, examiner_id)
);

-- Audit log of all notifications sent
CREATE TABLE IF NOT EXISTS notification_log (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type TEXT, -- 'advisor' | 'examiner'
  recipient_id   UUID,
  channel        TEXT, -- 'sms' | 'email'
  type           TEXT, -- 'job_broadcast' | 'job_won' | 'job_missed' | 'job_connected' | etc.
  body           TEXT,
  sent_at        TIMESTAMPTZ DEFAULT now(),
  status         TEXT DEFAULT 'sent'
);

-- ============================================================
-- Row Level Security Policies
-- ============================================================

ALTER TABLE advisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE examiners ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Advisors can only see their own profile
CREATE POLICY "advisor_own_profile" ON advisor_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Advisors can only see their own jobs
CREATE POLICY "advisor_own_jobs" ON job_requests
  FOR ALL USING (
    advisor_id IN (
      SELECT id FROM advisor_profiles WHERE user_id = auth.uid()
    )
  );

-- Service role (used by API routes) bypasses RLS
-- This is handled automatically by using the service role key in API routes

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_job_requests_advisor ON job_requests(advisor_id);
CREATE INDEX IF NOT EXISTS idx_job_requests_status ON job_requests(status);
CREATE INDEX IF NOT EXISTS idx_job_requests_created ON job_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_offers_job ON job_offers(job_request_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_examiner ON job_offers(examiner_id);
CREATE INDEX IF NOT EXISTS idx_examiners_active ON examiners(active);
CREATE INDEX IF NOT EXISTS idx_examiners_phone ON examiners(phone);
