import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const platformSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Stripe with the PLATFORM's secret key
    const stripe = new Stripe(platformSecretKey, { apiVersion: "2024-06-20" });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // Verify webhook signature
    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
      }
    } else {
      event = JSON.parse(body);
    }

    // For Connect webhooks, event.account contains the connected account ID
    const connectedAccountId = (event as any).account;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, stripe, session, connectedAccountId);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await supabase
            .from("orders")
            .update({ payment_status: "refunded", updated_at: new Date().toISOString() })
            .eq("stripe_payment_intent_id", charge.payment_intent);
        }
        break;
      }
      case "account.application.deauthorized": {
        // Connected account disconnected from the platform
        if (connectedAccountId) {
          await supabase
            .from("store_settings")
            .update({
              stripe_account_id: "",
              stripe_connected: false,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_account_id", connectedAccountId);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 500 });
  }
});

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createClient>,
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  connectedAccountId?: string,
) {
  // Idempotency — don't process the same session twice
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent_id", session.payment_intent)
    .single();

  if (existingOrder) {
    console.log("Order already exists, skipping");
    return;
  }

  // Get line items from the connected account
  const stripeOpts = connectedAccountId ? { stripeAccount: connectedAccountId } : {};
  const lineItems = await stripe.checkout.sessions.listLineItems(
    session.id,
    { expand: ["data.price.product"] },
    stripeOpts,
  );

  // Shipping address
  const shipping = session.shipping_details || session.customer_details;
  const shippingAddress = shipping?.address
    ? {
        line1: shipping.address.line1 || "",
        line2: shipping.address.line2 || "",
        city: shipping.address.city || "",
        state: shipping.address.state || "",
        postal_code: shipping.address.postal_code || "",
        country: shipping.address.country || "",
      }
    : { line1: "", city: "", state: "", postal_code: "", country: "" };

  const customerName = session.customer_details?.name || session.shipping_details?.name || "Customer";
  const customerEmail = session.customer_details?.email || "";

  const subtotal = (session.amount_subtotal || 0) / 100;
  const total = (session.amount_total || 0) / 100;
  const shippingCost = (session.total_details?.amount_shipping || 0) / 100;
  const tax = (session.total_details?.amount_tax || 0) / 100;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      subtotal,
      shipping_cost: shippingCost,
      tax,
      total,
      status: "pending",
      payment_status: "paid",
      stripe_payment_intent_id: session.payment_intent,
      shipping_address: shippingAddress,
      customer_email: customerEmail,
      customer_name: customerName,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Failed to create order:", orderError);
    return;
  }

  // Create order items
  const orderItems = lineItems.data.map((item) => ({
    order_id: order.id,
    product_name: item.description || "Product",
    quantity: item.quantity || 1,
    unit_price: (item.amount_total || 0) / 100 / (item.quantity || 1),
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) console.error("Failed to create order items:", itemsError);

  console.log(`Order ${order.id} created for session ${session.id}`);
}
