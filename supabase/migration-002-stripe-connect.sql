-- Migration: Switch from per-store Stripe keys to Stripe Connect OAuth
-- Run this in Supabase SQL Editor

-- Add the connected account ID column
ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS stripe_account_id text DEFAULT '';

-- Remove old key columns (they're no longer needed with Stripe Connect)
ALTER TABLE public.store_settings
  DROP COLUMN IF EXISTS stripe_publishable_key,
  DROP COLUMN IF EXISTS stripe_secret_key,
  DROP COLUMN IF EXISTS stripe_webhook_secret;
