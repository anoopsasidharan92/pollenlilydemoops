"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import LilyChat from "@/components/LilyChat";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

type UploadStage = "idle" | "uploading" | "processing" | "complete";

export default function Dashboard() {
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);

  const simulateUpload = () => {
    setUploadStage("uploading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploadStage("processing");
          setTimeout(() => setUploadStage("complete"), 2000);
          return 100;
        }
        return p + 8;
      });
    }, 100);
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-[1200px]">
        <LilyChat />

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-base font-semibold">Welcome to Pollen LMS</h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Upload your inventory to get started. No ERP integration needed — just upload an Excel file and Lily will handle the rest.
          </p>

          {uploadStage === "idle" && (
            <div
              onClick={simulateUpload}
              className="border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary-50/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-primary-lighter flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">Drop your inventory file here or click to upload</p>
                <p className="text-xs text-text-muted mt-1">Supports .xlsx, .csv — Max 10MB</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FileSpreadsheet size={14} className="text-accent-green" />
                <span className="text-xs text-text-secondary">Sample: L&apos;Oréal_Indonesia_Inventory_Q2_2026.xlsx</span>
              </div>
            </div>
          )}

          {uploadStage === "uploading" && (
            <div className="border border-border rounded-xl p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <FileSpreadsheet size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Loreal_Indonesia_Inventory_Q2_2026.xlsx</p>
                  <p className="text-xs text-text-muted">2.4 MB · 19 SKUs · 6 categories</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-text-muted">{progress}% uploaded</p>
            </div>
          )}

          {uploadStage === "processing" && (
            <div className="border border-primary/20 bg-primary-50/30 rounded-xl p-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-lighter flex items-center justify-center animate-pulse">
                  <Sparkles size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Lily is processing your inventory...</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Categorizing products · Setting optimal prices · Preparing channel allocation
                  </p>
                </div>
              </div>
            </div>
          )}

          {uploadStage === "complete" && (
            <div className="space-y-4 animate-fade-in">
              <div className="border border-accent-green/20 bg-green-50/30 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-accent-green" />
                <div>
                  <p className="text-sm font-medium text-accent-green">Inventory uploaded successfully!</p>
                  <p className="text-xs text-text-secondary">19 SKUs processed across 6 categories. Ready for allocation.</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total SKUs", value: "19", icon: Package, color: "text-primary", bg: "bg-primary-lighter" },
                  { label: "Total Value", value: "$186,420", icon: TrendingUp, color: "text-accent-green", bg: "bg-green-50" },
                  { label: "Avg. Shelf Life", value: "4.2 mo", icon: Clock, color: "text-accent-orange", bg: "bg-orange-50" },
                  { label: "Near Expiry", value: "6 items", icon: AlertTriangle, color: "text-accent-red", bg: "bg-red-50" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-border rounded-lg p-3">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <p className="text-lg font-semibold">{stat.value}</p>
                    <p className="text-xs text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href="/product-master"
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Continue to Product Master <ArrowRight size={14} />
                </a>
                <button
                  onClick={() => setUploadStage("idle")}
                  className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-muted transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                "View all channels",
                "Check pending transactions",
                "Run sustainability report",
              ].map((action) => (
                <button
                  key={action}
                  className="w-full text-left text-xs text-text-secondary hover:text-primary hover:bg-primary-50/50 px-3 py-2 rounded-lg transition-colors flex items-center justify-between group"
                >
                  {action}
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {[
                { text: "New offer from PT Mitra Kosmetik", time: "2h ago" },
                { text: "Order TXN-003 approved", time: "5h ago" },
                { text: "Outreach sent to 4 buyers", time: "1d ago" },
              ].map((item) => (
                <div key={item.text} className="flex justify-between items-start text-xs px-3 py-2">
                  <span className="text-text-secondary">{item.text}</span>
                  <span className="text-text-muted shrink-0 ml-2">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Sustainability Snapshot</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">Sell-through Rate</span>
                  <span className="font-medium text-accent-green">87.3%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-accent-green h-1.5 rounded-full" style={{ width: "87.3%" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-green-50/50 rounded-lg p-2">
                  <p className="text-sm font-semibold text-accent-green">28.5t</p>
                  <p className="text-[10px] text-text-muted">Waste Avoided</p>
                </div>
                <div className="bg-blue-50/50 rounded-lg p-2">
                  <p className="text-sm font-semibold text-accent-blue">14.3t</p>
                  <p className="text-[10px] text-text-muted">CO₂e Saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
