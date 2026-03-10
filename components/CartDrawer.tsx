"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/utils/cart-context";
import { formatPrice } from "@/utils/format";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-elevated"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <h2 className="text-lg font-bold font-heading">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 text-muted hover:text-primary hover:bg-surface rounded-lg transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                      <svg className="w-7 h-7 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-muted mb-1 text-sm">Your cart is empty</p>
                    <Link
                      href="/products"
                      onClick={onClose}
                      className="text-sm text-green font-semibold hover:text-green-light transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <motion.div
                          key={item.productId}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-3 pb-4 border-b border-border/40"
                        >
                          <div className="w-16 h-16 bg-surface rounded-xl overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted/30 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm font-bold mt-0.5">
                              {formatPrice(item.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-6 h-6 rounded-md bg-surface flex items-center justify-center text-xs hover:bg-border/50 transition-colors"
                              >
                                -
                              </button>
                              <span className="text-sm w-6 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-6 h-6 rounded-md bg-surface flex items-center justify-center text-xs hover:bg-border/50 transition-colors"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="ml-auto text-xs text-muted hover:text-error transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 py-4 border-t border-border/50 space-y-3"
                  >
                    <div className="flex justify-between font-medium">
                      <span className="text-sm">Subtotal</span>
                      <span className="text-base font-bold">{formatPrice(totalPrice)}</span>
                    </div>
                    <p className="text-xs text-muted">
                      Shipping calculated at checkout.
                      {totalPrice < 75 && " Free shipping on orders over $75!"}
                    </p>
                    <Link
                      href="/cart"
                      onClick={onClose}
                      className="block w-full text-center py-2.5 border border-border text-primary rounded-full text-sm font-medium hover:bg-surface transition-colors"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={onClose}
                      className="block w-full text-center py-2.5 bg-green text-white rounded-full text-sm font-semibold hover:bg-green-light transition-colors shadow-card"
                    >
                      Checkout
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
