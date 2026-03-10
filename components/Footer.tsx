"use client";

import Link from "next/link";
import Image from "next/image";
import FDADisclaimer from "./FDADisclaimer";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Footer() {
  return (
    <footer className="bg-dark text-white relative overflow-hidden">
      {/* Atmospheric top glow */}
      <div className="absolute top-0 left-[30%] w-[400px] h-[200px] bg-green/[0.04] rounded-full blur-[100px]" />

      {/* Divider */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-green/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="md:col-span-4">
            <div className="mb-4">
              <Image src="/nexora-logo.png" alt="Nexora Peptides" width={180} height={45} className="object-contain h-10 w-auto" />
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Premium research peptides, rigorously tested for purity
              and quality you can trust.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {["Instagram", "Twitter", "YouTube"].map((social) => (
                <span
                  key={social}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-green hover:border-green/30 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-[10px] font-bold">{social[0]}</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Shop */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white/60 mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li><Link href="/products" className="hover:text-green transition-colors duration-300">All Products</Link></li>
              <li><Link href="/products?category=vitamins" className="hover:text-green transition-colors duration-300">Vitamins</Link></li>
              <li><Link href="/products?category=protein" className="hover:text-green transition-colors duration-300">Protein</Link></li>
              <li><Link href="/products?category=weight-loss" className="hover:text-green transition-colors duration-300">Weight Loss</Link></li>
              <li><Link href="/products?category=bundles" className="hover:text-green transition-colors duration-300">Bundles</Link></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white/60 mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li><Link href="/account" className="hover:text-green transition-colors duration-300">My Account</Link></li>
              <li><Link href="/account" className="hover:text-green transition-colors duration-300">Order Tracking</Link></li>
              <li><span className="cursor-default">Shipping & Returns</span></li>
              <li><span className="cursor-default">FAQ</span></li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white/60 mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
              <li><span className="cursor-default">Refund Policy</span></li>
            </ul>
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white/60 mb-4">Stay Updated</h4>
            <p className="text-sm text-white/40 mb-3">Get wellness tips and exclusive offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-l-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green/50 transition-colors duration-300"
              />
              <button className="px-4 py-2.5 bg-green text-white rounded-r-xl hover:bg-green-light transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-6 border-t border-white/[0.06]"
        >
          <FDADisclaimer variant="dark" />
          <p className="text-[11px] text-white/20 mt-4 text-center">
            &copy; {new Date().getFullYear()} Nexora Peptides. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
