"use client";

import { usePathname } from"next/navigation";
import Link from"next/link";
import React from"react";

export function Breadcrumb() {
  const pathname = usePathname();
  
  // Split the pathname and filter out empty strings
  const segments = pathname.split('/').filter(Boolean);
  
  // Example path: /dashboard/workflows/new
  // segments = ["dashboard","workflows","new"]

  return (
    <div className="flex items-center text-sm text-zinc-400">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isDashboard = segment ==="dashboard";
        
        // Format the text:"workflows" ->"Workflows"
        let formattedText = segment.charAt(0).toUpperCase() + segment.slice(1);
        
        return (
          <React.Fragment key={href}>
            {isLast ? (
              <span className={`font-medium ${isDashboard ? 'text-zinc-100' : 'text-indigo-400'}`}>
                {formattedText}
              </span>
            ) : (
              <Link href={href} className="font-medium text-zinc-100 hover:text-indigo-400 transition-colors">
                {formattedText}
              </Link>
            )}
            
            {!isLast && <span className="mx-2 text-zinc-600">/</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
