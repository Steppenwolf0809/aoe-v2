-- Migration: Add PDF generation and download columns to contracts
-- These columns are needed for the payment callback flow:
-- After payment confirmation, a PDF is generated and a download token is created.

-- PDF storage URL
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- SHA-256 hash of the PDF for integrity verification
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS pdf_hash TEXT;

-- Temporary download token (UUID) for unauthenticated PDF download
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS download_token TEXT;

-- Expiry time for the download token
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS download_token_expires_at TIMESTAMPTZ;

-- Payment amount (in USD)
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2);

-- PayPhone transaction ID (clientTransactionId during payment, then real PayPhone ID after confirm)
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Index on download_token for fast lookups from success page
CREATE INDEX IF NOT EXISTS idx_contracts_download_token
  ON contracts(download_token)
  WHERE download_token IS NOT NULL;

COMMENT ON COLUMN contracts.pdf_url IS 'Supabase Storage URL of the generated PDF';
COMMENT ON COLUMN contracts.pdf_hash IS 'SHA-256 hash of the PDF for integrity verification';
COMMENT ON COLUMN contracts.download_token IS 'UUID token for unauthenticated PDF download (valid for 7 days)';
COMMENT ON COLUMN contracts.download_token_expires_at IS 'Expiry timestamp for the download token';
COMMENT ON COLUMN contracts.amount IS 'Payment amount in USD';
