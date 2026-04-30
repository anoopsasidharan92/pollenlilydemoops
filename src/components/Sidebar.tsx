"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Radio,
  ArrowLeftRight,
  Users,
  BarChart3,
  FileBarChart,
  Settings,
  LogOut,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Product Master", icon: Package, href: "/product-master" },
  { label: "Channels", icon: Radio, href: "/channels" },
  { label: "Transactions", icon: ArrowLeftRight, href: "/transactions" },
  { label: "Customers", icon: Users, href: "/customers" },
  { label: "Insights", icon: BarChart3, href: "/insights" },
  { label: "Reports", icon: FileBarChart, href: "/reports" },
  { label: "Account & Team Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] min-h-screen bg-sidebar-bg flex flex-col shrink-0">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">P</span>
          </div>
          <span className="text-white font-semibold text-sm">Pollen LMS</span>
        </div>
        <button className="text-white/50 hover:text-white/80 transition-colors">
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="px-3 py-2">
        <div className="bg-primary-dark/60 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
            L
          </div>
          <span className="text-white text-xs font-medium">Loreal</span>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white text-xs font-semibold">Lily - AI Orchestrator</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              <span className="text-green-300 text-[10px]">I work on mobile</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 ${
                isActive
                  ? "bg-sidebar-active text-white font-medium"
                  : "text-white/70 hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/60 hover:text-white/80 hover:bg-sidebar-hover transition-all w-full">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        <div className="px-3 pt-2 text-[10px] text-white/30">
          Pollen LMS v1.53
        </div>
      </div>
    </aside>
  );
}
