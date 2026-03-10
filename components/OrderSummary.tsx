"use client";

import Link from "next/link";
import { useCart } from "@/utils/cart-context";
import { formatPrice } from "@/utils/format";

export default function OrderSummary({
  showCheckoutButton = true,
}: {
  showCheckoutButton?: boolean;
}) {
  const { items, totalPrice } = useCart();
  const shippingCost = totalPrice >= 75 ? 0 : 5.99;
  const total = totalPrice + shippingCost;

  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <h2 className="text-lg font-bold font-heading mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <span className="text-primary/70 truncate mr-2">
              {item.name} x{item.quantity}
            </span>
            <span className="font-medium flex-shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-success font-medium">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>
        {shippingCost > 0 && (
          <p className="text-xs text-accent">
            Add {formatPrice(75 - totalPrice)} more for free shipping!
          </p>
        )}
      </div>

      <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="block w-full text-center mt-4 py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-light transition-colors"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
