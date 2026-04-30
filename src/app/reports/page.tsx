"use client";

import AppShell from "@/components/AppShell";
import LilyChat from "@/components/LilyChat";
import { ffAnalytics, ffListings } from "@/lib/ff-data";
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingBag,
  BarChart3,
  Monitor,
  MapPin,
  Package,
  Download,
  Calendar,
  Target,
  Sparkles,
  PieChart,
} from "lucide-react";

export default function Reports() {
  const { skuSellThrough, hourlyTraffic, departmentBreakdown } = ffAnalytics;
  const maxHourlyTraffic = Math.max(...hourlyTraffic.map((h) => h.online + h.bazaar));
  const overallSellThrough = ffListings.filter((l) => l.status !== "Upcoming")
    .reduce((acc, l) => acc + l.soldQty, 0) /
    ffListings.filter((l) => l.status !== "Upcoming")
      .reduce((acc, l) => acc + l.allocatedQty, 0) * 100;

  return (
    <AppShell>
      <div className="p-6 space-y-4 max-w-[1200px]">
        <LilyChat />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              F&F Post-Event Analytics
            </h1>
            <p className="text-xs text-text-muted mt-0.5">Employee Friends & Family Sale · Apr 25–May 2, 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-medium text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface-muted transition-colors">
              <Calendar size={12} /> Apr 25 – May 2, 2026
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition-colors">
              <Download size={12} /> Export Report
            </button>
          </div>
        </div>

        {/* Top-line KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Net Revenue Recovered", value: `$${(ffAnalytics.totalRevenue / 1000).toFixed(1)}K`, sub: `${ffAnalytics.netRecoveryRate}% of retail value`, color: "text-accent-green", bg: "bg-green-50", icon: DollarSign },
            { label: "Total Orders", value: ffAnalytics.totalOrders, sub: `${ffAnalytics.onlineOrders} online · ${ffAnalytics.bazaarOrders} bazaar`, color: "text-primary", bg: "bg-primary-lighter", icon: ShoppingBag },
            { label: "Unique Buyers", value: ffAnalytics.uniqueBuyers, sub: `Avg. order: $${ffAnalytics.avgOrderValue.toFixed(0)}`, color: "text-accent-blue", bg: "bg-blue-50", icon: Users },
            { label: "Overall Sell-Through", value: `${overallSellThrough.toFixed(1)}%`, sub: `${ffListings.filter((l) => l.status === "Sold Out").length} SKUs fully sold`, color: "text-accent-green", bg: "bg-green-50", icon: Target },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{stat.sub}</p>
              <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue split and net recovery */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <PieChart size={14} className="text-primary" /> Revenue by Channel
            </h3>
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#E5E7EB" strokeWidth="4"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#3B82F6" strokeWidth="4"
                    strokeDasharray={`${(ffAnalytics.onlineRevenue / ffAnalytics.totalRevenue * 100).toFixed(0)}, 100`}
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#F59E0B" strokeWidth="4"
                    strokeDasharray={`${(ffAnalytics.bazaarRevenue / ffAnalytics.totalRevenue * 100).toFixed(0)}, 100`}
                    strokeDashoffset={`-${(ffAnalytics.onlineRevenue / ffAnalytics.totalRevenue * 100).toFixed(0)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-sm font-bold">${(ffAnalytics.totalRevenue / 1000).toFixed(1)}K</span>
                  <span className="text-[9px] text-text-muted">Total</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="text-accent-blue" />
                  <div>
                    <p className="text-xs font-semibold">${(ffAnalytics.onlineRevenue / 1000).toFixed(1)}K</p>
                    <p className="text-[10px] text-text-muted">Online ({(ffAnalytics.onlineRevenue / ffAnalytics.totalRevenue * 100).toFixed(0)}%)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-accent-orange" />
                  <div>
                    <p className="text-xs font-semibold">${(ffAnalytics.bazaarRevenue / 1000).toFixed(1)}K</p>
                    <p className="text-[10px] text-text-muted">Bazaar ({(ffAnalytics.bazaarRevenue / ffAnalytics.totalRevenue * 100).toFixed(0)}%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-accent-green" /> Net Recovery
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Original Retail Value</span>
                <span className="font-medium">${(ffAnalytics.originalRetailValue / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">F&F Sale Revenue</span>
                <span className="font-medium text-accent-green">${(ffAnalytics.recoveredValue / 1000).toFixed(1)}K</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-xs">
                <span className="font-semibold">Net Recovery Rate</span>
                <span className="font-bold text-accent-green text-base">{ffAnalytics.netRecoveryRate}%</span>
              </div>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-3">
                <div className="bg-accent-green h-3 rounded-full" style={{ width: `${ffAnalytics.netRecoveryRate}%` }} />
              </div>
              <p className="text-[10px] text-text-muted">
                Recovery rate accounts for F&F discount applied. Without F&F event, estimated write-off would be 100%.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Users size={14} className="text-accent-blue" /> By Department
            </h3>
            <div className="space-y-2">
              {departmentBreakdown.slice(0, 6).map((dept) => {
                const maxSpend = departmentBreakdown[0].spend;
                return (
                  <div key={dept.department} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-text-primary">{dept.department}</span>
                      <div className="flex items-center gap-3 text-[10px] text-text-muted">
                        <span>{dept.orders} orders</span>
                        <span className="font-medium text-text-primary">${(dept.spend / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-accent-blue h-1.5 rounded-full"
                        style={{ width: `${(dept.spend / maxSpend) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SKU sell-through table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Package size={14} className="text-primary" /> SKU Sell-Through Report
            </h3>
            <button className="flex items-center gap-1.5 text-xs text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface-muted">
              <Download size={12} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-muted/50">
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">SKU</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Product</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Brand</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Allocated</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Sold</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Sell-Through</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {skuSellThrough.map((item) => (
                  <tr key={item.sku} className="border-b border-border/30 hover:bg-surface-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-xs font-mono text-primary">{item.sku}</td>
                    <td className="px-3 py-2.5 text-xs text-text-primary max-w-[200px] truncate">{item.product}</td>
                    <td className="px-3 py-2.5 text-xs text-text-secondary">{item.brand}</td>
                    <td className="px-3 py-2.5 text-xs font-medium">{item.allocated.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-xs font-medium">{item.sold.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.sellThrough >= 90 ? "bg-accent-green" :
                              item.sellThrough >= 60 ? "bg-accent-blue" :
                              item.sellThrough > 0 ? "bg-accent-orange" :
                              "bg-gray-300"
                            }`}
                            style={{ width: `${Math.min(item.sellThrough, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          item.sellThrough >= 90 ? "text-accent-green" :
                          item.sellThrough >= 60 ? "text-accent-blue" :
                          item.sellThrough > 0 ? "text-accent-orange" :
                          "text-text-muted"
                        }`}>
                          {item.sellThrough}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs font-medium">${item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-surface-muted/50 border-t border-border">
                  <td className="px-4 py-2.5 text-xs font-bold" colSpan={3}>TOTAL</td>
                  <td className="px-3 py-2.5 text-xs font-bold">
                    {skuSellThrough.reduce((s, i) => s + i.allocated, 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-bold">
                    {skuSellThrough.reduce((s, i) => s + i.sold, 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-bold text-accent-green">
                    {(skuSellThrough.reduce((s, i) => s + i.sold, 0) / skuSellThrough.reduce((s, i) => s + i.allocated, 0) * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-xs font-bold">
                    ${skuSellThrough.reduce((s, i) => s + i.revenue, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Hourly traffic chart */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-primary" /> Hourly Traffic (Today)
          </h3>
          <div className="flex items-end gap-2 h-36">
            {hourlyTraffic.map((h) => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full flex flex-col items-center">
                  <span className="text-[8px] text-accent-orange font-medium mb-0.5">{h.bazaar || ""}</span>
                  <div
                    className="w-full bg-accent-orange/30 rounded-t"
                    style={{ height: `${(h.bazaar / maxHourlyTraffic) * 80}px` }}
                  />
                </div>
                <div className="w-full flex flex-col items-center">
                  <div
                    className="w-full bg-accent-blue rounded-t"
                    style={{ height: `${(h.online / maxHourlyTraffic) * 80}px` }}
                  />
                </div>
                <span className="text-[8px] text-text-muted mt-1">{h.hour}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-accent-blue" />
              <span className="text-[10px] text-text-muted">Online Orders</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-accent-orange/30" />
              <span className="text-[10px] text-text-muted">Bazaar Orders</span>
            </div>
          </div>
        </div>

        {/* Post-event traceability callout */}
        <div className="bg-white rounded-xl border border-primary/20 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Post-Event Traceability</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Every F&F transaction is traceable by buyer ID, department, channel (online vs. bazaar), and order ID.
                This enables fraudulent return detection and grey-market leakage prevention. All purchases are linked to verified employee SSO identities.
              </p>
              <div className="flex items-center gap-4 mt-3">
                {["Buyer-level audit trail", "Return fraud detection", "Grey-market leakage alerts", "Department-level analytics"].map((item) => (
                  <span key={item} className="text-[10px] bg-primary-lighter text-primary px-2.5 py-1 rounded-full font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
