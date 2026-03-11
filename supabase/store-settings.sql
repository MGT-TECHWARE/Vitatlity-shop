-- Run this in Supabase SQL Editor to create the store_settings table

CREATE TABLE IF NOT EXISTS public.store_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name text NOT NULL DEFAULT 'Nexora',
  store_email text DEFAULT '',
  currency text NOT NULL DEFAULT 'USD',
  tax_rate numeric(5,2) NOT NULL DEFAULT 8.25,
  shipping_flat numeric(10,2) NOT NULL DEFAULT 5.99,
  free_shipping_min numeric(10,2) NOT NULL DEFAULT 75.00,
  stripe_account_id text DEFAULT '',
  stripe_connected boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Only allow one row (singleton settings)
CREATE UNIQUE INDEX IF NOT EXISTS store_settings_singleton ON public.store_settings ((true));

-- Insert default row
INSERT INTO public.store_settings (store_name) VALUES ('Nexora')
ON CONFLICT DO NOTHING;

-- RLS policies
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read non-sensitive settings (for storefront)
CREATE POLICY "Public can read publishable settings" ON public.store_settings
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only service_role can update (admin operations go through service_role)
CREATE POLICY "Service role can update settings" ON public.store_settings
  FOR UPDATE TO service_role
  USING (true);

CREATE POLICY "Service role can insert settings" ON public.store_settings
  FOR INSERT TO service_role
  WITH CHECK (true);
