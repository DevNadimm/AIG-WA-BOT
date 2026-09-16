"use client";

import Link from"next/link";
import { usePathname } from"next/navigation";
import React from"react";

interface SidebarLinkProps {
  href: string;
  name: string;
  icon: React.ReactNode;
}

export function SidebarLink({ href, name, icon }: SidebarLinkProps) {
  const pathname = usePathname();

  // Exact match for /dashboard, otherwise check if pathname starts with href
  const isActive = href === '/dashboard' 
    ? pathname === '/dashboard' 
    : pathname.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        prefetch={true}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
          isActive 
            ?"bg-white text-zinc-900" 
            :"/50"
        }`}
      >
        <span className={`flex items-center justify-center transition-colors ${
          isActive ?"text-zinc-900" :"text-zinc-500 group-hover:text-zinc-300"
        }`}>
          {icon}
        </span>
        {name}
      </Link>
    </li>
  );
}
