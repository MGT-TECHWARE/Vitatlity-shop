"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function TrustBadges({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const badges = [
    {
      label: "Third-Party Tested",
      value: "100%",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: "GMP Certified",
      value: "Yes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      label: "Made in USA",
      value: "100%",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
    },
    {
      label: "Free Shipping",
      value: "$75+",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 18h14M5 18a2 2 0 01-2-2V6a1 1 0 011-1h12a1 1 0 011 1v2m-2 10a2 2 0 01-2-2h4a2 2 0 01-2 2zm8 0V10a1 1 0 00-1-1h-2l-3 4h4v3" />
        </svg>
      ),
    },
  ];

  const isDark = variant === "dark";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {badges.map((badge) => (
        <motion.div
          key={badge.label}
          variants={item}
          className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-500 ${
            isDark
              ? "border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/15"
              : "border-border/30 bg-card shadow-soft hover:shadow-card hover:-translate-y-0.5"
          }`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            isDark ? "bg-green/15 text-green" : "bg-green/10 text-green"
          }`}>
            {badge.icon}
          </div>
          <div>
            <p className={`text-[11px] ${isDark ? "text-white/40" : "text-muted"}`}>
              {badge.label}
            </p>
            <p className={`text-sm font-bold ${isDark ? "text-green" : "text-green"}`}>
              {badge.value}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
