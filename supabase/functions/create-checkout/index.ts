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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get store settings (owner's Stripe keys)
    const { data: settings, error: settingsError } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .single();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ error: "Store settings not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!settings.stripe_secret_key || !settings.stripe_connected) {
      return new Response(
        JSON.stringify({ error: "Payments are not set up yet. The store owner needs to connect Stripe in settings." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(settings.stripe_secret_key, { apiVersion: "2024-06-20" });

    const { items, success_url, cancel_url, customer_email } = await req.json();

    if (!items || !items.length) {
      return new Response(
        JSON.stringify({ error: "No items provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currency = (settings.currency || "usd").toLowerCase();

    // Build line items
    const line_items = items.map((item: { name: string; price: number; quantity: number; image?: string }) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Shipping calculation
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const freeShippingMin = Number(settings.free_shipping_min) || 75;
    const shippingFlat = Number(settings.shipping_flat) || 0;
    const needsShipping = subtotal < freeShippingMin && shippingFlat > 0;

    const sessionParams: Record<string, unknown> = {
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: success_url || `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"],
      },
    };

    if (customer_email) {
      sessionParams.customer_email = customer_email;
    }

    // Shipping options
    sessionParams.shipping_options = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: needsShipping ? Math.round(shippingFlat * 100) : 0,
            currency,
          },
          display_name: needsShipping ? "Standard Shipping" : "Free Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ];

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to create checkout session" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
