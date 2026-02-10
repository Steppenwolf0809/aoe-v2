-- Migration: Allow anonymous contracts
-- Created: 2026-02-09
-- Purpose: Enable creating contracts before user authentication

-- 1. Add PENDING_PAYMENT to contract_status enum
ALTER TYPE contract_status ADD VALUE IF NOT EXISTS 'PENDING_PAYMENT' BEFORE 'PAID';

-- 2. Make user_id nullable (allow anonymous contracts)
ALTER TABLE contracts ALTER COLUMN user_id DROP NOT NULL;

-- 3. Add email column for anonymous contracts
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS email TEXT;

-- 4. Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contracts_email ON contracts(email) WHERE email IS NOT NULL;

-- 5. Update RLS policies to allow anonymous contract creation
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can create their own contracts" ON contracts;

-- Allow authenticated users to create contracts with their user_id
CREATE POLICY "Users can create their own contracts" ON contracts
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Allow users to read their own contracts (authenticated or by email)
DROP POLICY IF EXISTS "Users can view their own contracts" ON contracts;
CREATE POLICY "Users can view their own contracts" ON contracts
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND email IS NOT NULL)
  );

-- Allow service role to update contracts (for associating with user after payment)
DROP POLICY IF EXISTS "Service role can update contracts" ON contracts;
CREATE POLICY "Service role can update contracts" ON contracts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

COMMENT ON COLUMN contracts.user_id IS 'Nullable - allows anonymous contracts before authentication';
COMMENT ON COLUMN contracts.email IS 'For anonymous contracts - used to send PDF and claim contract later';
