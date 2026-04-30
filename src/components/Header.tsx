"use client";

import { Bell, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="text-sm font-semibold text-text-primary">Pollen LMS</div>
      <div className="flex items-center gap-4">
        <button className="relative text-text-secondary hover:text-text-primary transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent-red rounded-full text-white text-[8px] flex items-center justify-center font-bold">
            3
          </span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary-lighter flex items-center justify-center">
            <span className="text-primary text-xs font-bold">L</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-text-primary">Lorea</span>
              <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-bold">ENTERPRISE</span>
            </div>
            <span className="text-[11px] text-text-muted">Christopher Laguitan</span>
          </div>
          <ChevronDown size={14} className="text-text-muted" />
        </div>
      </div>
    </header>
  );
}
