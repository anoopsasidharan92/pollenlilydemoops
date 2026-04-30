"use client";

import AppShell from "@/components/AppShell";
import LilyChat from "@/components/LilyChat";
import { sustainabilityData } from "@/lib/demo-data";
import {
  Leaf,
  TrendingUp,
  Package,
  Scale,
  Wind,
  DollarSign,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function Insights() {
  const { channelPerformance, monthlyTrend } = sustainabilityData;
  const maxUnits = Math.max(...monthlyTrend.map((m) => m.units));

  return (
    <AppShell>
      <div className="p-6 space-y-4 max-w-[1200px]">
        <LilyChat />

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Products Diverted from Waste",
              value: sustainabilityData.totalProductsDiverted.toLocaleString(),
              unit: "units",
              icon: Package,
              color: "text-primary",
              bg: "bg-primary-lighter",
              change: "+12.4%",
              up: true,
            },
            {
              label: "Weight Saved from Landfill",
              value: (sustainabilityData.totalWeightKg / 1000).toFixed(1),
              unit: "tonnes",
              icon: Scale,
              color: "text-accent-green",
              bg: "bg-green-50",
              change: "+8.7%",
              up: true,
            },
            {
              label: "CO₂e Emissions Avoided",
              value: (sustainabilityData.co2eAvoided / 1000).toFixed(1),
              unit: "tonnes CO₂e",
              icon: Wind,
              color: "text-accent-blue",
              bg: "bg-blue-50",
              change: "+15.2%",
              up: true,
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.up ? "text-accent-green" : "text-accent-red"}`}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.unit} · {stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Revenue Recovered",
              value: `$${(sustainabilityData.revenueRecovered / 1000).toFixed(0)}K`,
              icon: DollarSign,
              color: "text-accent-green",
              bg: "bg-green-50",
            },
            {
              label: "Sell-through Rate",
              value: `${sustainabilityData.sellThroughRate}%`,
              icon: TrendingUp,
              color: "text-primary",
              bg: "bg-primary-lighter",
            },
            {
              label: "Avg. Days to Sell",
              value: `${sustainabilityData.avgDaysToSell}`,
              icon: Clock,
              color: "text-accent-orange",
              bg: "bg-orange-50",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 size={16} className="text-primary" />
                Monthly Recovery Trend
              </h3>
            </div>
            <div className="flex items-end gap-3 h-40">
              {monthlyTrend.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-0.5">
                    <span className="text-[9px] text-accent-blue font-medium">
                      {(month.co2e / 1000).toFixed(1)}t
                    </span>
                    <div
                      className="w-full bg-accent-blue/20 rounded-t"
                      style={{ height: `${(month.co2e / 3500) * 100}px` }}
                    />
                  </div>
                  <div className="w-full flex flex-col items-center gap-0.5">
                    <div
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${(month.units / maxUnits) * 60}px` }}
                    />
                    <span className="text-[9px] text-text-muted">{month.month}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-[10px] text-text-muted">Units Sold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-accent-blue/20" />
                <span className="text-[10px] text-text-muted">CO₂e Avoided</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Leaf size={16} className="text-accent-green" />
                Channel Performance
              </h3>
            </div>
            <div className="space-y-3">
              {channelPerformance.map((ch) => (
                <div key={ch.channel} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-primary">{ch.channel}</span>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{ch.units.toLocaleString()} units</span>
                      <span>${(ch.revenue / 1000).toFixed(0)}K</span>
                      <span className={`font-medium ${ch.sellThrough > 90 ? "text-accent-green" : ch.sellThrough > 80 ? "text-accent-blue" : "text-accent-orange"}`}>
                        {ch.sellThrough}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        ch.sellThrough > 90
                          ? "bg-accent-green"
                          : ch.sellThrough > 80
                          ? "bg-accent-blue"
                          : "bg-accent-orange"
                      }`}
                      style={{ width: `${ch.sellThrough}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Leaf size={16} className="text-accent-green" />
            Sustainability Scorecard
          </h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${sustainabilityData.sellThroughRate}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-green">{sustainabilityData.sellThroughRate}%</span>
                </div>
              </div>
              <p className="text-xs font-medium">Sell-through Rate</p>
              <p className="text-[10px] text-text-muted">Target: 85%</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6B3FA0" strokeWidth="3" strokeDasharray="92, 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">92%</span>
                </div>
              </div>
              <p className="text-xs font-medium">Recovery Rate</p>
              <p className="text-[10px] text-text-muted">Target: 80%</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="78, 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-blue">78%</span>
                </div>
              </div>
              <p className="text-xs font-medium">Waste Diversion</p>
              <p className="text-[10px] text-text-muted">Target: 70%</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="65, 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-orange">A-</span>
                </div>
              </div>
              <p className="text-xs font-medium">ESG Score</p>
              <p className="text-[10px] text-text-muted">Industry avg: B+</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
