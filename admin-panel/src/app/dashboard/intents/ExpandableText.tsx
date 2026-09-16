'use client';

import { useState } from 'react';

export function ExpandableText({ text, maxLength = 60 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;
  
  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  return (
    <div className="whitespace-normal break-words">
      <span>{isExpanded ? text : `${text.slice(0, maxLength)}...`}</span>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 text-indigo-500 hover:text-indigo-400 font-medium text-xs whitespace-nowrap"
      >
        {isExpanded ? 'See less' : 'See more'}
      </button>
    </div>
  );
}
