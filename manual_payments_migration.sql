CREATE TABLE manual_payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id TEXT NOT NULL REFERENCES "StudentProfile"(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  matric_number TEXT NOT NULL,
  amount_paid NUMERIC(12,2) NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'school_fees',
  receipt_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_verification',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT
);

CREATE INDEX idx_manual_payments_status ON manual_payments(status);
CREATE INDEX idx_manual_payments_student ON manual_payments(student_id);
