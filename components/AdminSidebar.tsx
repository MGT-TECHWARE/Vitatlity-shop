"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/admin/dashboard/products", label: "Products", icon: "package" },
  { href: "/admin/dashboard/orders", label: "Orders", icon: "receipt" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark text-white min-h-screen flex flex-col">
      <div className="p-6">
        <div>
          <Image src="/nexora-logo.png" alt="Nexora Peptides" width={160} height={40} className="object-contain h-9 w-auto" />
        </div>
        <p className="text-[11px] text-white/40 mt-1 ml-8">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                active
                  ? "bg-green/15 text-green font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon === "grid" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
              {item.icon === "package" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
              {item.icon === "receipt" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <Link
          href="/"
          className="text-xs text-green/60 hover:text-green transition-colors block mb-3"
        >
          &larr; View Store
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
