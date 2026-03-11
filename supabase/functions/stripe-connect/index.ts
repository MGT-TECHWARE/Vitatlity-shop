import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const platformSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(platformSecretKey, { apiVersion: "2024-06-20" });

    const { action, return_url } = await req.json();

    if (action === "create_account_link") {
      // Check if we already have a connected account
      const { data: settings } = await supabase
        .from("store_settings")
        .select("stripe_account_id")
        .limit(1)
        .single();

      let accountId = settings?.stripe_account_id;

      // If no account exists yet, create one
      if (!accountId) {
        const account = await stripe.accounts.create({
          type: "standard",
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });
        accountId = account.id;

        // Store the account ID
        const { data: existing } = await supabase
          .from("store_settings")
          .select("id")
          .limit(1)
          .single();

        if (existing) {
          await supabase
            .from("store_settings")
            .update({
              stripe_account_id: accountId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        }
      }

      // Create an Account Link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: return_url || "http://localhost:3000/admin/settings",
        return_url: return_url || "http://localhost:3000/admin/settings",
        type: "account_onboarding",
      });

      return new Response(
        JSON.stringify({ url: accountLink.url, account_id: accountId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "account_status") {
      const { data: settings } = await supabase
        .from("store_settings")
        .select("stripe_account_id, stripe_connected")
        .limit(1)
        .single();

      if (!settings?.stripe_account_id) {
        return new Response(
          JSON.stringify({ connected: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check the account status on Stripe
      const account = await stripe.accounts.retrieve(settings.stripe_account_id);
      const isFullyOnboarded = account.charges_enabled && account.details_submitted;

      // Update our DB if onboarding just completed
      if (isFullyOnboarded && !settings.stripe_connected) {
        const { data: existing } = await supabase
          .from("store_settings")
          .select("id")
          .limit(1)
          .single();

        if (existing) {
          await supabase
            .from("store_settings")
            .update({
              stripe_connected: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        }
      }

      if (!isFullyOnboarded) {
        return new Response(
          JSON.stringify({
            connected: false,
            onboarding_incomplete: true,
            account_id: settings.stripe_account_id,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch dashboard data for a fully connected account
      let balance = null;
      let charges = [];
      try {
        balance = await stripe.balance.retrieve(
          { stripeAccount: settings.stripe_account_id }
        );
        const chargesList = await stripe.charges.list(
          { limit: 5 },
          { stripeAccount: settings.stripe_account_id }
        );
        charges = chargesList.data;
      } catch {
        // Account might not have charges/balance access yet
      }

      return new Response(
        JSON.stringify({
          connected: true,
          account: {
            id: account.id,
            business_name: account.business_profile?.name || account.settings?.dashboard?.display_name || "",
            email: account.email || "",
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
          },
          balance,
          charges,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "disconnect") {
      const { data: settings } = await supabase
        .from("store_settings")
        .select("stripe_account_id, id")
        .limit(1)
        .single();

      if (settings) {
        await supabase
          .from("store_settings")
          .update({
            stripe_account_id: "",
            stripe_connected: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settings.id);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Stripe Connect error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
