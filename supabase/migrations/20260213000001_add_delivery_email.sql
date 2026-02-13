-- Migration: Add delivery_email column to contracts
-- Created: 2026-02-13
-- Purpose: Store the email address where the contract PDF should be sent
-- (chosen by user at payment time, may differ from comprador's email)

ALTER TABLE contracts ADD COLUMN IF NOT EXISTS delivery_email TEXT;

COMMENT ON COLUMN contracts.delivery_email IS 'Email chosen at payment time for contract PDF delivery';
