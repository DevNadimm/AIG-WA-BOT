"use client";

import React, { useState, useRef, useEffect } from"react";

export function ConversationsLayout({ 
  inbox, 
  chat 
}: { 
  inbox: React.ReactNode; 
  chat: React.ReactNode;
}) {
  // Start with a default width of 320px
  const [inboxWidth, setInboxWidth] = useState(320); 
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = e.clientX - containerRect.left;
      
      // Constraints
      if (newWidth < 280) newWidth = 280;
      if (newWidth > 600) newWidth = 600;
      
      setInboxWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto'; 
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex h-[calc(100vh-8rem)] bg-[#0c0c0e] rounded-xl border border-zinc-800/50 shadow-sm overflow-hidden">
      
      {/* Inbox Section */}
      <div 
        style={{ width: inboxWidth }} 
        className="flex-shrink-0 flex flex-col h-full bg-[#0c0c0e]"
      >
        {inbox}
      </div>

      {/* Resizer Handle */}
      <div 
        className="relative w-1.5 cursor-col-resize z-10 group"
        onMouseDown={(e) => {
          e.preventDefault();
          isDragging.current = true;
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none'; 
        }}
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-zinc-800/50 group-hover:bg-indigo-500/70 group-active:bg-indigo-500 transition-colors" />
      </div>

      {/* Chat Section */}
      <div className="flex-1 min-w-0 bg-[#0c0c0e] flex flex-col h-full relative">
        {chat}
      </div>
      
    </div>
  );
}
